# Instructions for Coding Agents

This repository is a reusable, code-first presentation system. Read these files before modifying a deck:

1. `README.md`
2. the deck's `STYLE.md`
3. the deck's `OUTLINE.md`
4. the deck's `GROUNDING.md` before touching facts, numbers, citations, or data

## Non-negotiable rules

- HTML/CSS/JS/SVG plus structured files are the source of truth. Do not edit generated screenshots or PDFs as source.
- Never invent numbers, dates, benchmarks, product claims, or quotations. Every factual slide needs evidence IDs that resolve in `GROUNDING.md`.
- Do not add one-off colors, font sizes, radii, shadows, or spacing values when a semantic token exists.
- Change source data in `data/`, not SVG path coordinates or rendered DOM text.
- Keep slide source easy to diff. Prefer declarative `deck.json` for common slides and custom HTML/SVG only where composition requires it.
- Do not solve overflow by shrinking typography. Delete, simplify, or split the slide.
- After a substantial change run `npm run grounding-check`, `npm run layout-check`, `npm run screenshot`, and `npm run visual-check`.
- Run `npm run export-pdf` before delivery and verify the PDF page count.
- Preserve the 1280×720 design coordinate system and the one-primary-message rule.

## Extension rule

If a new slide type is needed more than once, add a small component under `components/` and document its data shape in README. If it is unique, use the `custom` type with explicit HTML/SVG and keep the source local to that deck.
