import { esc } from './helpers.js';

function chartData(slide) { return slide._data?.values || slide.values || []; }
function renderBar(values, label) {
  const width = 720, height = 330, left = 56, right = 18, top = 18, bottom = 58;
  const plotW = width - left - right, plotH = height - top - bottom;
  const max = Math.max(...values.map((d) => Number(d.value) || 0), 1);
  const band = plotW / Math.max(values.length, 1);
  const barW = band * .54;
  const bars = values.map((d, i) => {
    const v = Number(d.value) || 0, h = (v / max) * plotH, x = left + i * band + (band - barW) / 2, y = top + plotH - h;
    return `<rect class="chart-bar" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="5" data-layout/><text class="chart-value" x="${(x + barW / 2).toFixed(1)}" y="${Math.max(y - 8, 12).toFixed(1)}" text-anchor="middle">${esc(d.value)}</text><text class="chart-label" x="${(x + barW / 2).toFixed(1)}" y="${height - 24}" text-anchor="middle">${esc(d.label)}</text>`;
  }).join('');
  const grid = [0, .25, .5, .75, 1].map((f) => { const y = top + plotH - f * plotH; return `<line class="chart-grid" x1="${left}" x2="${width - right}" y1="${y}" y2="${y}"/><text class="chart-label" x="${left - 10}" y="${y + 4}" text-anchor="end">${Math.round(max * f)}</text>`; }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}">${grid}<line class="chart-axis" x1="${left}" x2="${left}" y1="${top}" y2="${top + plotH}"/><line class="chart-axis" x1="${left}" x2="${width - right}" y1="${top + plotH}" y2="${top + plotH}"/>${bars}</svg>`;
}
function renderLine(values, label) {
  const width = 720, height = 330, left = 56, right = 18, top = 22, bottom = 58, plotW = width-left-right, plotH = height-top-bottom;
  const max = Math.max(...values.map((d) => Number(d.value) || 0), 1), min = Math.min(...values.map((d) => Number(d.value) || 0), 0), range = Math.max(max-min, 1);
  const points = values.map((d,i) => `${left + (values.length === 1 ? plotW/2 : i*plotW/(values.length-1))},${top+plotH-((Number(d.value)-min)/range)*plotH}`);
  const circles = values.map((d,i) => { const [x,y] = points[i].split(','); return `<circle class="chart-point" cx="${x}" cy="${y}" r="6"/><text class="chart-value" x="${x}" y="${Number(y)-13}" text-anchor="middle">${esc(d.value)}</text><text class="chart-label" x="${x}" y="${height-24}" text-anchor="middle">${esc(d.label)}</text>`; }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}"><line class="chart-axis" x1="${left}" x2="${left}" y1="${top}" y2="${top+plotH}"/><line class="chart-axis" x1="${left}" x2="${width-right}" y1="${top+plotH}" y2="${top+plotH}"/><polyline class="chart-line" points="${points.join(' ')}"/>${circles}</svg>`;
}
export function renderChart(slide) {
  const values = chartData(slide);
  const kind = slide.chart?.kind || slide.kind || 'bar';
  const chart = kind === 'line' ? renderLine(values, slide.title) : renderBar(values, slide.title);
  return `<div class="chart-layout"><div class="chart-frame" data-layout>${chart}</div><div class="chart-summary" data-layout><div class="eyebrow kicker">${esc(slide.chart?.label || 'Source data')}</div><div class="chart-takeaway">${esc(slide.takeaway || '')}</div><div class="caption">${esc(slide._data?.note || slide.note || '')}</div></div></div>`;
}
