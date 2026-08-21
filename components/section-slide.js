import { esc } from './helpers.js';
export function renderSectionSlide(slide) {
  return `<div class="section-index">${esc(slide.index || '01')} / ${esc(slide.label || 'SECTION')}</div><h1 class="section-title" data-layout>${esc(slide.title)}</h1><p class="slide-subtitle" data-layout>${esc(slide.subtitle || '')}</p>`;
}
