export function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

export function paragraphs(items = []) {
  const values = Array.isArray(items) ? items : [items];
  return values.filter(Boolean).map((item) => `<p class="body-copy" data-layout>${esc(item)}</p>`).join('');
}

export function bullets(items = []) {
  return `<ul class="bullet-list" data-layout>${(items || []).map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
}

export function evidencePills(slide) {
  const ids = slide.evidence || [];
  if (!ids.length) return '';
  return `<div class="evidence-line" aria-label="Evidence references">${ids.map((id) => `<span class="evidence-pill">${esc(id)}</span>`).join('')}</div>`;
}

export function formulaFallback(source = '') {
  let html = esc(source);
  html = html.replace(/\\text\{([^}]*)\}/g, '$1');
  html = html.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '<span class="frac"><span>$1</span><span>$2</span></span>');
  html = html.replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>').replace(/_\{([^}]*)\}/g, '<sub>$1</sub>');
  html = html.replace(/\^([A-Za-z0-9])/g, '<sup>$1</sup>').replace(/_([A-Za-z0-9])/g, '<sub>$1</sub>');
  html = html.replace(/\\(alpha|beta|gamma|delta|times|rightarrow|leq|geq|infty)/g, (_, name) => ({alpha:'α',beta:'β',gamma:'γ',delta:'δ',times:'×',rightarrow:'→',leq:'≤',geq:'≥',infty:'∞'}[name]));
  return html;
}
