import { renderTitleSlide } from '../components/title-slide.js';
import { renderSectionSlide } from '../components/section-slide.js';
import { renderStatementSlide } from '../components/statement-slide.js';
import { renderComparison } from '../components/comparison.js';
import { renderMetricCards } from '../components/metric-card.js';
import { renderQuote } from '../components/quote.js';
import { renderImage } from '../components/image.js';
import { renderTimeline } from '../components/timeline.js';
import { renderPipeline } from '../components/pipeline.js';
import { renderChart } from '../components/chart.js';
import { renderDiagram } from '../components/diagram.js';
import { renderCodeBlock, installCodeCopy } from '../components/code-block.js';
import { renderAnimatedSvg } from '../components/animated-svg.js';
import { esc, evidencePills, paragraphs, formulaFallback } from '../components/helpers.js';
import { createNavigation } from './navigation.js';
import { installScaling } from './scaling.js';
import { setActiveSlide } from './transitions.js';
import { installPrintMode } from './print.js';

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}: HTTP ${response.status}`);
  return response.json();
}

async function loadText(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}: HTTP ${response.status}`);
  return response.text();
}

async function hydrateSlide(slide) {
  const hydrated = { ...slide };
  if (slide.data) hydrated._data = await loadJSON(slide.data);
  if (slide.codeSrc) hydrated._codeText = await loadText(slide.codeSrc);
  if (slide.svgSrc) hydrated._svgText = await loadText(slide.svgSrc);
  return hydrated;
}

function frameBody(slide) {
  switch (slide.type) {
    case 'title': return renderTitleSlide(slide);
    case 'section': return renderSectionSlide(slide);
    case 'statement': return renderStatementSlide(slide);
    case 'comparison': return renderComparison(slide);
    case 'metric': return renderMetricCards(slide);
    case 'quote': return renderQuote(slide);
    case 'image': return renderImage(slide);
    case 'chart': return renderChart(slide);
    case 'pipeline': return renderPipeline(slide);
    case 'timeline': return renderTimeline(slide);
    case 'equation': return `<div class="center"><div class="stack" style="align-items:center" data-layout><div class="equation">${formulaFallback(slide.formula || '')}</div><p class="body-copy" style="max-width:700px;text-align:center">${esc(slide.explanation || '')}</p></div></div>`;
    case 'diagram': return renderDiagram(slide);
    case 'code': return renderCodeBlock(slide);
    case 'animated-svg': return renderAnimatedSvg(slide);
    case 'closing': return `<div class="closing-rule"></div><h1 class="slide-title" data-layout>${esc(slide.title)}</h1><p class="slide-subtitle" data-layout>${esc(slide.subtitle || '')}</p><div class="closing-rule"></div>`;
    case 'custom': return slide.html || '';
    default: return `<div class="center"><p class="body-copy">Unknown slide type: ${esc(slide.type)}</p></div>`;
  }
}

async function renderSlide(slide, index, total) {
  const typeClass = `slide--${String(slide.type || 'custom').replace(/[^a-z0-9_-]/gi, '')}`;
  const special = ['title', 'section', 'closing'].includes(slide.type);
  const header = special ? '' : `<header class="slide-header"><div class="eyebrow kicker">${esc(slide.kicker || '')}</div><h1 class="slide-title" data-layout>${esc(slide.title || '')}</h1>${slide.subtitle ? `<div class="slide-subtitle" data-layout>${esc(slide.subtitle)}</div>` : ''}</header>`;
  const bodyClass = special ? '' : 'slide-content';
  const footer = `<footer class="slide-footer"><div class="evidence-line">${evidencePills(slide)}</div><span class="slide-number">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></footer>`;
  return `<article class="slide ${typeClass} ${special ? `${slide.type}-slide` : ''}" data-slide-id="${esc(slide.id || `slide-${index + 1}`)}" data-slide-index="${index + 1}" aria-hidden="true">${header}<main class="${bodyClass}">${await frameBody(slide)}</main>${footer}</article>`;
}

