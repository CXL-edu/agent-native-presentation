import { esc } from './helpers.js';
export function renderMetricCards(slide) { return `<div class="metric-band">${(slide.metrics || []).map((m) => `<article class="metric-card" data-layout><div class="metric-label">${esc(m.label)}</div><div class="metric-value">${esc(m.value)}</div><div class="caption">${esc(m.note || '')}</div></article>`).join('')}</div>`; }
