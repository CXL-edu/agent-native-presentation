import { esc } from './helpers.js';
export function renderPipeline(slide) { return `<div class="pipeline">${(slide.steps || []).map((step, i) => `<article class="pipeline-step" data-layout><div class="pipeline-index">0${i + 1}</div><div class="pipeline-title">${esc(step.title)}</div><div class="pipeline-copy">${esc(step.copy)}</div></article>`).join('')}</div>`; }
