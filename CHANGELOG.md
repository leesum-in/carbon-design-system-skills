# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-05-07

### Added

- Initial Claude Code + Codex CLI plugin scaffold (`.claude-plugin/`, `.codex-plugin/`).
- Fourteen Carbon skills covering foundations, product UX patterns, `@carbon/react`,
  `@carbon/web-components`, `@carbon/styles`, and the `@carbon/*` package family.
- `scripts/sync-carbon-references.ts` to mirror official Carbon MDX/specs into
  per-skill `references/` trees.
- `scripts/validate-skill-pack.py` plus structural and skill-triggering tests.
- `scripts/bump-version.sh` and `.version-bump.json` for cross-file version sync.

### Fixed

- Marketplace `source` declared as `"./"` so Claude Code recognizes the local plugin path.
- Codex install instruction uses `codex plugin marketplace add ...` (the `codex plugin add github:...` form is not supported).

[Unreleased]: https://github.com/leesum-in/carbon-design-system-skills/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/leesum-in/carbon-design-system-skills/releases/tag/v0.1.0
