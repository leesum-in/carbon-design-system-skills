---
name: carbon-styles
description: IBM Carbon `@carbon/styles` Sass package guidance. Use when installing, scoping, or migrating Sass entrypoints — `@use '@carbon/styles'`, component module imports (`@use '@carbon/styles/scss/components/button'`), reset, theme overrides, sass deprecation fixes — typically in Sass-first or non-React Carbon projects. Skip for component-API questions in `@carbon/react` or `@carbon/web-components`, semantic theme tokens (carbon-themes), or raw palette values (carbon-colors).
---

# Carbon Styles

Use this skill when a task depends on the `@carbon/styles` Sass package. This package is common in older or Sass-first Carbon integrations.

## Workflow

1. Inspect the project for `@carbon/styles` imports, Sass module usage, and build tooling.
2. Use `references/source-index.md` to locate package files and related implementation guidance.
3. Read only the needed topic docs under `references/`.
4. Verify Sass entrypoints, theme setup, component style imports, build output, and migration risks.
5. Prefer component package skills when the task is about framework-specific component APIs.

## Reference Lookup

- Start with `references/source-index.md`.
- Use package README or Sass source references for imports and entrypoints.
- If the topic is ambiguous, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for `@carbon/styles` and Sass-based Carbon styling. Use `carbon-react` or `carbon-web-components` for component APIs and `carbon-themes` for semantic theme tokens.

## References

- `references/source-index.md`: source files and notes for Carbon styles package guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
