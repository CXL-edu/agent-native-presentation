import { esc } from './helpers.js';
export function renderTitleSlide(slide) {
  return `<div class="cover-meta"><div class="cover-mark"><span class="cover-mark-dot"></span>${esc(slide.brand || 'Agent-native Deck System')}</div><span class="eyebrow">${esc(slide.eyebrow || 'CODE-FIRST / GROUNDED / REUSABLE')}</span></div>
    <div class="cover-copy"><div class="eyebrow kicker">${esc(slide.kicker || 'A programmable visual document')}</div><h1 class="cover-title" data-layout>${esc(slide.title)}</h1><p class="slide-subtitle" data-layout>${esc(slide.subtitle || '')}</p></div>
    <div class="cover-meta"><span class="caption">${esc(slide.meta || 'MVP reference implementation')}</span><span class="source-note">${esc(slide.footer || 'HTML · SVG · DATA · QA')}</span></div>`;
}
