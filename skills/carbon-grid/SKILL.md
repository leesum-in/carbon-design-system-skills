---
name: carbon-grid
description: IBM Carbon `@carbon/grid` package guidance. Use for the Carbon 16-column responsive grid — `<Grid>`/`<Column>` markup, Sass mixins, breakpoints (sm/md/lg/xlg/max), gutter widths, nested grids, CSS-Grid vs flex-grid, hang-left/right offsets, and v10→v11 grid migrations. Skip for spacing-token questions like `$spacing-05` (carbon-layout), generic CSS Grid help, or non-Carbon Tailwind grids.
---

# Carbon Grid

Use this skill when a task depends on the `@carbon/grid` package or official Carbon grid implementation details.

## Workflow

1. Inspect whether the project uses `@carbon/grid`, Carbon Sass grid APIs, or a package-free grid implementation.
2. Use `references/source-index.md` to locate grid usage and package references.
3. Read only the needed topic docs under `references/`.
4. Verify container width, column spans, gutters, breakpoints, and nested layout choices.
5. Use `carbon-foundations` when the task is only a package-free design review.

## Reference Lookup

- Start with `references/source-index.md`.
- Use website grid usage docs for layout behavior and package files for import/API details.
- If the topic is ambiguous, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for `@carbon/grid` and Carbon 16 column grid implementation. Use `carbon-layout` for spacing tokens and `carbon-react` for React component layout composition.

## References

- `references/source-index.md`: source files and notes for Carbon grid package guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
