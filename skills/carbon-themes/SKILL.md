---
name: carbon-themes
description: IBM Carbon `@carbon/themes` package guidance. Use for semantic theme tokens (`background`, `layer-01`, `text-primary`, `support-error`), runtime theme switching (g10/g90/g100/white) via JS export or Sass, nested-region theming, and v10→v11 token migrations. Skip for raw palette hex values (carbon-colors), Sass entrypoint structure (carbon-styles), or React `<Theme>` component usage (carbon-react).
---

# Carbon Themes

Use this skill when a task depends on the `@carbon/themes` package or semantic Carbon theme tokens.

## Workflow

1. Inspect whether the project imports `@carbon/themes`, configures Sass themes, or uses runtime theme tokens.
2. Use `references/source-index.md` to locate theme usage and package references.
3. Read only the needed topic docs under `references/`.
4. Prefer semantic theme tokens over raw palette values for product UI roles.
5. Verify theme selection, token role, contrast, and light/dark behavior.

## Reference Lookup

- Start with `references/source-index.md`.
- Use theme docs for semantic token behavior and package files for imports/API details.
- If the topic is ambiguous, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for `@carbon/themes` package usage and semantic theme tokens. Use `carbon-colors` for raw color palette values and `carbon-react` for React-specific `<Theme>` usage.

## References

- `references/source-index.md`: source files and notes for Carbon themes package guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
