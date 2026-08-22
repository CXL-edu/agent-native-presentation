# Diagram Contract

Diagrams that connect boxes must use explicit node bounds and named ports. Do not hand-tune arrow endpoints against a screenshot.

## Port model

A port is a semantic attachment point on a node:

- `left-center`
- `right-center`
- `top-center`
- `bottom-center`
- `left-start`, `left-end`, `right-start`, `right-end`

For a node with `x`, `y`, `width`, and `height`, the renderer derives the port in the 1280×720 design coordinate system.

## Edge model

```text
source:out -> target:in
```

The renderer calculates:

```text
source port
→ arrow shaft end
→ arrowhead base
→ arrowhead tip
→ target port minus gap
```

The arrowhead tip must stop before the target node. `arrowGap`, `arrowHeadLength`, and `arrowHeadWidth` are explicit SVG layout values.

## Ported SVG shape

```svg
<svg data-port-layout="horizontal-pipeline"
     data-arrow-gap="10"
     data-arrow-head-length="14"
     data-arrow-head-width="16">
  <g data-node="source" data-box="20 98 144 104">...</g>
  <g data-node="target" data-box="212 98 144 104">...</g>
  <g data-edge="source:out->target:in">
    <path data-edge-shaft class="draw-path" />
    <path data-edge-head class="arrow-head" />
  </g>
</svg>
```

`engine/svg-layout.js` writes the shaft and head paths from the node boxes. The SVG remains local, readable, and diffable.

## Collision rules

- A shaft must not cross a node other than its source/target ports.
- An arrowhead tip must remain outside the target node by the configured gap.
- Do not solve a collision with z-index or paint order; fix the geometry or route the edge orthogonally.
- For complex architecture graphs, use explicit custom SVG paths rather than introducing a large automatic graph layout dependency.

## Animation rules

An animated edge still has two phases:

```text
shaft draw → solid arrowhead fade/pop
```

The arrowhead must not share the shaft's delay. The final static state must use the same computed geometry as the animated state.
