export function installPrintMode() {
  if (new URLSearchParams(location.search).get('print') === 'all') document.body.classList.add('print-all');
}
