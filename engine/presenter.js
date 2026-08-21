export function presenterMode() {
  document.body.classList.toggle('presenter-mode');
  return document.body.classList.contains('presenter-mode');
}
