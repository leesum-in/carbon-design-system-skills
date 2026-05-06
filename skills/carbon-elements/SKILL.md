---
name: carbon-elements
description: IBM Carbon `@carbon/elements` umbrella package guidance. Use when evaluating or installing the umbrella that re-exports `@carbon/colors`, `@carbon/type`, `@carbon/icons`, `@carbon/layout`, and `@carbon/motion`, or deciding between umbrella vs narrower sub-packages (treeshaking, peer-dep strategy, version mismatches). Skip when the task is specifically about one sub-package — defer to that package's skill (carbon-colors, carbon-type, carbon-icons, carbon-layout, carbon-motion).
---

# Carbon Elements

Use this skill when a task depends on the `@carbon/elements` package or needs to understand how Carbon element packages fit together. Prefer narrower package skills when the task is specifically about colors, type, icons, layout, grid, motion, or themes.

## Workflow

1. Inspect whether the project imports `@carbon/elements` directly or can use a narrower `@carbon/*` package.
2. Use `references/source-index.md` to locate package files and related element guidance.
3. Read only the needed topic docs under `references/`.
4. Keep recommendations package-specific when a narrower package provides the needed API.
5. Use `carbon-foundations` when the user only wants Carbon design principles without package APIs.

## Reference Lookup

- Start with `references/source-index.md`.
- Use package README specs for install and import guidance.
- Use specific package skills for deeper API guidance.
- If the topic is ambiguous, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for `@carbon/elements` package usage and package selection. Do not use it as a catch-all replacement for more specific package skills.

## References

- `references/source-index.md`: source files and notes for Carbon elements package guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
