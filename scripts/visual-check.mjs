import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { arg, ROOT } from './lib/browser.mjs';

function pngSize(buffer) { if (buffer.readUInt32BE(0) !== 0x89504e47) return null; return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }; }
const deckPath = arg('deck', 'examples/example-deck').replace(/^\/+|\/+$/g, '');
const deckDir = join(ROOT, deckPath);
const deck = JSON.parse(await readFile(join(deckDir, 'deck.json'), 'utf8'));
const dir = join(deckDir, 'screenshots');
let files = [];
try { files = (await readdir(dir)).filter((file) => /^\d+\.png$/.test(file)).sort(); } catch (_) {}
const errors = [];
if (files.length !== deck.slides.length) errors.push(`expected ${deck.slides.length} screenshots, found ${files.length}`);
for (const file of files) { const buffer = await readFile(join(dir, file)); const size = pngSize(buffer); if (!size || size.width !== 1280 || size.height !== 720) errors.push(`${file}: expected 1280x720 PNG`); if (buffer.length < 8000) errors.push(`${file}: suspiciously small (${buffer.length} bytes)`); }
if (errors.length) { console.error('VISUAL CHECK FAIL'); errors.forEach((error) => console.error(`- ${error}`)); process.exit(1); }
console.log(`VISUAL CHECK PASS: ${files.length} screenshots, each 1280x720 and non-empty`);
