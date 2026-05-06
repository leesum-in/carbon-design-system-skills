# Carbon Design System Skills

Agent-ready skills for using [IBM Carbon Design System](https://carbondesignsystem.com)
with Claude Code and Codex CLI.

This repository ships fourteen skills that route an AI agent to the right Carbon
guidance — foundations, product UX patterns, `@carbon/react`, `@carbon/web-components`,
and every supported `@carbon/*` package — without forcing the agent to crawl the full
Carbon docs site for each task.

## Install

The skill pack is published as a single plugin that targets two runtimes from one
repository.

### Claude Code

Add this repository as a plugin marketplace, then install the plugin:

```text
/plugin marketplace add leesum-in/carbon-design-system-skills
/plugin install carbon-design-system@carbon-design-system-skills
```

After install, the fourteen Carbon skills become available to Claude Code and
auto-trigger on Carbon-related prompts and edits.

### Codex CLI

Add this repository as a Codex marketplace, then restart Codex to pick up the skills:

```text
codex plugin marketplace add leesum-in/carbon-design-system-skills
```

The Codex manifest at `.codex-plugin/plugin.json` registers the same skills through
`agents/openai.yaml` files inside each skill directory.

### Local development

Clone the repository and run the validation suite:

```bash
git clone https://github.com/leesum-in/carbon-design-system-skills.git
cd carbon-design-system-skills
bun install
bun run check
```

## Skills

| Skill                   | Use when                                                          |
| ----------------------- | ----------------------------------------------------------------- |
| `carbon-foundations`    | Carbon principles, accessibility, and content guidance            |
| `carbon-patterns`       | Product UX patterns — forms, dialogs, notifications, empty states |
| `carbon-react`          | Building or reviewing React UIs that import from `@carbon/react`  |
| `carbon-web-components` | Framework-neutral `@carbon/web-components` work                   |
| `carbon-styles`         | The `@carbon/styles` Sass package                                 |
| `carbon-elements`       | The `@carbon/elements` umbrella package                           |
| `carbon-colors`         | The `@carbon/colors` package                                      |
| `carbon-grid`           | The `@carbon/grid` package                                        |
| `carbon-icons`          | The `@carbon/icons` package and framework icon usage              |
| `carbon-pictograms`     | The `@carbon/pictograms` package                                  |
| `carbon-layout`         | The `@carbon/layout` package                                      |
| `carbon-motion`         | The `@carbon/motion` package                                      |
| `carbon-themes`         | The `@carbon/themes` package                                      |
| `carbon-type`           | The `@carbon/type` package                                        |

Each skill exposes its own `references/source-index.md` that maps tasks to the exact
Carbon docs and package source paths the agent should load.

## Repository Layout

```text
.claude-plugin/
  plugin.json
  marketplace.json
.codex-plugin/
  plugin.json
skills/
  carbon-foundations/
    SKILL.md
    references/
      source-index.md
      carbon/
  carbon-react/
    SKILL.md
    references/
      source-index.md
      button/
        guidelines/
        specs/
  carbon-patterns/
    ...
  carbon-*/
    ...
references/
  taxonomy.md
scripts/
  sync-carbon-references.ts
  validate-skill-pack.py
tests/
  structural/
  skill-triggering/
  sync-carbon-references/
```

## Sync Carbon References

Refresh the skill references against the latest Carbon source:

```bash
bun run sync:carbon-references
```

The script clones `carbon-design-system/carbon-website` into `.cache/carbon-website` and
`carbon-design-system/carbon` into `.cache/carbon`, then routes the relevant MDX files
and package docs into each skill under `references/<topic>/{guidelines,specs}/`.

Pin to a specific revision:

```bash
bun scripts/sync-carbon-references.ts --ref <commit-or-tag>
bun scripts/sync-carbon-references.ts --carbon-ref <commit-or-tag>
```

For local fixtures or offline work, pass `--source-dir`, `--target-dir`,
`--carbon-remote`, or `--carbon-cache-dir`.

## Testing

```bash
bun run check
```

This runs TypeScript type checking, ESLint, Prettier, structural validation (plugin
manifests, skill frontmatter, required references, repository hygiene), trigger fixture
coverage, and the Carbon references sync fixture.

## Contributing

All code, documentation, skill text, metadata, and commit messages must be written in
English. Follow Conventional Commits:

```text
type(scope): summary
```

Preferred types:

- `feat`: Add a skill, reference, script, or user-facing capability.
- `fix`: Correct broken metadata, invalid skill structure, or incorrect guidance.
- `docs`: Update documentation only.
- `chore`: Repository maintenance, formatting, or generated metadata.
- `refactor`: Restructure existing content without changing intended behavior.
- `test`: Add or update validation coverage.

## License

MIT. See [LICENSE](./LICENSE).
