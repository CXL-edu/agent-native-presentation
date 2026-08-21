export function createNavigation({ count, onChange, stage }) {
  let current = 0;
  function clamp(index) { return Math.max(0, Math.min(count - 1, index)); }
  function readHash() { const n = Number.parseInt(location.hash.slice(1), 10); return Number.isFinite(n) ? clamp(n - 1) : 0; }
  function go(index, push = true) {
    const next = clamp(index);
    if (push) history.pushState({ slide: next + 1 }, '', `#${next + 1}`);
    current = next;
    onChange(current);
  }
  function isInteractiveTarget(target) {
    return target.closest('a,button,input,textarea,select,option,[data-no-nav],[contenteditable="true"]');
  }
  function handleStageClick(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (isInteractiveTarget(event.target)) return;
    const rect = stage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    go(current + (x < rect.width / 2 ? -1 : 1));
  }
  function handleKey(event) {
    if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); go(current + 1); }
    else if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); go(current - 1); }
    else if (event.key === 'Home') { event.preventDefault(); go(0); }
    else if (event.key === 'End') { event.preventDefault(); go(count - 1); }
    else if (event.key.toLowerCase() === 'f') { document.documentElement.requestFullscreen?.(); }
    else if (event.key === 'Escape' && document.fullscreenElement) document.exitFullscreen?.();
  }
  window.addEventListener('keydown', handleKey);
  window.addEventListener('hashchange', () => go(readHash(), false));
  window.addEventListener('popstate', () => go(readHash(), false));
  stage?.addEventListener('click', handleStageClick);
  return { start() { go(readHash(), false); }, go, get current() { return current; } };
}
