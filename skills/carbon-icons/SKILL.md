---
name: carbon-icons
description: IBM Carbon `@carbon/icons` and framework wrappers (`@carbon/icons-react`, `@carbon/icons-vue`) guidance. Use for picking, importing, and applying actionable UI icons — Add, Trash, Search, Settings, ChevronDown, Edit — including icon-only IconButton accessibility (aria-label, target size), sizing (16/20/24px), tree-shakable import paths, and v10→v11 import path changes. Skip for storytelling/illustration assets (carbon-pictograms) or non-Carbon icon libraries (lucide, heroicons, feather).
---

# Carbon Icons

Use this skill for Carbon icon selection and implementation.

## Workflow

1. Determine whether the icon is decorative, informative, or an actionable control.
2. Use `references/source-index.md` to locate official icon usage and code guidance.
3. Read only the needed topic docs under `references/`.
4. Prefer Carbon icons over custom icons in Carbon-aligned UI.
5. For actionable icons, verify accessible names, hit targets, and button semantics.
6. Pair with `carbon-react` when using `@carbon/icons-react` inside React components.
7. Use `carbon-pictograms` when the visual asset is illustrative storytelling rather than an icon.

## Reference Lookup

- Start with `references/source-index.md`; it maps official icon pages to exact canonical MDX paths.
- Use `usage.mdx` for icon selection, semantics, sizing, and accessibility guidance.
- Use `code.mdx` for package and implementation details.
- If the requested icon name or action pairing is unclear, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for:

- Carbon icon selection and naming.
- `@carbon/icons` asset usage.
- `@carbon/icons-react` usage.
- Icon sizing, alignment, and visual consistency.
- Icon-only button accessibility.

Do not use this skill for broader component behavior unless the issue is icon-specific, and do not use it for pictogram storytelling guidance.

## References

- `references/source-index.md`: source files and notes for Carbon icon and pictogram guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
