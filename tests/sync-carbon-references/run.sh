#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

SOURCE_DIR="$TMP_DIR/carbon-website"
TARGET_DIR="$TMP_DIR/official"
ROUTED_REPO="$TMP_DIR/routed-repo"
CLONE_REPO="$TMP_DIR/clone-repo"
WEBSITE_REMOTE="$TMP_DIR/carbon-website-remote"
CARBON_REMOTE="$TMP_DIR/carbon-remote"

test -f "$REPO_ROOT/scripts/sync-carbon-references.ts"

SKILLS=(
  carbon-colors
  carbon-elements
  carbon-foundations
  carbon-grid
  carbon-icons
  carbon-layout
  carbon-motion
  carbon-patterns
  carbon-pictograms
  carbon-react
  carbon-styles
  carbon-themes
  carbon-type
  carbon-web-components
)

PACKAGE_DIRS=(
  colors
  elements
  grid
  icons
  layout
  motion
  pictograms
  react
  styles
  themes
  type
  web-components
)

mkdir -p "$SOURCE_DIR/src/pages/components/button" \
  "$SOURCE_DIR/src/pages/components/menu-buttons" \
  "$SOURCE_DIR/src/pages/all-about-carbon" \
  "$SOURCE_DIR/src/pages/developing/web-components-tutorial" \
  "$SOURCE_DIR/src/pages/elements/color" \
  "$SOURCE_DIR/src/pages/elements/2x-grid" \
  "$SOURCE_DIR/src/pages/elements/icons" \
  "$SOURCE_DIR/src/pages/elements/motion" \
  "$SOURCE_DIR/src/pages/elements/pictograms" \
  "$SOURCE_DIR/src/pages/elements/spacing" \
  "$SOURCE_DIR/src/pages/elements/themes" \
  "$SOURCE_DIR/src/pages/elements/typography" \
  "$SOURCE_DIR/src/pages/patterns/forms" \
  "$SOURCE_DIR/src/pages/components/tile"
mkdir -p "$SOURCE_DIR/src/data"
for skill in "${SKILLS[@]}"; do
  mkdir -p "$ROUTED_REPO/skills/$skill/references"
  mkdir -p "$CLONE_REPO/skills/$skill/references"
done

cat > "$SOURCE_DIR/src/pages/components/button/usage.mdx" <<'MDX'
# Button usage

Use Button for actions.
MDX

cat > "$SOURCE_DIR/src/pages/components/menu-buttons/usage.mdx" <<'MDX'
# Menu buttons usage

Use menu buttons for actions with multiple options.
MDX

cat > "$SOURCE_DIR/src/pages/components/menu-buttons/accessibility.mdx" <<'MDX'
# Menu buttons accessibility

Label menu button triggers clearly.
MDX

cat > "$SOURCE_DIR/src/pages/components/menu-buttons/style.mdx" <<'MDX'
# Menu buttons style

Use consistent menu button sizing.
MDX

cat > "$SOURCE_DIR/src/pages/components/menu-buttons/code.mdx" <<'MDX'
# Menu buttons code

Use MenuButton from @carbon/react.
MDX

cat > "$SOURCE_DIR/src/pages/all-about-carbon/what-is-carbon.mdx" <<'MDX'
# What is Carbon

This overview is routed into Carbon Foundations.
MDX

cat > "$SOURCE_DIR/src/pages/elements/color/overview.mdx" <<'MDX'
# Color overview

Use Carbon color tokens.
MDX

cat > "$SOURCE_DIR/src/pages/elements/2x-grid/overview.mdx" <<'MDX'
# Grid overview

Use the Carbon 2x grid.
MDX

cat > "$SOURCE_DIR/src/pages/elements/icons/usage.mdx" <<'MDX'
# Icon usage

Use icons to support actions.
MDX

cat > "$SOURCE_DIR/src/pages/elements/motion/overview.mdx" <<'MDX'
# Motion overview

Use productive and expressive motion.
MDX

cat > "$SOURCE_DIR/src/pages/elements/pictograms/usage.mdx" <<'MDX'
# Pictogram usage

Use pictograms to support visual storytelling.
MDX

cat > "$SOURCE_DIR/src/pages/elements/spacing/overview.mdx" <<'MDX'
# Spacing overview

Use the Carbon spacing scale.
MDX

