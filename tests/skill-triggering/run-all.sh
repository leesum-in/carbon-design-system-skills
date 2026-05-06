#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROMPTS_DIR="$SCRIPT_DIR/prompts"

for prompt in "$PROMPTS_DIR"/*.txt; do
  skill_name="$(basename "$prompt" .txt)"
  "$SCRIPT_DIR/run-test.sh" "$skill_name" "$prompt"
done
