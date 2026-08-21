import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
export const SERVER = join(ROOT, 'scripts', 'dev-server.mjs');

export function arg(name, fallback = undefined) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

export function chromePath() {
  const candidates = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
  ].filter(Boolean);
  const found = candidates.find((path) => existsSync(path));
  if (!found) throw new Error('No Chrome/Chromium binary found. Set CHROME_BIN or install Chrome/Chromium.');
  return found;
}

export async function waitFor(url, timeout = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try { const response = await fetch(url); if (response.ok) return; } catch (_) {}
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

export async function startServer(deckPath, port = 4173) {
  const child = spawn(process.execPath, [SERVER, '--deck', deckPath, '--port', String(port)], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = '';
  child.stdout.on('data', (chunk) => { logs += chunk.toString(); });
  child.stderr.on('data', (chunk) => { logs += chunk.toString(); });
  try { await waitFor(`http://127.0.0.1:${port}/__deck_hash`); }
  catch (error) { child.kill('SIGTERM'); throw new Error(`${error.message}\n${logs}`); }
  return { child, url: `http://127.0.0.1:${port}/${deckPath.replace(/^\/+|\/+$/g, '')}/` };
}

export function runChrome(args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(chromePath(), [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
      '--disable-background-networking', '--disable-component-update', '--disable-crash-reporter', '--disable-sync',
      '--hide-scrollbars', '--mute-audio', '--run-all-compositor-stages-before-draw',
      `--user-data-dir=/tmp/agent-native-presentation-chrome-${process.pid}-${Date.now()}`,
      ...args
    ], { cwd: ROOT, detached: true, stdio: options.stdio || ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '', settled = false;
    const target = args.find((item) => item.startsWith('--screenshot=') || item.startsWith('--print-to-pdf='))?.split('=').slice(1).join('=');
    const dumpDom = args.includes('--dump-dom');
    let poll;
    let timer;
    const finish = (error = null) => {
      if (settled) return;
      settled = true;
      clearInterval(poll);
      clearTimeout(timer);
      try { process.kill(-child.pid, 'SIGTERM'); } catch (_) { child.kill('SIGTERM'); }
      if (error) reject(error); else resolvePromise({ stdout, stderr });
    };
    poll = setInterval(() => { if (target && existsSync(target)) finish(); }, 100);
    timer = setTimeout(() => dumpDom ? finish() : finish(new Error(`Chrome timed out\n${stderr}\n${stdout}`)), options.timeout || (dumpDom ? 5000 : 15000));
    child.stdout?.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr?.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', (error) => finish(error));
    child.on('close', (code) => { if (!settled && code !== 0) finish(new Error(`Chrome exited ${code}\n${stderr}\n${stdout}`)); else if (!settled && !target) setTimeout(() => finish(), 250); });
  });
}

export function ensureDir(path) { mkdirSync(path, { recursive: true }); return path; }
