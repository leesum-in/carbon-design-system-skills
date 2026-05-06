#!/usr/bin/env bash
set -euo pipefail

SKILL_NAME="${1:-}"
PROMPT_FILE="${2:-}"

if [[ -z "$SKILL_NAME" || -z "$PROMPT_FILE" ]]; then
  echo "Usage: $0 <skill-name> <prompt-file>" >&2
  exit 2
fi

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Prompt file does not exist: $PROMPT_FILE" >&2
  exit 2
fi

PROMPT="$(cat "$PROMPT_FILE")"

if [[ ${#PROMPT} -lt 80 ]]; then
  echo "FAIL: prompt is too short to be representative: $PROMPT_FILE" >&2
  exit 1
fi

if ! grep -Eiq 'carbon|@carbon|Carbon' "$PROMPT_FILE"; then
  echo "FAIL: prompt does not include Carbon context: $PROMPT_FILE" >&2
  exit 1
fi

echo "PASS: $SKILL_NAME trigger fixture is present and representative"
