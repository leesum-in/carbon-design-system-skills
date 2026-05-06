---
name: carbon-motion
description: IBM Carbon `@carbon/motion` package guidance. Use for productive vs expressive duration tokens (productive-fast 110ms, productive-medium 140ms, expressive-medium 240ms…), easing curves (`productive.standard`, `expressive.entrance`), choreography/stagger between sequential animations, `prefers-reduced-motion` handling, and Sass/JS motion exports. Skip for non-Carbon animation libraries (Framer Motion, Lottie standalone) or generic CSS transition help.
---

# Carbon Motion

Use this skill when a task depends on the `@carbon/motion` package or official Carbon motion behavior.

## Workflow

1. Inspect whether the project imports `@carbon/motion` or locally defines Carbon-like transitions.
2. Use `references/source-index.md` to locate motion usage and package references.
3. Read only the needed topic docs under `references/`.
4. Choose productive or expressive motion intentionally.
5. Verify duration, easing, choreography, interruption behavior, and reduced-motion accessibility.

## Reference Lookup

- Start with `references/source-index.md`.
- Use motion docs for behavior and package files for import/API details.
- If the topic is ambiguous, run the `rg -n` search command shown in the index.

## Boundaries

Use this skill for `@carbon/motion` package usage and Carbon motion decisions. Use `carbon-foundations` when motion is only part of a broader package-free design review.

## References

- `references/source-index.md`: source files and notes for Carbon motion package guidance.
- `references/`: topic-first Carbon references, organized as `<topic>/guidelines/` and `<topic>/specs/`.
