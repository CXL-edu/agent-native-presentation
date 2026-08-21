# Agent-native Presentation / Deck System — MVP Plan

## Goal

Create a reusable, code-first HTML slide system whose source of truth is structured content + grounding + design tokens + rendering code. The MVP must run offline, be agent-maintainable, export to PDF, render screenshots, and include an 8–10 slide example deck.

## Evidence from reference

The supplied reference is a custom web deck, not a native PPTX source: its HTML contains 39 `<section class="slide">` nodes, inline SVG diagrams, print CSS, a local TeX SVG vendor script, and a small amount of JavaScript. The private authoring workflow is unknowable from the public source alone. We will extract the engineering pattern, not copy its implementation.

## MVP architecture

- `engine/`: fixed-stage runtime, hash/history navigation, scaling, presenter helpers, print hooks, transitions.
- `styles/`: reset, semantic tokens, deterministic layout, typography, components, charts, print rules.
- `components/`: small declarative renderer for common slide types; custom slides remain HTML/SVG escape hatches.
- `themes/`: semantic theme JSON/CSS; deck content never hardcodes palette values.
- `template/`: reusable deck authoring contract (`CONTENT.md`, `GROUNDING.md`, `OUTLINE.md`, `STYLE.md`, `deck.json`, `index.html`).
- `scripts/`: Node CLI utilities for dev server, screenshots, PDF, layout QA, grounding QA, and a best-effort PPTX theme extractor.
- `examples/example-deck/`: complete grounded example using title, statement, comparison, chart, pipeline, timeline, image-like SVG, equation, and closing slides.

## Deliberate MVP choices

1. Vanilla HTML/CSS/JS; no framework or bundler.
2. 1280×720 internal stage with transform scaling; no responsive reflow.
3. `deck.json` is declarative for common slides; `custom` uses a registered HTML/SVG renderer.
4. Formula rendering uses a local, dependency-free KaTeX-like fallback renderer for the example; future builds can vendor KaTeX/MathJax.
5. Screenshot/PDF tools use Playwright when installed, otherwise the CLI reports a precise prerequisite failure. Verification will install Playwright locally if network and browser download permit.
6. Grounding checker is intentionally rule-based and checks source IDs, claim IDs, evidence references, numeric claims, orphan claims, and missing source paths/URLs.
7. Layout linter runs in the browser and returns JSON/console diagnostics; it avoids pretending that pixel-perfect visual judgment can be fully automated.

## Execution order

1. Scaffold source and authoring contract.
2. Implement engine, renderer, theme, components, and checkers.
3. Author and ground the example deck.
4. Run syntax checks, dev server, browser render, screenshot, layout QA, grounding QA, and PDF export.
5. Inspect representative screenshots and fix overflow/overlap or density issues.
6. Update README with creation and extension workflows; clearly label next-stage capabilities.

## Acceptance criteria

- `npm run dev` serves the example deck.
- `npm run grounding-check` returns PASS.
- `npm run layout-check` returns PASS/WARN diagnostics with no boundary FAIL.
- `npm run screenshot` produces one PNG per slide.
- `npm run export-pdf` produces a 16:9 PDF with one slide per page.
- Hash navigation supports `#1`, `#2`, etc.; keyboard and browser history work.
- All example facts have traceable source IDs; no invented benchmark numbers.
- README and AGENTS.md are sufficient for another coding agent to modify the deck safely.
