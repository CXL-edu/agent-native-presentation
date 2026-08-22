import { esc, paragraphs } from './helpers.js';

const FITS = new Set(['contain', 'cover', 'fill', 'scale-down', 'none']);
const POSITIONS = new Set(['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']);
function fitClass(value) { return FITS.has(value) ? `image-fit-${value}` : 'image-fit-contain'; }
function positionClass(value) { return POSITIONS.has(value) ? `image-position-${value}` : 'image-position-center'; }
function imageTag(image, extraClass = '') {
  return `<img class="deck-image ${extraClass} ${fitClass(image.fit)} ${positionClass(image.position)}" src="${esc(image.src)}" alt="${esc(image.alt || '')}" loading="eager">`;
}
function sourceLabel(image) { return image.source ? `<span class="image-source">${esc(image.source)}</span>` : ''; }

export function renderImage(slide) {
  const image = { ...slide, src: slide.src || slide.image?.src, fit: slide.fit || slide.image?.fit, position: slide.position || slide.image?.position, alt: slide.alt || slide.image?.alt };
  return `<div class="image-layout"><figure class="image-frame ${fitClass(image.fit)}" data-layout><div class="image-viewport">${imageTag(image)}</div><figcaption class="image-caption"><span>${esc(slide.caption || '')}</span>${sourceLabel(image)}</figcaption></figure><div class="stack" data-layout><div class="eyebrow kicker">${esc(slide.sideKicker || 'Visual primitive')}</div><h2 class="panel-title">${esc(slide.sideTitle || '')}</h2>${paragraphs(slide.body || [])}</div></div>`;
}
