import { esc } from './helpers.js';

function decorateSvg(source = '') {
  if (!source.trim()) return '';
  return source.replace('<svg', '<svg class="animated-art" data-motion-art');
}

export function renderAnimatedSvg(slide) {
  const svg = decorateSvg(slide._svgText || slide.svg || '');
  return `<div class="animated-svg-layout"><div class="animated-svg-frame" data-layout data-motion="${esc(slide.motion || 'draw')}">${svg}</div><aside class="animated-svg-aside" data-layout><div class="eyebrow kicker">${esc(slide.sideKicker || 'Motion primitive')}</div><div class="code-takeaway">${esc(slide.takeaway || '')}</div><p class="body-copy">${esc(slide.note || '')}</p><div class="motion-note">${esc(slide.motionNote || 'Animation pauses in reduced-motion and print modes.')}</div></aside></div>`;
}
