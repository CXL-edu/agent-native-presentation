import { esc, bullets } from './helpers.js';
function panel(item, right = false) { return `<section class="comparison-panel ${right ? 'is-right' : ''}" data-layout><div class="panel-label">${esc(item.label || '')}</div><div class="panel-title">${esc(item.title || '')}</div>${bullets(item.items || [])}</section>`; }
export function renderComparison(slide) { return `<div class="comparison-grid">${panel(slide.left)}${panel(slide.right, true)}</div>`; }