cat > "$SOURCE_DIR/src/pages/index.mdx" <<'MDX'
# Carbon home

This root page is not routed into Carbon Foundations.
MDX

cat > "$SOURCE_DIR/src/pages/elements/themes/overview.mdx" <<'MDX'
# Themes overview

Use Carbon React themes for application theming.
MDX

cat > "$SOURCE_DIR/src/pages/elements/typography/overview.mdx" <<'MDX'
# Typography overview

Use IBM Plex type tokens.
MDX

cat > "$SOURCE_DIR/src/pages/developing/web-components-tutorial/overview.mdx" <<'MDX'
# Web Components tutorial

Use Carbon Web Components for framework-neutral components.
MDX

cat > "$SOURCE_DIR/src/pages/patterns/forms/index.mdx" <<'MDX'
# Forms

Use validation messages consistently.
MDX

cat > "$SOURCE_DIR/src/pages/patterns/overview.mdx" <<'MDX'
# Patterns overview

Use Carbon patterns for common product workflows.
MDX

cat > "$SOURCE_DIR/src/pages/components/tile/example.md" <<'MD'
# Not included
MD

cat > "$SOURCE_DIR/src/data/not-a-page.mdx" <<'MDX'
# Not included
MDX

bun "$REPO_ROOT/scripts/sync-carbon-references.ts" \
  --repo "$REPO_ROOT" \
  --source-dir "$SOURCE_DIR" \
  --target-dir "$TARGET_DIR"

test -f "$TARGET_DIR/components/button/usage.mdx"
test -f "$TARGET_DIR/patterns/forms/index.mdx"
test ! -e "$TARGET_DIR/components/tile/example.md"
test ! -e "$TARGET_DIR/src/data/not-a-page.mdx"
test -f "$TARGET_DIR/source-index.md"

grep -F "components/button/usage.mdx" "$TARGET_DIR/source-index.md" >/dev/null
grep -F "patterns/overview.mdx" "$TARGET_DIR/source-index.md" >/dev/null
grep -F "patterns/forms/index.mdx" "$TARGET_DIR/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages" "$TARGET_DIR/source-index.md" >/dev/null

git init --quiet "$CARBON_REMOTE"
for package_dir in "${PACKAGE_DIRS[@]}"; do
  mkdir -p "$CARBON_REMOTE/packages/$package_dir"
  cat > "$CARBON_REMOTE/packages/$package_dir/README.md" <<MD
# @carbon/$package_dir
MD
  cat > "$CARBON_REMOTE/packages/$package_dir/package.json" <<JSON
{
  "name": "@carbon/$package_dir"
}
JSON
done
mkdir -p "$CARBON_REMOTE/packages/react/src/components/Button/docs" \
  "$CARBON_REMOTE/packages/react/src/components/MenuButton" \
  "$CARBON_REMOTE/packages/styles/docs" \
  "$CARBON_REMOTE/packages/styles/scss/components/button" \
  "$CARBON_REMOTE/packages/web-components/src/components/button"
cat > "$CARBON_REMOTE/packages/react/src/components/Button/Button.mdx" <<'MDX'
# Button

## Component API
MDX
cat > "$CARBON_REMOTE/packages/react/src/components/Button/docs/overview.mdx" <<'MDX'
# Button docs overview

This duplicates component guidance and should not be synced into specs.
MDX
cat > "$CARBON_REMOTE/packages/react/src/components/MenuButton/MenuButton.mdx" <<'MDX'
# MenuButton

## Component API
MDX
cat > "$CARBON_REMOTE/packages/web-components/src/components/button/button.mdx" <<'MDX'
# Button

## Component API
MDX
cat > "$CARBON_REMOTE/packages/styles/docs/sass.md" <<'MD'
# Sass

Use Sass modules from @carbon/styles.
MD
cat > "$CARBON_REMOTE/packages/styles/scss/components/button/_index.scss" <<'SCSS'
@forward 'button';
SCSS
git -C "$CARBON_REMOTE" add packages
git -C "$CARBON_REMOTE" \
  -c user.email=test@example.com \
  -c user.name="Test User" \
  commit --quiet -m "Add carbon package docs fixture"
git -C "$CARBON_REMOTE" branch -M main

