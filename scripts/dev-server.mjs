import { createHash } from 'node:crypto';
import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = process.argv.slice(2);
const value = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const deck = String(value('deck', 'examples/example-deck')).replace(/^\/+|\/+$/g, '');
const port = Number(value('port', 4173));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.md':'text/markdown; charset=utf-8' };

function filesUnder(dir) {
  const output = [];
  if (!existsSync(dir)) return output;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'screenshots', 'dist'].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) output.push(...filesUnder(path));
    else if (/\.(html|js|mjs|css|json|svg|md)$/.test(entry.name)) output.push(path);
  }
  return output;
}
function deckHash() {
  const hash = createHash('sha1');
  for (const file of filesUnder(ROOT).sort()) { const stat = statSync(file); hash.update(relative(ROOT, file)); hash.update(String(stat.mtimeMs)); hash.update(String(stat.size)); }
  return hash.digest('hex');
}
function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const requested = decoded === '/' ? `/${deck}/index.html` : decoded.endsWith('/') ? `${decoded}index.html` : decoded;
  const path = resolve(ROOT, `.${normalize(requested)}`);
  return path.startsWith(ROOT) ? path : null;
}
const server = createServer((request, response) => {
  if (request.url?.startsWith('/__deck_hash')) { response.writeHead(200, {'content-type':'text/plain','cache-control':'no-store'}); response.end(deckHash()); return; }
  const path = safePath(request.url || '/');
  if (!path || !existsSync(path) || !statSync(path).isFile()) { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, {'content-type': mime[extname(path)] || 'application/octet-stream', 'cache-control':'no-cache'});
  createReadStream(path).pipe(response);
});
server.listen(port, '127.0.0.1', () => console.log(`Deck server: http://127.0.0.1:${port}/${deck}/`));
