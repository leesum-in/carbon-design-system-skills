---
name: carbon-patterns
description: IBM Carbon product UX pattern guidance. Use for "which pattern fits" decisions — Modal vs Dialog vs Popover vs inline confirmation, destructive action flows, multi-step wizards, long forms with validation timing (blur/submit/inline), search vs filter vs faceted browse, loading choice (skeleton vs InlineLoading vs ProgressBar), notification level (toast vs inline vs actionable vs banner), empty states, disclosure, common actions (Cancel/Discard/Close), and dense data workflows. Skip for component prop questions, design tokens, color/motion values, or grid math.
---

# Carbon Patterns

Use this skill for product UX decisions that sit above individual component APIs.

## Workflow

1. Identify the workflow problem: decision, input, feedback, navigation, search, filtering, loading, or recovery.
2. Use `references/source-index.md` to locate the relevant official pattern source.
3. Read only the needed topic docs under `references/`.
4. Choose the Carbon pattern before choosing the component implementation.
5. If implementation is framework-specific, pair this skill with `carbon-react` or another package skill.

## Reference Lookup

- Start with `references/source-index.md`; it maps each product UX pattern to its official canonical MDX source.
- Prefer direct catalog entries for dialogs, forms, notifications, empty states, search, filtering, loading, common actions, disabled/read-only states, and global header behavior.
- If the workflow maps to multiple patterns, open the likely pattern pages and compare their decision guidance before choosing components.
- If the right pattern is unclear, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for:

- Dialog and modal behavior.
- Forms, validation, and error recovery.
- Inline, toast, actionable, callout, and banner notifications.
- Empty states, loading states, skeletons, disclosure, and common actions.
- Search, filtering, data table workflows, and dense product experiences.

Do not use this skill as a component API reference. Use framework-specific skills for imports and props.

## References

- `references/source-index.md`: source files and notes for Carbon pattern guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
