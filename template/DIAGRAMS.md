# Diagram Contract

Use explicit node bounds and named ports for connected boxes. The renderer computes the shaft, arrowhead, target gap, and collision status in the 1280×720 design coordinate system.

- Node metadata: `data-node` + `data-box="x y width height"`
- Edge metadata: `data-edge="source:out->target:in"`
- Edge geometry: `data-edge-shaft` + `data-edge-head`
- Arrow sequence: shaft draw, then solid head
- Never hide a collision with z-index; fix the port geometry or route the edge.
