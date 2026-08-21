import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { arg, ensureDir, ROOT, runChrome, startServer } from './lib/browser.mjs';

const deckPath = arg('deck', 'examples/example-deck').replace(/^\/+|\/+$/g, '');
const deckDir = join(ROOT, deckPath);
const deck = JSON.parse(await readFile(join(deckDir, 'deck.json'), 'utf8'));
const output = arg('out', join(ROOT, 'dist', `${deckPath.split('/').pop()}.pdf`));
ensureDir(join(output, '..'));
const port = Number(arg('port', 4173));
const server = await startServer(deckPath, port);
try {
  await runChrome(['--print-to-pdf-no-header', `--print-to-pdf=${output}`, '--virtual-time-budget=1800', `${server.url}?print=all`]);
} finally { server.child.kill('SIGTERM'); }
const bytes = (await stat(output)).size;
const pdf = await readFile(output);
const pages = Math.max(0, (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length);
console.log(`PDF PASS: ${output}`);
console.log(`bytes=${bytes} pages=${pages} expected=${deck.slides.length}`);
if (!bytes || pages < deck.slides.length) process.exitCode = 1;
