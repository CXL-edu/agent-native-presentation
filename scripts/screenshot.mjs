import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { arg, ensureDir, ROOT, runChrome, startServer } from './lib/browser.mjs';

const deckPath = arg('deck', 'examples/example-deck').replace(/^\/+|\/+$/g, '');
const deckDir = join(ROOT, deckPath);
const outputDir = ensureDir(join(deckDir, 'screenshots'));
for (const file of readdirSync(outputDir)) if (file.endsWith('.png')) rmSync(join(outputDir, file));
const deck = JSON.parse(await (await import('node:fs/promises')).readFile(join(deckDir, 'deck.json'), 'utf8'));
const port = Number(arg('port', 4173));
const server = await startServer(deckPath, port);
try {
  for (let i = 1; i <= deck.slides.length; i += 1) {
    const file = join(outputDir, `${String(i).padStart(3, '0')}.png`);
    await runChrome([`--window-size=1280,720`, `--screenshot=${file}`, '--virtual-time-budget=1200', `${server.url}?dev=0#${i}`]);
    console.log(`screenshot ${i}/${deck.slides.length}: ${file}`);
  }
} finally { server.child.kill('SIGTERM'); }
console.log(`SCREENSHOTS PASS: ${deck.slides.length} files in ${outputDir}`);
