---
name: carbon-foundations
description: Framework-neutral IBM Carbon Design System foundations. Use when adopting Carbon's principles, type scale, spacing, color, density, accessibility, or content guidance in a project that does NOT install `@carbon/*` packages — Tailwind, Mantine, Chakra, vanilla CSS, custom design system, or Figma audit. Use for "Carbon-inspired", "feels like Carbon", or "Carbon-aligned" without packages. Skip if the project imports any `@carbon/*` package — defer to the package-specific skill.
---

# Carbon Foundations

Use this skill when a project wants to follow Carbon's principles without installing official Carbon packages. The implementation can be Tailwind, custom CSS, vanilla CSS, or another local design system, but this skill supplies the Carbon judgment behind those implementation choices.

## Workflow

1. Identify whether the task is design guidance, implementation, or review.
2. Use `references/source-index.md` to locate the smallest relevant official source set.
3. Read only the needed topic docs under `references/`.
4. Apply Carbon guidance for product UI principles, accessibility, content, interaction states, and design language consistency.
5. If the task depends on a specific `@carbon/*` package, hand off to the matching package skill:
   - React: `carbon-react`
   - Web Components: `carbon-web-components`
   - Colors: `carbon-colors`
   - Grid: `carbon-grid`
   - Layout: `carbon-layout`
   - Motion: `carbon-motion`
   - Themes: `carbon-themes`
   - Type: `carbon-type`
   - Icons: `carbon-icons`
   - Pictograms: `carbon-pictograms`
   - Product UX patterns: `carbon-patterns`

## Reference Lookup

- Start with `references/source-index.md`; it is the curated catalog for source-backed Carbon foundations.
- Prefer exact catalog paths for Carbon overview, ecosystem, accessibility, and content guidance.
- If the topic is ambiguous, run the `rg -n` search command shown in the index instead of scanning the full reference tree.
- Load source files progressively: overview or usage first, then code/accessibility/style only when the task needs those details.

## Boundaries

Use this skill for:

- Carbon principles, design language, accessibility, and content guidance.
- Framework-neutral review of Carbon-aligned product UI decisions.
- Custom implementations that should look and behave like Carbon.
- Tailwind or utility CSS projects that need Carbon foundations without a package-specific skill.

Do not use this skill as a Carbon website archive or as the primary source for package APIs, framework setup, theme package usage, or component implementation details. Use package-specific or pattern-specific skills for that.

## References

- `references/source-index.md`: source files and notes for Carbon foundation guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
