import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const [, , input, outputArg] = process.argv;
if (!input || !outputArg || input === '--help') {
  console.log('Usage: node scripts/extract-pptx-theme.mjs reference.pptx themes/reference');
  process.exit(input ? 0 : 1);
}
const output = resolve(outputArg);
await mkdir(output, { recursive: true });
const python = String.raw`import json, sys, zipfile, xml.etree.ElementTree as ET
from collections import Counter
pptx, out = sys.argv[1], sys.argv[2]
ns = {'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
colors, fonts, images = Counter(), Counter(), []
with zipfile.ZipFile(pptx) as z:
    names = z.namelist()
    for name in names:
        if name.startswith('ppt/media/'):
            images.append(name.split('/')[-1])
    if 'ppt/theme/theme1.xml' in names:
        root = ET.fromstring(z.read('ppt/theme/theme1.xml'))
        for node in root.findall('.//a:srgbClr', ns): colors[node.attrib.get('val','').upper()] += 1
        for node in root.findall('.//a:latin', ns):
            if node.attrib.get('typeface'): fonts[node.attrib['typeface']] += 1
    slide_size = {'width': 1280, 'height': 720}
    if 'ppt/presentation.xml' in names:
        root = ET.fromstring(z.read('ppt/presentation.xml'))
        node = root.find('.//p:sldSz', ns)
        if node is not None:
            cx, cy = float(node.attrib.get('cx', 12192000)), float(node.attrib.get('cy', 6858000))
            ratio = 1280 / cx
            slide_size = {'width': 1280, 'height': round(cy * ratio)}
    top = [c for c,_ in colors.most_common(8)]
    palette = top + ['F6F8FB','FFFFFF','102033','0A7EA4','F18F3B','D7E0E8']
    palette = list(dict.fromkeys(palette))
    result = {'name': 'Extracted PPTX theme', 'canvas': slide_size, 'colors': {'bg': '#'+palette[0], 'surface': '#'+palette[1], 'textPrimary': '#'+palette[2], 'accentPrimary': '#'+palette[3], 'accentSecondary': '#'+palette[4], 'line': '#'+palette[5]}, 'fonts': {'display': fonts.most_common(1)[0][0] if fonts else 'sans-serif', 'body': fonts.most_common(1)[0][0] if fonts else 'sans-serif', 'mono': 'ui-monospace, monospace'}, 'assets': images}
with open(out + '/theme.json','w') as f: json.dump(result, f, indent=2, ensure_ascii=False)
css = ':root {\n' + '\n'.join('  --'+k.replace('_','-')+': '+v+';' for k,v in result['colors'].items()) + '\n}\n'
with open(out + '/theme.css','w') as f: f.write(css)
print(json.dumps({'theme': out + '/theme.json', 'css': out + '/theme.css', 'assets': images, 'colors': top}, ensure_ascii=False))`;
const result = spawnSync('python3', ['-c', python, resolve(input), output], { encoding: 'utf8' });
if (result.status !== 0) { console.error(result.stderr || result.stdout); process.exit(result.status || 1); }
console.log(result.stdout.trim());