bun "$REPO_ROOT/scripts/sync-carbon-references.ts" \
  --repo "$ROUTED_REPO" \
  --source-dir "$SOURCE_DIR" \
  --carbon-remote "$CARBON_REMOTE" \
  --carbon-cache-dir ".cache/carbon"

test -f "$ROUTED_REPO/skills/carbon-react/references/button/guidelines/usage.mdx"
test -f "$ROUTED_REPO/skills/carbon-react/references/button/specs/Button.mdx"
test -f "$ROUTED_REPO/skills/carbon-react/references/menu-buttons/guidelines/usage.mdx"
test -f "$ROUTED_REPO/skills/carbon-react/references/menu-button/specs/MenuButton.mdx"
test -f "$ROUTED_REPO/skills/carbon-styles/references/styles/specs/docs/sass.md"
test -f "$ROUTED_REPO/skills/carbon-patterns/references/forms/guidelines/index.mdx"
test -f "$ROUTED_REPO/skills/carbon-patterns/references/overview/guidelines/overview.mdx"
test ! -e "$ROUTED_REPO/skills/carbon-patterns/references/overview.mdx/guidelines/overview.mdx"
test -f "$ROUTED_REPO/skills/carbon-colors/references/color/guidelines/overview.mdx"
test -f "$ROUTED_REPO/skills/carbon-grid/references/2x-grid/guidelines/overview.mdx"
test -f "$ROUTED_REPO/skills/carbon-icons/references/icons/guidelines/usage.mdx"
test -f "$ROUTED_REPO/skills/carbon-motion/references/motion/guidelines/overview.mdx"
test -f "$ROUTED_REPO/skills/carbon-pictograms/references/pictograms/guidelines/usage.mdx"
test -f "$ROUTED_REPO/skills/carbon-layout/references/spacing/guidelines/overview.mdx"
test -f "$ROUTED_REPO/skills/carbon-themes/references/themes/guidelines/overview.mdx"
test -f "$ROUTED_REPO/skills/carbon-type/references/typography/guidelines/overview.mdx"
test -f "$ROUTED_REPO/skills/carbon-web-components/references/tutorial/guidelines/overview.mdx"
test -f "$ROUTED_REPO/skills/carbon-foundations/references/carbon/guidelines/what-is-carbon.mdx"
test ! -e "$ROUTED_REPO/skills/carbon-foundations/references/color/guidelines/overview.mdx"
test ! -e "$ROUTED_REPO/skills/carbon-foundations/references/themes/guidelines/overview.mdx"
test ! -e "$ROUTED_REPO/skills/carbon-foundations/references/pictograms/guidelines/usage.mdx"
test ! -e "$ROUTED_REPO/skills/carbon-foundations/references/index/guidelines/index.mdx"

grep -F "## Search Workflow" "$ROUTED_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "references/button/guidelines/usage.mdx" "$ROUTED_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "references/button/specs/Button.mdx" "$ROUTED_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "references/styles/specs/docs/sass.md" "$ROUTED_REPO/skills/carbon-styles/references/source-index.md" >/dev/null
grep -F '| MenuButton | `references/menu-button/specs/MenuButton.mdx` | `references/menu-buttons/guidelines/usage.mdx` | `references/menu-buttons/guidelines/accessibility.mdx` | `references/menu-buttons/guidelines/style.mdx` | `references/menu-buttons/guidelines/code.mdx` |' "$ROUTED_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/components/button/usage.mdx" "$ROUTED_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "references/button/guidelines" "$ROUTED_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "usage.mdx" "$ROUTED_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "rg -n" "$ROUTED_REPO/skills/carbon-react/references/source-index.md" >/dev/null
! grep -F ".cache/carbon-website" "$ROUTED_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/patterns/forms/index.mdx" "$ROUTED_REPO/skills/carbon-patterns/references/source-index.md" >/dev/null
grep -F "references/overview/guidelines/overview.mdx" "$ROUTED_REPO/skills/carbon-patterns/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/patterns/overview.mdx" "$ROUTED_REPO/skills/carbon-patterns/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/elements/color/overview.mdx" "$ROUTED_REPO/skills/carbon-colors/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/elements/2x-grid/overview.mdx" "$ROUTED_REPO/skills/carbon-grid/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/elements/icons/usage.mdx" "$ROUTED_REPO/skills/carbon-icons/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/elements/motion/overview.mdx" "$ROUTED_REPO/skills/carbon-motion/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/elements/pictograms/usage.mdx" "$ROUTED_REPO/skills/carbon-pictograms/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/elements/spacing/overview.mdx" "$ROUTED_REPO/skills/carbon-layout/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/elements/themes/overview.mdx" "$ROUTED_REPO/skills/carbon-themes/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/elements/typography/overview.mdx" "$ROUTED_REPO/skills/carbon-type/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/developing/web-components-tutorial/overview.mdx" "$ROUTED_REPO/skills/carbon-web-components/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon-website/src/pages/all-about-carbon/what-is-carbon.mdx" "$ROUTED_REPO/skills/carbon-foundations/references/source-index.md" >/dev/null
! grep -F "src/pages/index.mdx" "$ROUTED_REPO/skills/carbon-foundations/references/source-index.md" >/dev/null

