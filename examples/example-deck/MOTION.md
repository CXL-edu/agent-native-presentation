# Motion Contract

- Slide 09 uses one local SVG draw sequence to show the research → grounding → render → inspect loop.
- Slide 10 uses a separate one-shot pipeline: source → grounding → story → render → QA.
- Slide 10 alternates node and edge timing: node → arrow → node → arrow, never all boxes or all arrows in parallel.
- Arrow edges use a shaft first, then a solid filled triangular head; the head never draws from the same start time as the shaft.
- Slide 10 plays on first entry in the current page session, then keeps its final state when revisited.
- The motion explains sequence; it does not carry a fact that disappears when animation is disabled.
- The final SVG state is complete and readable in screenshots, reduced-motion mode, and PDF.
- No slide uses an infinite decorative loop.
