function parseBox(value) {
  const numbers = String(value || '').trim().split(/[ ,]+/).map(Number);
  if (numbers.length !== 4 || numbers.some((number) => !Number.isFinite(number))) return null;
  const [x, y, width, height] = numbers;
  return { x, y, width, height };
}

function portPoint(box, port = 'right-center') {
  if (port === 'out') port = 'right-center';
  if (port === 'in') port = 'left-center';
  const [side, align = 'center'] = port.split('-');
  const offset = align === 'start' ? 0 : align === 'end' ? 1 : .5;
  if (side === 'left') return { x: box.x, y: box.y + box.height * offset };
  if (side === 'right') return { x: box.x + box.width, y: box.y + box.height * offset };
  if (side === 'top') return { x: box.x + box.width * offset, y: box.y };
  if (side === 'bottom') return { x: box.x + box.width * offset, y: box.y + box.height };
  return { x: box.x + box.width, y: box.y + box.height / 2 };
}

function parseEdge(value) {
  const [fromRaw, toRaw] = String(value || '').split('->').map((item) => item.trim());
  const [from, fromPort = 'right-center'] = (fromRaw || '').split(':');
  const [to, toPort = 'left-center'] = (toRaw || '').split(':');
  return { from, fromPort, to, toPort };
}

function formatPoint(point) { return `${point.x.toFixed(2)} ${point.y.toFixed(2)}`; }
function distance(a, b) { return Math.hypot(b.x - a.x, b.y - a.y); }

export function layoutSvgPorts(svg) {
  const boxes = new Map();
  const failures = [];
  svg.querySelectorAll('[data-node][data-box]').forEach((node) => {
    const box = parseBox(node.dataset.box);
    if (!box) failures.push(`invalid box for ${node.dataset.node}`);
    else boxes.set(node.dataset.node, box);
  });
  const gap = Number(svg.dataset.arrowGap || 10);
  const headLength = Number(svg.dataset.arrowHeadLength || 14);
  const headWidth = Number(svg.dataset.arrowHeadWidth || 16);
  const edgeReports = [];

  svg.querySelectorAll('[data-edge]').forEach((edge) => {
    const { from, fromPort, to, toPort } = parseEdge(edge.dataset.edge);
    const sourceBox = boxes.get(from);
    const targetBox = boxes.get(to);
    if (!sourceBox || !targetBox) { failures.push(`missing node for edge ${edge.dataset.edge}`); return; }
    const source = portPoint(sourceBox, fromPort);
    const target = portPoint(targetBox, toPort);
    const length = distance(source, target) || 1;
    const unit = { x: (target.x - source.x) / length, y: (target.y - source.y) / length };
    const tip = { x: target.x - unit.x * gap, y: target.y - unit.y * gap };
    const base = { x: tip.x - unit.x * headLength, y: tip.y - unit.y * headLength };
    const perpendicular = { x: -unit.y, y: unit.x };
    const halfWidth = headWidth / 2;
    const headA = { x: base.x + perpendicular.x * halfWidth, y: base.y + perpendicular.y * halfWidth };
    const headB = { x: base.x - perpendicular.x * halfWidth, y: base.y - perpendicular.y * halfWidth };
    const shaft = edge.querySelector('[data-edge-shaft]');
    const head = edge.querySelector('[data-edge-head]');
    if (shaft) shaft.setAttribute('d', `M ${formatPoint(source)} L ${formatPoint(base)}`);
    if (head) head.setAttribute('d', `M ${formatPoint(tip)} L ${formatPoint(headA)} L ${formatPoint(headB)} Z`);
    const clearance = distance(tip, target);
    if (clearance < gap - .5) failures.push(`edge ${edge.dataset.edge} head clearance is too small`);
    edgeReports.push({ edge: edge.dataset.edge, source, target, tip, base, clearance });
  });

  const report = { status: failures.length ? 'FAIL' : 'PASS', failures, edges: edgeReports };
  svg.dataset.portLayoutStatus = report.status;
  svg.__portLayoutReport = report;
  return report;
}

export function layoutPortedSvgs(root) {
  const reports = [...root.querySelectorAll('svg[data-port-layout]')].map(layoutSvgPorts);
  window.__svgPortLayoutReport = reports;
  return reports;
}
