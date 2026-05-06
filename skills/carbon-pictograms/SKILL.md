---
name: carbon-pictograms
description: IBM Carbon `@carbon/pictograms` and `@carbon/pictograms-react` guidance. Use for storytelling visuals — empty-states, onboarding cards, marketing heroes — pictogram selection, sizing, color override, and decorative-vs-meaningful accessibility (`aria-hidden` vs `aria-label`/`role="img"`). Skip for actionable UI icons in buttons/toolbars (carbon-icons) or non-Carbon illustrations.
---

# Carbon Pictograms

Use this skill for Carbon pictogram selection and implementation. Pictograms are illustrative assets for storytelling and product context; they are not replacements for actionable UI icons.

## Workflow

1. Determine whether the visual should be a pictogram, icon, product screenshot, or no visual asset.
2. Use `references/source-index.md` to locate official pictogram usage and code guidance.
3. Read only the needed topic docs under `references/`.
4. Prefer Carbon pictograms over custom illustrative assets in Carbon-aligned UI.
5. Verify sizing, placement, visual density, and whether the pictogram needs accessible text.
6. Use `carbon-icons` when the requested asset is an actionable or compact UI icon.

## Reference Lookup

- Start with `references/source-index.md`; it maps official pictogram pages to exact canonical MDX paths.
- Use `usage.mdx` for pictogram selection, storytelling, sizing, and accessibility guidance.
- Use `code.mdx` for package and implementation details.
- If the requested pictogram name or usage is unclear, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for:

- Carbon pictogram selection and naming.
- `@carbon/pictograms` asset usage.
- Pictogram sizing, alignment, and visual consistency.
- Empty-state, onboarding, marketing-adjacent, or explanatory visuals inside Carbon-aligned product UI.

Do not use this skill for icon-only buttons, toolbar actions, or compact interactive controls.

## References

- `references/source-index.md`: source files and notes for Carbon pictogram guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
