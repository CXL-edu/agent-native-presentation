export function scaleStage(stage, width = 1280, height = 720) {
  const viewport = stage.parentElement;
  const scale = Math.min(viewport.clientWidth / width, viewport.clientHeight / height);
  stage.style.transform = `scale(${Math.max(scale, 0.1)})`;
  stage.dataset.scale = String(scale);
  return scale;
}
export function installScaling(stage) {
  const resize = () => scaleStage(stage);
  window.addEventListener('resize', resize, { passive: true });
  resize();
  return resize;
}
