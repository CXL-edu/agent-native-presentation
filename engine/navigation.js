export function createNavigation({ count, onChange, viewport, stage }) {
  let current = 0;
  let pointerStart = null;
  let suppressNextClick = false;
  const clickSurface = viewport || stage;

  function clamp(index) { return Math.max(0, Math.min(count - 1, index)); }
  function readHash() { const n = Number.parseInt(location.hash.slice(1), 10); return Number.isFinite(n) ? clamp(n - 1) : 0; }
  function go(index, push = true) {
    const next = clamp(index);
    if (push) history.pushState({ slide: next + 1 }, '', `#${next + 1}`);
    current = next;
    onChange(current);
  }
  function isInteractiveTarget(target) {
    return target instanceof Element && target.closest('a,button,input,textarea,select,option,[data-no-nav],[contenteditable="true"]');
  }
  function hasTextSelection() {
    const selection = window.getSelection?.();
    return Boolean(selection && !selection.isCollapsed && selection.toString());
  }
  function handlePointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (isInteractiveTarget(event.target)) return;
    pointerStart = { x: event.clientX, y: event.clientY };
  }
  function handlePointerUp(event) {
    if (!pointerStart) return;
    const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    if (distance > 6 || hasTextSelection()) {
      suppressNextClick = true;
      window.setTimeout(() => { suppressNextClick = false; }, 500);
    }
    pointerStart = null;
  }
  function handlePointerCancel() {
    pointerStart = null;
    suppressNextClick = false;
  }
  function handleSurfaceClick(event) {
    if (suppressNextClick) { suppressNextClick = false; return; }
    if (isInteractiveTarget(event.target) || hasTextSelection()) return;
    const rect = clickSurface.getBoundingClientRect();
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
  clickSurface?.addEventListener('pointerdown', handlePointerDown);
  clickSurface?.addEventListener('pointerup', handlePointerUp);
  clickSurface?.addEventListener('pointercancel', handlePointerCancel);
  clickSurface?.addEventListener('click', handleSurfaceClick);
  return { start() { go(readHash(), false); }, go, get current() { return current; } };
}