function runLayoutCheck() {
  const stage = document.querySelector('.stage');
  const slides = [...document.querySelectorAll('.slide')];
  const report = { status: 'PASS', slides: [], warnings: [], failures: [] };
  const stageRect = stage.getBoundingClientRect();
  slides.forEach((slide, index) => {
    const oldDisplay = slide.style.display;
    const oldVisibility = slide.style.visibility;
    slide.style.display = 'flex';
    slide.style.visibility = 'hidden';
    const codeCharacters = [...slide.querySelectorAll('.code-body')].reduce((total, element) => total + element.textContent.length, 0);
    const textLength = Math.max(0, slide.textContent.trim().length - codeCharacters);
    const slideReport = { slide: index + 1, overflow: [], smallText: [], textLength };
    if (slide.scrollHeight > slide.clientHeight + 2 || slide.scrollWidth > slide.clientWidth + 2) slideReport.overflow.push('slide scroll box exceeds its fixed stage');
    const layoutElements = [...slide.querySelectorAll('[data-layout]')];
    layoutElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const pad = 3;
      if (rect.left < stageRect.left - pad || rect.right > stageRect.right + pad || rect.top < stageRect.top - pad || rect.bottom > stageRect.bottom + pad) slideReport.overflow.push(element.className || element.tagName);
      const size = Number.parseFloat(getComputedStyle(element).fontSize);
      if (size && size < 16) slideReport.smallText.push(`${element.className || element.tagName}:${size}px`);
    });
    for (let i = 0; i < layoutElements.length; i += 1) {
      for (let j = i + 1; j < layoutElements.length; j += 1) {
        const first = layoutElements[i], second = layoutElements[j];
        if (first.contains(second) || second.contains(first)) continue;
        const a = first.getBoundingClientRect(), b = second.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        if (overlap > 16) slideReport.overlap = [...(slideReport.overlap || []), `${first.className || first.tagName} ↔ ${second.className || second.tagName}`];
      }
    }
    if (slideReport.overlap?.length) report.warnings.push(`slide ${String(index + 1).padStart(2, '0')}: marked elements overlap (${slideReport.overlap.join(', ')})`);
    if (slideReport.overflow.length) report.failures.push(`slide ${String(index + 1).padStart(2, '0')}: ${slideReport.overflow.join(', ')}`);
    if (slideReport.smallText.length) report.warnings.push(`slide ${String(index + 1).padStart(2, '0')}: marked text below 16px (${slideReport.smallText.join(', ')})`);
    if (slideReport.textLength > 950) report.warnings.push(`slide ${String(index + 1).padStart(2, '0')}: ${slideReport.textLength} text characters; consider splitting`);
    report.slides.push(slideReport);
    slide.style.display = oldDisplay;
    slide.style.visibility = oldVisibility;
  });
  if (report.failures.length) report.status = 'FAIL';
  else if (report.warnings.length) report.status = 'WARN';
  return report;
}

async function boot() {
  installPrintMode();
  const root = document.querySelector('#slide-root');
  const loading = document.querySelector('#loading');
  const deck = await loadJSON('./deck.json');
  document.title = deck.title || 'HTML Deck';
  const slides = await Promise.all((deck.slides || []).map(hydrateSlide));
  root.innerHTML = (await Promise.all(slides.map((slide, index) => renderSlide(slide, index, slides.length)))).join('');
  installCodeCopy(root);
  const slideNodes = [...root.querySelectorAll('.slide')];
  const stage = document.querySelector('.stage');
  const viewport = document.querySelector('.deck-viewport');
  installScaling(stage, deck.canvas?.width || 1280, deck.canvas?.height || 720);
  const navigation = createNavigation({ count: slideNodes.length, onChange: (index) => setActiveSlide(slideNodes, index), viewport, stage });
  navigation.start();
  const totalNode = document.querySelector('[data-total-slides]');
  if (totalNode) totalNode.textContent = String(slideNodes.length).padStart(2, '0');
  loading?.remove();
  window.__deck = deck;
  window.__deckReady = true;
  window.__runLayoutCheck = runLayoutCheck;
  if (new URLSearchParams(location.search).has('layout')) {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const report = runLayoutCheck();
    window.__layoutReport = report;
    document.title = `LAYOUT_REPORT:${encodeURIComponent(JSON.stringify(report))}`;
    const reportNode = document.querySelector('#layout-report');
    if (reportNode) reportNode.textContent = JSON.stringify(report);
  }
  if (new URLSearchParams(location.search).get('dev') === '1') {
    let previous = null;
    setInterval(async () => {
      try { const response = await fetch('/__deck_hash', { cache: 'no-store' }); const next = await response.text(); if (previous && previous !== next) location.reload(); previous = next; } catch (_) {}
    }, 1000);
  }
}

boot().catch((error) => {
  document.querySelector('#loading').textContent = `Deck failed to load: ${error.message}`;
  document.querySelector('#loading').classList.add('error');
  console.error(error);
});
