---
name: carbon-colors
description: IBM Carbon `@carbon/colors` package guidance. Use for raw IBM Design Language palettes — `$blue-60`, `$red-50`, `cool-gray-*` — Sass and JS exports, hex value lookups, mapping hex back to named tokens, and palette-only usage in non-Carbon dataviz/charts/SVG. Skip for semantic role tokens like `text-primary` or `support-error` (carbon-themes), or palette-mimicking in Tailwind without Carbon packages (carbon-foundations).
---

# Carbon Colors

Use this skill when a task depends on the `@carbon/colors` package. This package is for raw IBM Design Language color palettes and values; use `carbon-themes` when the task needs semantic theme tokens.

## Workflow

1. Inspect whether the project imports `@carbon/colors` directly or only needs Carbon color principles.
2. Use `references/source-index.md` to locate package, usage, and color reference files.
3. Read only the needed topic docs under `references/`.
4. Prefer semantic theme tokens for product UI roles when available; use raw colors for palette-level work.
5. Verify contrast, state usage, and accessibility before applying raw color values.

## Reference Lookup

- Start with `references/source-index.md`.
- Use package README or code references for imports and available exports.
- Use website color docs for palette usage, accessibility, and role guidance.
- If the topic is ambiguous, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for `@carbon/colors` package usage and raw color palette decisions. Use `carbon-themes` for semantic tokens, `carbon-foundations` for package-free color judgment, and `carbon-react` for React component theme behavior.

## References

- `references/source-index.md`: source files and notes for Carbon color package guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
