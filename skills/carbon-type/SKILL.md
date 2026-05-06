---
name: carbon-type
description: IBM Carbon `@carbon/type` package guidance. Use for IBM Plex (Sans/Mono/Serif) setup, productive vs expressive type ramps (`productive-heading-*`, `expressive-heading-*`, `body-01`, `body-compact-01`, `code-01/02`), font subsetting, type-scale audits, and Sass/JS type exports. Skip for non-Carbon font setup (next/font Inter, generic Google Fonts) or layout/grid spacing (carbon-layout).
---

# Carbon Type

Use this skill when a task depends on the `@carbon/type` package or official Carbon typography tokens.

## Workflow

1. Inspect whether the project imports `@carbon/type` or maps Carbon type tokens into local styles.
2. Use `references/source-index.md` to locate typography usage and package references.
3. Read only the needed topic docs under `references/`.
4. Verify type token selection, hierarchy, IBM Plex usage, line length, and code text treatment.
5. Use `carbon-foundations` when the task is only a package-free typography review.

## Reference Lookup

- Start with `references/source-index.md`.
- Use typography docs for hierarchy and package files for import/API details.
- If the topic is ambiguous, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for `@carbon/type` and Carbon typography implementation. Use `carbon-react` for React component typography behavior and `carbon-foundations` for package-free UI judgment.

## References

- `references/source-index.md`: source files and notes for Carbon type package guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
