# Carbon Skill Taxonomy

This file defines the first-pass boundaries for the Carbon Design System skill pack.

## Packaging Model

The plugin is the distribution unit. Skills are the activation units.

- `.codex-plugin`: Codex plugin manifest and UI metadata.
- `skills/*`: individual skills installed as part of the plugin.
- `references`: shared project-level references used to build or audit skill contents.
- `scripts`: shared scripts for source inventory, reference generation, and validation.

## Usage Modes

Carbon Design System skills are split by how users adopt Carbon:

1. **Foundational adoption**: the project follows Carbon principles and design language,
   but implements the UI directly in Tailwind, custom CSS, vanilla CSS, or a local
   component system.
2. **Package adoption**: the project installs and imports official `@carbon/*` libraries
   directly.

Skills are activation units. Package skills should map closely to real package names so
an agent can trigger on install/import statements and package-specific tasks.

## Initial Skills

### carbon-foundations

Use for framework-neutral Carbon principles, philosophy, design language, accessibility,
content guidance, and direct custom implementation that does not depend on official
Carbon packages.

Do not include package-specific APIs here. Link to package skills instead.

### carbon-react

Use for React applications that directly use `@carbon/react`.

Include component import patterns, composition guidance, state patterns, form controls,
data table usage, shell layout, and Carbon React-specific caveats.

### carbon-patterns

Use for product UX patterns independent of a single component implementation.

Include dialogs, forms, validation, notifications, empty states, search, filtering,
loading, disclosure, common actions, and data-heavy workflows.

### carbon-icons

Use for selecting, importing, sizing, labeling, and pairing Carbon icons with UI
controls.

Include `@carbon/icons`, framework icon usage, icon-only button accessibility, and
naming guidance.

### carbon-pictograms

Use for selecting, importing, sizing, labeling, and reviewing Carbon pictograms.

Include `@carbon/pictograms`, illustrative storytelling, empty-state visuals, onboarding
visuals, and pictogram accessibility.

## Package Skills

Each supported `@carbon/*` package should have a matching package skill:

- `carbon-react`: `@carbon/react`
- `carbon-web-components`: `@carbon/web-components`
- `carbon-styles`: `@carbon/styles`
- `carbon-elements`: `@carbon/elements`
- `carbon-colors`: `@carbon/colors`
- `carbon-grid`: `@carbon/grid`
- `carbon-icons`: `@carbon/icons`
- `carbon-pictograms`: `@carbon/pictograms`
- `carbon-layout`: `@carbon/layout`
- `carbon-motion`: `@carbon/motion`
- `carbon-themes`: `@carbon/themes`
- `carbon-type`: `@carbon/type`

## Future Skills

- `carbon-vue`: Vue-specific Carbon usage.
- `carbon-data-viz`: Charts and data visualization guidance.
- `carbon-ai`: AI-related Carbon guidance.
- `carbon-accessibility`: Deep accessibility review workflows if the foundations skill
  becomes too large.

## Source Inventory Rules

Prefer official sources in this order:

1. `carbon-design-system/carbon-website` MDX and data files.
2. `carbon-design-system/carbon` package docs and component API MDX files.
3. Official package documentation generated from source.

Store raw source maps separately from skill guidance. `SKILL.md` files should stay
concise and should point to references that are loaded only when needed.
