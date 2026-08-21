import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { arg, ROOT, runChrome, startServer } from './lib/browser.mjs';

const deckPath = arg('deck', 'examples/example-deck').replace(/^\/+|\/+$/g, '');
const deck = JSON.parse(await readFile(join(ROOT, deckPath, 'deck.json'), 'utf8'));
const port = Number(arg('port', 4173));
const server = await startServer(deckPath, port);
let output;
try { output = (await runChrome(['--window-size=1280,720', '--dump-dom', '--virtual-time-budget=2200', `${server.url}?layout=1#1`])).stdout; }
finally { server.child.kill('SIGTERM'); }
const match = output.match(/<title>LAYOUT_REPORT:([^<]+)<\/title>/) || output.match(/<div id="layout-report"[^>]*>(\{.*?\})<\/div>/s);
if (!match) { console.error('LAYOUT CHECK FAIL: browser did not return a layout report'); process.exit(1); }
const report = JSON.parse(decodeURIComponent(match[1]));
console.log(JSON.stringify(report, null, 2));
if (report.status === 'FAIL') process.exitCode = 1;
else console.log(`LAYOUT ${report.status}: ${deck.slides.length} slides checked`);
