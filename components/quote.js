import { esc } from './helpers.js';
export function renderQuote(slide) { return `<div class="quote-block" data-layout><div class="quote-text">“${esc(slide.quote || '')}”</div><div class="quote-attribution">${esc(slide.attribution || '')}</div></div>`; }
