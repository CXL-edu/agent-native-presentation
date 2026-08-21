import { esc } from './helpers.js';

function highlightedLines(value) {
  const output = new Set();
  for (const item of value || []) {
    if (typeof item === 'number') output.add(item);
    else if (typeof item === 'string' && item.includes('-')) {
      const [start, end] = item.split('-').map(Number);
      for (let line = start; line <= end; line += 1) output.add(line);
    } else if (Number.isFinite(Number(item))) output.add(Number(item));
  }
  return output;
}

export function renderCodeBlock(slide) {
  const source = slide._codeText ?? slide.code ?? '';
  const lines = String(source).replace(/\r\n/g, '\n').replace(/\n$/, '').split('\n');
  const highlights = highlightedLines(slide.highlight);
  const rows = lines.map((line, index) => `<span class="code-line ${highlights.has(index + 1) ? 'is-highlighted' : ''}" data-line="${index + 1}"><span class="code-number">${String(index + 1).padStart(2, '0')}</span><code>${esc(line) || ' '}</code></span>`).join('');
  return `<div class="code-layout"><div class="code-frame" data-layout><div class="code-toolbar"><span class="code-file">${esc(slide.filename || slide.codeSrc || 'source')}</span><span class="code-language">${esc(slide.language || 'text')}</span><button class="code-copy" type="button" data-copy-code aria-label="Copy code">Copy</button></div><pre class="code-body" tabindex="0"><code>${rows}</code></pre></div><aside class="code-aside" data-layout><div class="eyebrow kicker">${esc(slide.sideKicker || 'Source primitive')}</div><div class="code-takeaway">${esc(slide.takeaway || '')}</div><p class="caption">${esc(slide.note || '')}</p></aside></div>`;
}

export function installCodeCopy(root) {
  root.querySelectorAll('[data-copy-code]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      const frame = button.closest('.code-frame');
      const text = [...frame.querySelectorAll('.code-line code')].map((line) => line.textContent).join('\n');
      try {
        await navigator.clipboard?.writeText(text);
        button.textContent = 'Copied';
        window.setTimeout(() => { button.textContent = 'Copy'; }, 1200);
      } catch (_) {
        button.textContent = 'Select';
        window.setTimeout(() => { button.textContent = 'Copy'; }, 1200);
      }
    });
  });
}
