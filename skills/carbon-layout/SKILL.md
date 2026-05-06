---
name: carbon-layout
description: IBM Carbon `@carbon/layout` package guidance. Use for spacing scale tokens — `$spacing-01..09`, `$layout-01..07` — density choices, padding/margin token mapping, fluid spacing across breakpoints, the `mini-units()` function, and Sass/JS layout token exports. Skip for the 16-column grid system itself (carbon-grid), semantic theme background tokens (carbon-themes), or non-Carbon spacing systems.
---

# Carbon Layout

Use this skill when a task depends on the `@carbon/layout` package or package-based Carbon spacing tokens.

## Workflow

1. Inspect whether the project imports `@carbon/layout` or maps Carbon spacing into local utilities.
2. Use `references/source-index.md` to locate spacing and package references.
3. Read only the needed topic docs under `references/`.
4. Verify spacing scale consistency, component padding, margins, density, and responsive layout units.
5. Use `carbon-grid` when the issue is column grid behavior.

## Reference Lookup

- Start with `references/source-index.md`.
- Use spacing docs for scale decisions and package files for import/API details.
- If the topic is ambiguous, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for `@carbon/layout` and spacing package usage. Use `carbon-foundations` for package-free layout judgment and `carbon-grid` for the 16 column grid.

## References

- `references/source-index.md`: source files and notes for Carbon layout package guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
