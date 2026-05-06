---
name: carbon-web-components
description: IBM Carbon Web Components (`@carbon/web-components`) implementation guidance. Use when building, migrating, or reviewing custom-element code with `cds-*` tags — `cds-modal`, `cds-data-table`, `cds-button`, `cds-side-nav` — in framework-neutral, Vue, Angular, Lit, or vanilla HTML projects, including event/slot/shadowDOM behavior and treeshaking import paths. Skip when the project imports `@carbon/react` (use carbon-react), or for non-Carbon web components.
---

# Carbon Web Components

Use this skill when a project uses, or should use, `@carbon/web-components`.

## Workflow

1. Inspect the project for `@carbon/web-components` imports, custom elements, styles, and bundler conventions.
2. Use `references/source-index.md` to locate package and implementation references.
3. Read only the needed topic docs under `references/`.
4. Prefer established Carbon Web Components over custom recreations.
5. Verify custom element registration, attributes, events, forms, theming, and accessibility.
6. Use `carbon-patterns` for workflow-level behavior before choosing components.

## Reference Lookup

- Start with `references/source-index.md`.
- Use package README or source references for setup, imports, events, and component APIs.
- If the topic is ambiguous, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for `@carbon/web-components` implementation. Use `carbon-react` for React components and `carbon-foundations` when no official Carbon package is used.

## References

- `references/source-index.md`: source files and notes for Carbon Web Components guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
