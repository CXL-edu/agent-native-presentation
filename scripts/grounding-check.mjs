import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { arg, ROOT } from './lib/browser.mjs';

const deckPath = arg('deck', 'examples/example-deck').replace(/^\/+|\/+$/g, '');
const deckDir = join(ROOT, deckPath);
const deck = JSON.parse(await readFile(join(deckDir, 'deck.json'), 'utf8'));
const grounding = await readFile(join(deckDir, 'GROUNDING.md'), 'utf8');
const sourceMatches = [...grounding.matchAll(/^##\s+(source-[\w-]+)/gm)].map((m) => m[1]);
const claimMatches = [...grounding.matchAll(/^##\s+(claim-[\w-]+)/gm)].map((m) => m[1]);
const sourceIds = new Set(sourceMatches);
const claimIds = new Set(claimMatches);
const supportedTypes = new Set(['title', 'section', 'statement', 'comparison', 'metric', 'quote', 'image', 'chart', 'pipeline', 'timeline', 'equation', 'diagram', 'code', 'animated-svg', 'image-comparison', 'closing', 'custom']);
const errors = [], warnings = [];
const usedClaims = new Set();
const slideIds = new Set();
const numericPattern = /(?<![A-Za-z_-])\d+(?:\.\d+)?%?(?![A-Za-z_-])/;

if (!Array.isArray(deck.slides) || !deck.slides.length) errors.push('deck.json must contain a non-empty slides array');
if (sourceMatches.length !== sourceIds.size) errors.push('GROUNDING.md contains duplicate source IDs');
if (claimMatches.length !== claimIds.size) errors.push('GROUNDING.md contains duplicate claim IDs');

if (!sourceIds.size) errors.push('GROUNDING.md has no source records');
for (const id of sourceIds) {
  const block = grounding.slice(grounding.indexOf(`## ${id}`), grounding.indexOf('\n## ', grounding.indexOf(`## ${id}`) + 4) < 0 ? undefined : grounding.indexOf('\n## ', grounding.indexOf(`## ${id}`) + 4));
  if (!/URL \/ Path:\s*\S+/i.test(block) || !/Key evidence:\s*\S+/i.test(block)) warnings.push(`${id}: URL / Path or Key evidence is empty`);
}
for (const [index, slide] of (deck.slides || []).entries()) {
  const slideName = `slide ${String(index + 1).padStart(2, '0')}`;
  if (!slide.id || typeof slide.id !== 'string') errors.push(`${slideName}: missing string id`);
  else if (slideIds.has(slide.id)) errors.push(`${slideName}: duplicate slide id ${slide.id}`);
  else slideIds.add(slide.id);
  if (!supportedTypes.has(slide.type)) errors.push(`${slideName}: unsupported slide type ${slide.type}`);
  if (slide.evidence !== undefined && !Array.isArray(slide.evidence)) errors.push(`${slideName}: evidence must be an array`);
  if (slide.claims !== undefined && !Array.isArray(slide.claims)) errors.push(`${slideName}: claims must be an array`);
  const evidence = Array.isArray(slide.evidence) ? slide.evidence : [];
  const claims = Array.isArray(slide.claims) ? slide.claims : [];
  if (!['title', 'section'].includes(slide.type) && !evidence.length) warnings.push(`${slideName}: no evidence IDs`);
  for (const id of evidence) if (!sourceIds.has(id)) errors.push(`${slideName}: missing source ${id}`);
  for (const id of claims) { usedClaims.add(id); if (!claimIds.has(id)) errors.push(`${slideName}: missing claim ${id}`); }
  const dataPath = slide.data;
  if (dataPath) {
    const full = resolve(deckDir, dataPath);
    if (!full.startsWith(deckDir) || !existsSync(full)) errors.push(`${slideName}: missing data file ${dataPath}`);
    else {
      try { const data = JSON.parse(await readFile(full, 'utf8')); if (data.sourceId && !sourceIds.has(data.sourceId)) errors.push(`${slideName}: data source ${data.sourceId} is not defined`); if (!data.sourceId) warnings.push(`${slideName}: data file has no sourceId`); }
      catch (error) { errors.push(`${slideName}: invalid JSON data ${dataPath} (${error.message})`); }
    }
  }
  const assets = [];
  if (slide.src) assets.push({ key: 'src', path: slide.src });
  if (slide.image?.src) assets.push({ key: 'image.src', path: slide.image.src });
  for (const [imageIndex, image] of (slide.images || []).entries()) if (image.src) assets.push({ key: `images[${imageIndex}].src`, path: image.src });
  if (slide.codeSrc) assets.push({ key: 'codeSrc', path: slide.codeSrc });
  if (slide.svgSrc) assets.push({ key: 'svgSrc', path: slide.svgSrc });
  for (const asset of assets) {
    if (/^https?:\/\//i.test(asset.path)) errors.push(`${slideName}: ${asset.key} must be local for offline decks (${asset.path})`);
    else {
      const full = resolve(deckDir, asset.path);
      if (!full.startsWith(deckDir) || !existsSync(full)) errors.push(`${slideName}: missing ${asset.key} file ${asset.path}`);
    }
  }
  const factualFields = {...slide};
  delete factualFields.id; delete factualFields.type; delete factualFields.evidence; delete factualFields.claims; delete factualFields.data; delete factualFields.chart;
  const text = JSON.stringify(factualFields);
  if (numericPattern.test(text) && !evidence.length) errors.push(`${slideName}: numeric/factual content has no evidence IDs`);
}
for (const id of claimIds) if (!usedClaims.has(id)) warnings.push(`${id}: orphan claim is not referenced by deck.json`);
const status = errors.length ? 'FAIL' : warnings.length ? 'WARN' : 'PASS';
console.log(`GROUNDING ${status}`);
for (const error of errors) console.log(`FAIL: ${error}`);
for (const warning of warnings) console.log(`WARN: ${warning}`);
console.log(`sources=${sourceIds.size} claims=${claimIds.size} slides=${deck.slides.length}`);
if (errors.length) process.exitCode = 1;
