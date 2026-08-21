import { esc, paragraphs } from './helpers.js';
export function renderStatementSlide(slide) {
  return `<div class="statement-text" data-layout>${esc(slide.statement || slide.title)}</div><aside class="statement-aside" data-layout>${paragraphs(slide.body || [])}</aside>`;
}
