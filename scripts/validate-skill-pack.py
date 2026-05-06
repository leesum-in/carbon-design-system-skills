#!/usr/bin/env python3
"""Validate the Carbon Design System skill pack structure."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


EXPECTED_SKILLS = {
    "carbon-colors",
    "carbon-elements",
    "carbon-foundations",
    "carbon-grid",
    "carbon-icons",
    "carbon-layout",
    "carbon-motion",
    "carbon-pictograms",
    "carbon-patterns",
    "carbon-react",
    "carbon-styles",
    "carbon-themes",
    "carbon-type",
    "carbon-web-components",
}

REFERENCE_SUFFIXES = {
    ".json",
    ".md",
    ".mdx",
    ".scss",
    ".ts",
    ".tsx",
}

FORBIDDEN_PATTERNS = {
    "stale nested plugin path": re.compile(r"plugins/carbon-design-system"),
    "template placeholder": re.compile(r"\[TODO|TODO:|placeholder", re.IGNORECASE),
    "non-english text": re.compile(r"[\uac00-\ud7a3]"),
}


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def read_frontmatter(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if not match:
        raise ValueError("missing YAML frontmatter")

    fields: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if ": " not in line:
            raise ValueError(f"invalid frontmatter line: {line}")
        key, value = line.split(": ", 1)
        fields[key] = value
    return fields


def validate_plugin_manifest(repo: Path, errors: list[str]) -> None:
    manifest_path = repo / ".codex-plugin" / "plugin.json"
    if not manifest_path.exists():
        fail(errors, "missing .codex-plugin/plugin.json")
        return

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(errors, f"invalid plugin JSON: {exc}")
        return

    if manifest.get("name") != "carbon-design-system":
        fail(errors, "plugin name must be carbon-design-system")
    if manifest.get("skills") != "./skills/":
        fail(errors, "plugin skills path must be ./skills/")
    if not manifest.get("version"):
        fail(errors, "plugin version is required")
    if not manifest.get("description"):
        fail(errors, "plugin description is required")


def validate_claude_plugin_manifest(repo: Path, errors: list[str]) -> None:
    manifest_path = repo / ".claude-plugin" / "plugin.json"
    if not manifest_path.exists():
        fail(errors, "missing .claude-plugin/plugin.json")
        return

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(errors, f"invalid claude plugin JSON: {exc}")
        return

    if manifest.get("name") != "carbon-design-system":
        fail(errors, "claude plugin name must be carbon-design-system")
    if not manifest.get("description"):
        fail(errors, "claude plugin description is required")
    if not manifest.get("version"):
        fail(errors, "claude plugin version is required")


def validate_marketplace_manifest(repo: Path, errors: list[str]) -> None:
    marketplace_path = repo / ".claude-plugin" / "marketplace.json"
    if not marketplace_path.exists():
        fail(errors, "missing .claude-plugin/marketplace.json")
        return

    try:
        marketplace = json.loads(marketplace_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(errors, f"invalid marketplace JSON: {exc}")
        return

    if not marketplace.get("name"):
        fail(errors, "marketplace name is required")
    plugins = marketplace.get("plugins")
    if not isinstance(plugins, list) or not plugins:
        fail(errors, "marketplace plugins must be a non-empty list")
        return

    names = {entry.get("name") for entry in plugins if isinstance(entry, dict)}
    if "carbon-design-system" not in names:
        fail(errors, "marketplace must publish carbon-design-system plugin")


def validate_skills(repo: Path, errors: list[str]) -> None:
    skills_dir = repo / "skills"
    if not skills_dir.exists():
        fail(errors, "missing skills directory")
        return

    actual = {path.name for path in skills_dir.iterdir() if path.is_dir()}
    if actual != EXPECTED_SKILLS:
        fail(errors, f"skill set mismatch: expected {sorted(EXPECTED_SKILLS)}, got {sorted(actual)}")

    for skill_name in sorted(actual):
        skill_dir = skills_dir / skill_name
        skill_md = skill_dir / "SKILL.md"
        if not skill_md.exists():
            fail(errors, f"{skill_name}: missing SKILL.md")
            continue

        try:
            frontmatter = read_frontmatter(skill_md)
        except ValueError as exc:
            fail(errors, f"{skill_name}: {exc}")
            continue

        if frontmatter.get("name") != skill_name:
            fail(errors, f"{skill_name}: frontmatter name mismatch")
        description = frontmatter.get("description", "")
        if len(description) < 80:
            fail(errors, f"{skill_name}: description should be specific enough to trigger reliably")

        if not (skill_dir / "agents" / "openai.yaml").exists():
            fail(errors, f"{skill_name}: missing agents/openai.yaml")
        source_index = skill_dir / "references" / "source-index.md"
        if not source_index.exists():
            fail(errors, f"{skill_name}: missing references/source-index.md")
        else:
            source_index_text = source_index.read_text(encoding="utf-8")
            if ".cache/carbon-website" in source_index_text:
                fail(errors, f"{skill_name}: source index must not require the local cache")
            if "references/" not in source_index_text:
                fail(errors, f"{skill_name}: source index must point to copied references")
            if "references/official/" in source_index_text:
                fail(errors, f"{skill_name}: source index must not use source-based official paths")

        if (skill_dir / "references" / "official").exists():
            fail(errors, f"{skill_name}: stale references/official directory")
        references_dir = skill_dir / "references"
        if not references_dir.exists():
            fail(errors, f"{skill_name}: missing references directory")
        elif not any(
            path.is_file() and path.suffix in REFERENCE_SUFFIXES
            for path in references_dir.rglob("*")
            if path.name != "source-index.md"
        ):
            fail(errors, f"{skill_name}: references directory has no reference files")


def validate_trigger_fixtures(repo: Path, errors: list[str]) -> None:
    prompts_dir = repo / "tests" / "skill-triggering" / "prompts"
    if not prompts_dir.exists():
        fail(errors, "missing tests/skill-triggering/prompts")
        return

    fixtures = {path.stem for path in prompts_dir.glob("*.txt")}
    if fixtures != EXPECTED_SKILLS:
        fail(errors, f"trigger fixture mismatch: expected {sorted(EXPECTED_SKILLS)}, got {sorted(fixtures)}")

    for skill_name in sorted(EXPECTED_SKILLS):
        prompt_path = prompts_dir / f"{skill_name}.txt"
        if not prompt_path.exists():
            continue
        prompt = prompt_path.read_text(encoding="utf-8").strip()
        if len(prompt) < 80:
            fail(errors, f"{skill_name}: trigger prompt is too short to be representative")
        if skill_name.replace("carbon-", "") not in prompt.lower() and "carbon" not in prompt.lower():
            fail(errors, f"{skill_name}: trigger prompt should mention Carbon context")


def iter_text_files(repo: Path) -> list[Path]:
    ignored_parts = {".cache", ".git", "__pycache__", "node_modules"}
    text_suffixes = {
        ".json",
        ".md",
        ".py",
        ".sh",
        ".txt",
        ".yaml",
        ".yml",
    }
    return [
        path
        for path in repo.rglob("*")
        if path.is_file()
        and not ignored_parts.intersection(path.parts)
        and "/references/" not in f"/{path.as_posix()}"
        and path.name != "source-index.md"
        and path.suffix in text_suffixes
    ]


def validate_forbidden_text(repo: Path, errors: list[str]) -> None:
    for path in iter_text_files(repo):
        rel = path.relative_to(repo)
        if rel == Path("scripts/validate-skill-pack.py"):
            continue
        text = path.read_text(encoding="utf-8")
        for label, pattern in FORBIDDEN_PATTERNS.items():
            for match in pattern.finditer(text):
                line = text.count("\n", 0, match.start()) + 1
                fail(errors, f"{rel}:{line}: forbidden {label}: {match.group(0)}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", default=".", help="Repository root to validate")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    errors: list[str] = []

    validate_plugin_manifest(repo, errors)
    validate_claude_plugin_manifest(repo, errors)
    validate_marketplace_manifest(repo, errors)
    validate_skills(repo, errors)
    validate_trigger_fixtures(repo, errors)
    validate_forbidden_text(repo, errors)

    if errors:
        print("Skill pack validation failed:")
        for error in errors:
            print(f"  - {error}")
        return 1

    print("Skill pack validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
