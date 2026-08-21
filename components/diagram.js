import { esc } from './helpers.js';
export function renderDiagram(slide) { return `<div class="diagram-shell" data-layout>${slide.html || `<div class="caption">${esc(slide.description || 'Custom diagram')}</div>`}</div>`; }