git init --quiet "$WEBSITE_REMOTE"
mkdir -p "$WEBSITE_REMOTE/src/pages/components/button"
cp "$SOURCE_DIR/src/pages/components/button/usage.mdx" \
  "$WEBSITE_REMOTE/src/pages/components/button/usage.mdx"
git -C "$WEBSITE_REMOTE" add src/pages/components/button/usage.mdx
git -C "$WEBSITE_REMOTE" \
  -c user.email=test@example.com \
  -c user.name="Test User" \
  commit --quiet -m "Add website docs fixture"
git -C "$WEBSITE_REMOTE" branch -M main

bun "$REPO_ROOT/scripts/sync-carbon-references.ts" \
  --repo "$CLONE_REPO" \
  --remote "$WEBSITE_REMOTE" \
  --cache-dir ".cache/carbon-website" \
  --carbon-remote "$CARBON_REMOTE" \
  --carbon-cache-dir ".cache/carbon"

test -d "$CLONE_REPO/.cache/carbon-website/.git"
test -d "$CLONE_REPO/.cache/carbon/.git"
test -f "$CLONE_REPO/skills/carbon-react/references/package/specs/README.md"
test ! -e "$CLONE_REPO/skills/carbon-react/references/package/specs/package.json"
test -f "$CLONE_REPO/skills/carbon-react/references/button/specs/Button.mdx"
test ! -e "$CLONE_REPO/skills/carbon-react/references/button/specs/docs/overview.mdx"
test -f "$CLONE_REPO/skills/carbon-react/references/button/guidelines/usage.mdx"
test -f "$CLONE_REPO/skills/carbon-styles/references/styles/specs/README.md"
test -f "$CLONE_REPO/skills/carbon-styles/references/styles/specs/docs/sass.md"
test -f "$CLONE_REPO/skills/carbon-colors/references/color/specs/README.md"
test -f "$CLONE_REPO/skills/carbon-web-components/references/button/specs/button.mdx"
grep -F "carbon-design-system/carbon/packages/react/README.md" "$CLONE_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon/packages/react/src/components/Button/Button.mdx" "$CLONE_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "## Document Selection Guide" "$CLONE_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "Use package component API docs first for props, slots, events, exports, and component-specific examples." "$CLONE_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "## React Component Lookup" "$CLONE_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "| Button |" "$CLONE_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "references/button/specs/Button.mdx" "$CLONE_REPO/skills/carbon-react/references/source-index.md" >/dev/null
! grep -F "references/button/specs/docs/overview.mdx" "$CLONE_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "references/button/guidelines/usage.mdx" "$CLONE_REPO/skills/carbon-react/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon/packages/styles/README.md" "$CLONE_REPO/skills/carbon-styles/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon/packages/styles/docs/sass.md" "$CLONE_REPO/skills/carbon-styles/references/source-index.md" >/dev/null
grep -F "carbon-design-system/carbon/packages/web-components/src/components/button/button.mdx" "$CLONE_REPO/skills/carbon-web-components/references/source-index.md" >/dev/null
grep -F "## Web Components Component Lookup" "$CLONE_REPO/skills/carbon-web-components/references/source-index.md" >/dev/null
grep -F "| button |" "$CLONE_REPO/skills/carbon-web-components/references/source-index.md" >/dev/null
grep -F "references/button/specs/button.mdx" "$CLONE_REPO/skills/carbon-web-components/references/source-index.md" >/dev/null

echo "Carbon references sync test passed."
