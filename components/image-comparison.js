import { esc } from './helpers.js';

const FITS = new Set(['contain', 'cover', 'fill', 'scale-down', 'none']);
const POSITIONS = new Set(['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']);
function fitClass(value) { return FITS.has(value) ? `image-fit-${value}` : 'image-fit-contain'; }
function positionClass(value) { return POSITIONS.has(value) ? `image-position-${value}` : 'image-position-center'; }
function imageTag(image) { return `<img class="deck-image ${fitClass(image.fit)} ${positionClass(image.position)}" src="${esc(image.src)}" alt="${esc(image.alt || '')}" loading="eager">`; }
function sourceLabel(image) { return image.source ? `<span class="image-source">${esc(image.source)}</span>` : ''; }

export function renderImageComparison(slide) {
  return `<div class="image-comparison-grid">${(slide.images || []).map((image, index) => `<figure class="image-tile" data-layout><div class="image-tile-head"><span class="panel-label">${esc(image.label || `Image ${index + 1}`)}</span>${sourceLabel(image)}</div><div class="image-viewport">${imageTag(image)}</div><figcaption class="image-caption">${esc(image.caption || '')}</figcaption></figure>`).join('')}</div>`;
}
