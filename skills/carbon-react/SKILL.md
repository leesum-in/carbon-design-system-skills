---
name: carbon-react
description: IBM Carbon React (`@carbon/react`) implementation guidance. Use when building, editing, or reviewing React/Next.js code that uses `@carbon/react` — components like Modal, ComposedModal, DataTable, ComboBox, Dropdown, Tabs, Notification (Inline/Toast/Actionable), UIShell header/side nav, Theme/Layer, FluidForm inputs — or any `.tsx`/`.jsx` file that imports from `@carbon/react`, even when "Carbon" is not said out loud. Skip for framework-neutral `@carbon/web-components`, Sass-only `@carbon/styles` work, or non-Carbon React.
---

# Carbon React

Use this skill when a React codebase uses, or should use, `@carbon/react`.

## Workflow

1. Inspect the project for existing Carbon packages, imports, styles, and component conventions.
2. Use `references/source-index.md` to find the exact component or package source files.
3. Read only the needed topic docs under `references/`.
4. Prefer established `@carbon/react` components over custom recreations.
5. Compose components according to local project patterns and Carbon product UX guidance.
6. Use `carbon-patterns` for workflow-level decisions such as modal behavior, validation, notifications, and empty states.
7. Use `carbon-themes` when the question is primarily about the standalone `@carbon/themes` package.

## Reference Lookup

- Start with `references/source-index.md`; it maps each component to `guidelines/` files for usage, code, accessibility, and style, plus `specs/` files for package API docs.
- For implementation details, load the component `specs/` API doc plus `guidelines/usage.mdx`; add `guidelines/accessibility.mdx` or `guidelines/style.mdx` only when reviewing those concerns.
- If the component name or behavior is unclear, run the `rg -n` search command shown in the index.
- Do not read the whole reference tree for one component question.

## Boundaries

Use this skill for:

- `@carbon/react` imports, component usage, and composition.
- Carbon React theme setup and runtime `<Theme>` usage.
- Carbon React forms, data tables, tabs, shell, modals, notifications, and controls.
- React accessibility and state patterns for Carbon components.
- Reviewing React implementations for Carbon consistency.

Do not use this skill for framework-neutral foundations unless React component behavior is involved. Use `carbon-foundations` instead.

## References

- `references/source-index.md`: source files and notes for Carbon React guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
