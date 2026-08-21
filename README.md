# Agent-native Presentation / Deck System

A small, deterministic presentation runtime for Coding Agents. The source of truth is structured content, grounding, design tokens, JavaScript, CSS, and SVG—not a binary PPTX file.

## What exists in this MVP

- Fixed 1280×720 stage with deterministic transform scaling.
- Hash/history navigation: Arrow keys, Space, PageUp/PageDown, Home/End, `F`, and `#1` URLs.
- Declarative `deck.json` for common slide types plus a custom HTML/SVG escape hatch.
- Semantic theme tokens and a replaceable `themes/<name>/` theme.
- Common components: title, section, statement, comparison, metric, quote, image, chart, pipeline, timeline, and closing.
- Offline-safe lightweight equation fallback; no CDN is required by the example.
- External chart data loaded from `data/*.json`.
- Rule-based grounding checker with source/claim/evidence/data validation.
- Browser layout linter, PNG screenshot export, and Chrome/Chromium PDF export.
- Example deck: `examples/example-deck/`.

## Architecture

```text
CONTENT.md + GROUNDING.md + OUTLINE.md + STYLE.md + deck.json + data/
        ↓
engine/deck.js → components/ → semantic HTML/SVG → styles/ + themes/
        ↓
Chrome/Chromium browser → live presentation / screenshots / print PDF
```

`engine/` is reusable. Each deck is independent. `themes/` and `styles/` are shared. Content and evidence stay outside the rendering code.

## Run the example

```bash
npm run dev
```

Open the printed local URL, normally `http://127.0.0.1:4173/examples/example-deck/`. Add `?dev=1` for lightweight file-change reload polling. `npm run dev -- --port 4300` changes the port.

The repository has no mandatory runtime dependency. Screenshot and PDF scripts locate the installed Google Chrome/Chromium binary. If no browser is found, install Chromium/Chrome or use the optional Playwright path in a future build.

## Create a new deck

1. Copy `template/` to `examples/my-deck/` or another independent project directory.
2. Set the shared asset paths in `index.html` and choose a theme.
3. Write `OUTLINE.md` before coding slides.
4. Research into `GROUNDING.md`; record source IDs and raw evidence.
5. Draft concise slide copy in `CONTENT.md`.
6. Put declarative slides in `deck.json`; keep chart data in `data/`.
7. Use one primary message per slide and attach `evidence` IDs to factual slides.
8. Run the checks below before delivery.

## Add a slide

Common slide shape:

```json
{
  "id": "s-04",
  "type": "statement",
  "kicker": "Decision",
  "title": "Make the source of every number visible",
  "body": ["A reviewer should be able to move from slide → claim → source."],
  "evidence": ["source-001"],
  "claims": ["claim-001"]
}
```

Supported types are registered in `engine/deck.js`. Custom slides can use:

```json
{
  "id": "s-99",
  "type": "custom",
  "title": "A unique composition",
  "html": "<div class=\"custom-visual\">...</div>",
  "evidence": ["source-001"]
}
```

Custom HTML/SVG is trusted local source. Do not place unreviewed remote HTML into it.

## Add charts and diagrams

Charts read external data:

```json
{
  "type": "chart",
  "data": "data/latency.json",
  "chart": {"kind": "bar", "valueLabel": "Relative effort"},
  "evidence": ["source-002"]
}
```

Use `dataSource`/`sourceId` in data files when possible. The example renderer includes bar, line, and Pareto-style cumulative views. Pipelines and timelines use declarative nodes; exact technical diagrams may use custom SVG.

## Grounding workflow

`GROUNDING.md` maps `source-*` records to `claim-*` records and slides. The checker verifies:

- slide evidence IDs resolve to source records;
- slide IDs are present and unique, and slide types are supported;
- claim IDs resolve and are not orphaned;
- source URL/path and key evidence are present;
- referenced data files exist and their source IDs resolve;
- numeric text on non-title slides has evidence.

Run:

```bash
npm run grounding-check
```

## Visual QA and export

```bash
npm run layout-check
npm run screenshot
npm run visual-check
npm run export-pdf
```

Screenshots are written to the deck's `screenshots/` directory. PDF output is written to `dist/<deck-name>.pdf`. The layout linter catches stage-boundary overflow, unusually small marked elements, and excessive text; it cannot replace a human review of narrative clarity.

## Theme creation

Create `themes/my-theme/theme.json` and `theme.css`, then change the link in a deck's `index.html`. Slides consume semantic variables such as `--accent-primary`, not raw palette hex values.

The optional extractor is:

```bash
node scripts/extract-pptx-theme.mjs reference.pptx themes/reference
```

It reads common theme colors, fonts, slide size, and image names from PPTX ZIP/XML and emits visual tokens. It is not a 1:1 PowerPoint decompiler.

## Design contract

- 16:9 fixed stage; deterministic positions.
- Limited typography scale; no magic font sizes in slide source.
- Titles are conclusion-driven where possible.
- One slide, one primary message.
- Prefer deletion or splitting over tiny text.
- Vary composition: statement, diagram, chart, image, comparison, timeline, and negative space are all valid.
- Avoid repetitive card grids, decorative gradients, emoji overload, and dashboard-like density.
