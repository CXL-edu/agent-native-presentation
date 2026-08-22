# Thesis

A presentation should be a version-controlled, grounded, programmable visual document that an agent can repeatedly modify and verify.

# Sources

## source-001

Type: user-provided

Title: Agent-native Presentation / Deck System requirements

URL / Path: user prompt in this task

Retrieved: 2026-08-22

Key evidence: The requested system is code-first; separates content, evidence, design, rendering, data, export, and visual QA; uses a fixed 1280×720 stage; supports declarative slide data; requires grounding, screenshots, PDF export, and agent iteration.

Relevant slides: slide-02, slide-03, slide-04, slide-05, slide-06, slide-07, slide-08, slide-09, slide-10, slide-11, slide-12

## source-002

Type: web

Title: 搜索即 test-time compute · 肖涵 · AI 搜索技术大会

URL / Path: https://github.com/hanxiao/hanxiao.github.io/tree/master/tencent-elastic-search-ai-2026

Retrieved: 2026-08-22

Key evidence: The public artifact is a custom HTML web deck with section-based slides, inline SVG, print CSS, local formula rendering support, and JavaScript navigation behavior. It demonstrates a web-native presentation implementation, not proof of the author's private workflow.

Relevant slides: reference only; no direct example-deck claims

## source-003

Type: local implementation

Title: This agent-native-presentation MVP source tree

URL / Path: /Users/jackchen/agent-native-presentation/engine, /Users/jackchen/agent-native-presentation/components, /Users/jackchen/agent-native-presentation/scripts

Retrieved: 2026-08-22

Key evidence: The implementation contains a fixed-stage engine, declarative renderer, component primitives, external chart data, selectable/copyable code blocks, local animated SVG, reduced-motion and print fallbacks, grounding checks, layout checks, screenshot export, and PDF export scripts.

Relevant slides: slide-06, slide-07, slide-08, slide-09, slide-10

# Claims

## claim-001

Claim: “The editable unit is the system, not the binary slide file.”

Evidence: source-001

Raw value: Design principle from the user-provided requirements.

Used in: slide-02, slide-03

## claim-002

Claim: “Quality compounds when grounding, determinism, and iteration are explicit.”

Evidence: source-001

Raw value: A presentation-system design heuristic, not an empirical benchmark.

Used in: slide-10

## claim-003

Claim: “A deck can be treated as a repeatable workflow from research through visual verification.”

Evidence: source-001

Raw value: Workflow specified by the user-provided requirements and implemented in this repository.

Used in: slide-05, slide-10, slide-12

# Fact Check

slide-01: PASS — cover statement, no external fact
slide-02: PASS — source-001 / claim-001
slide-03: PASS — source-001 / claim-001
slide-04: PASS — source-001; ordinal values are sequence markers, not benchmark data
slide-05: PASS — source-001 / claim-003
slide-06: PASS — source-001 / source-003
slide-07: PASS — source-001 / source-003
slide-08: PASS — source-001 / source-003; code is local source, not an external benchmark
slide-09: PASS — source-001 / source-003; animation is explanatory and has a static final state
slide-10: PASS — source-001 / source-003 / claim-003; one-shot workflow animation, static after completion
slide-11: PASS — source-001 / claim-002; explicitly labeled heuristic
slide-12: PASS — source-001 / claim-003
