# Asset Contract

Images are evidence-bearing presentation assets, not anonymous decoration.

## Storage

- Keep images inside the deck's local `assets/` directory.
- Prefer local PNG, JPG, WebP, or SVG. Do not leave runtime HTTP image URLs in an offline deck.
- Use stable, descriptive filenames such as `retrieval-pipeline-before.png`, not `IMG_4821.png`.
- Keep source URLs, file paths, licensing notes, and retrieval dates in `GROUNDING.md` or the deck's asset ledger.

## Slide schema

Single image:

```json
{
  "type": "image",
  "src": "assets/product-screen.png",
  "fit": "contain",
  "position": "center",
  "alt": "Short description of the image",
  "caption": "What the audience should notice",
  "source": "assets/product-screen.png",
  "evidence": ["source-002"]
}
```

Supported `fit` values are `contain`, `cover`, `fill`, `scale-down`, and `none`. Supported positions are `center`, `top`, `bottom`, `left`, `right`, and the four corners.

Two-image comparison:

```json
{
  "type": "image-comparison",
  "images": [
    {"src":"assets/before.png","label":"Before","fit":"contain","alt":"...","caption":"..."},
    {"src":"assets/after.png","label":"After","fit":"contain","alt":"...","caption":"..."}
  ],
  "evidence": ["source-002"]
}
```

## Visual rules

- Choose `contain` when the whole UI, diagram, document, or product screen must remain visible.
- Choose `cover` only when edge-to-edge visual impact matters more than preserving the full frame; state the intended crop in `STYLE.md`.
- Never stretch a logo, screenshot, or diagram to fill a box.
- Every image needs meaningful alt text. Decorative marks should use an empty alt string.
- Use captions to say what to notice, not to repeat the filename.
- Do not use a low-resolution screenshot to carry small text; replace it with a local high-resolution asset or redraw the structure as SVG.
- Keep a consistent corner/radius/shadow treatment within a Deck.
- A slide should not contain images merely to fill negative space.

## QA

The grounding checker verifies that local `src`, `image.src`, and `images[*].src` files exist and rejects HTTP image URLs for offline decks. Layout QA still needs a visual review for crop, legibility, contrast, and semantic usefulness.
