# Motion Contract

Motion is an explanatory layer, not decoration. Use it to reveal sequence, causality, or attention—not to make a static slide look busy.

## Runtime contract

- Animation source must be local SVG/HTML/CSS. Do not depend on a CDN or remote image.
- Put animation behavior in `components/animated-svg.js` and `styles/motion.css`; keep `deck.json` declarative.
- An animated slide must have a complete static final state. Print and reduced-motion modes must show that state.
- Motion starts when the slide becomes active, not when the whole deck first loads.
- Keep one dominant motion idea per slide.
- Use `pathLength="1"` on SVG paths that use the draw animation.
- Prefer short, purposeful motion. The default draw duration is under two seconds; do not loop indefinitely unless the loop itself communicates a system feedback cycle.
- Do not use motion to hide missing content, compensate for weak hierarchy, or force attention away from the slide claim.

## Authoring shape

```json
{
  "id": "s-09",
  "type": "animated-svg",
  "svgSrc": "assets/agent-loop-animated.svg",
  "motion": "draw",
  "takeaway": "The loop makes iteration visible.",
  "note": "The final state remains readable in PDF and reduced-motion mode.",
  "evidence": ["source-001"]
}
```

SVG elements may use:

- `class="draw-path" pathLength="1"` for stroke drawing;
- `class="fade-in"` for staged appearance;
- `class="pulse-node"` for a short emphasis pulse.

## QA

- Run layout and screenshot checks with motion disabled or after the final state has rendered.
- Inspect the first frame, the final frame, and print/PDF output.
- Verify `prefers-reduced-motion: reduce` produces a complete static diagram.
- Verify the animation does not change element bounds or cause connector overlap.
