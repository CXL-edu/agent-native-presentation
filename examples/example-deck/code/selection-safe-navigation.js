export function bindViewportNavigation(viewport, go) {
  let startX = 0;
  let drag = false;
  viewport.onpointerdown = (event) => { startX = event.clientX; drag = false; };
  viewport.onpointerup = (event) => {
    drag = Math.abs(event.clientX - startX) > 6 || Boolean(getSelection()?.toString());
  };
  viewport.onclick = (event) => {
    if (drag || event.target.closest('a,button,[data-no-nav]')) return;
    go(event.clientX < innerWidth / 2 ? -1 : 1);
  };
}
