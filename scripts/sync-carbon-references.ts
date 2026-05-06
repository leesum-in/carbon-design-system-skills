#!/usr/bin/env bun

import { copyFile, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";

const defaultRemote = "https://github.com/carbon-design-system/carbon-website.git";
const defaultCarbonRemote = "https://github.com/carbon-design-system/carbon.git";
const defaultSource = "carbon-design-system/carbon-website/src/pages";

interface Args {
  cacheDir: string;
  carbonCacheDir: string;
  carbonRef: string;
  carbonRemote: string;
  ref: string;
  remote: string;
  repo: string;
  sourceDir?: string;
  targetDir?: string;
}

type SkillName =
  | "carbon-colors"
  | "carbon-elements"
  | "carbon-foundations"
  | "carbon-grid"
  | "carbon-icons"
  | "carbon-layout"
  | "carbon-motion"
  | "carbon-pictograms"
  | "carbon-patterns"
  | "carbon-react"
  | "carbon-styles"
  | "carbon-themes"
  | "carbon-type"
  | "carbon-web-components";

interface ReferenceFile {
  canonicalPath: string;
  relPath: string;
  sourceRelPath: string;
  sourcePath: string;
}

interface WebsiteMapping {
  skill: SkillName;
  prefixes: readonly string[];
}

interface PackageMapping {
  packageDir: string;
  skill: SkillName;
}

const skillTitles: Record<SkillName, string> = {
  "carbon-colors": "Carbon Colors",
  "carbon-elements": "Carbon Elements",
  "carbon-foundations": "Carbon Foundations",
  "carbon-grid": "Carbon Grid",
  "carbon-icons": "Carbon Icons",
  "carbon-layout": "Carbon Layout",
  "carbon-motion": "Carbon Motion",
  "carbon-pictograms": "Carbon Pictograms",
  "carbon-patterns": "Carbon Patterns",
  "carbon-react": "Carbon React",
  "carbon-styles": "Carbon Styles",
  "carbon-themes": "Carbon Themes",
  "carbon-type": "Carbon Type",
  "carbon-web-components": "Carbon Web Components",
};

const websiteMappings: readonly WebsiteMapping[] = [
  { skill: "carbon-react", prefixes: ["components/"] },
  {
    skill: "carbon-web-components",
    prefixes: ["developing/web-components-tutorial/"],
  },
  { skill: "carbon-patterns", prefixes: ["patterns/"] },
  { skill: "carbon-colors", prefixes: ["elements/color/"] },
  { skill: "carbon-grid", prefixes: ["elements/2x-grid/"] },
  {
    skill: "carbon-icons",
    prefixes: ["elements/icons/", "icons/"],
  },
  { skill: "carbon-layout", prefixes: ["elements/spacing/"] },
  { skill: "carbon-motion", prefixes: ["elements/motion/"] },
  { skill: "carbon-pictograms", prefixes: ["elements/pictograms/"] },
  { skill: "carbon-themes", prefixes: ["elements/themes/"] },
  { skill: "carbon-type", prefixes: ["elements/typography/"] },
  {
    skill: "carbon-foundations",
    prefixes: [
      "all-about-carbon/the-carbon-ecosystem.mdx",
      "all-about-carbon/what-is-carbon.mdx",
      "designing/get-started.mdx",
      "developing/get-started.mdx",
      "guidelines/accessibility/",
      "guidelines/content/",
    ],
  },
];

const canonicalSourceRoot = "carbon-design-system/carbon-website/src/pages";
const canonicalCarbonPackageRoot = "carbon-design-system/carbon/packages";
const copiedReferenceRoot = "references";

const allSkills: readonly SkillName[] = [
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
];

const packageMappings: readonly PackageMapping[] = [
  {
    packageDir: "colors",
    skill: "carbon-colors",
  },
  {
    packageDir: "elements",
    skill: "carbon-elements",
  },
  {
    packageDir: "grid",
    skill: "carbon-grid",
  },
  {
    packageDir: "icons",
    skill: "carbon-icons",
  },
  {
    packageDir: "layout",
    skill: "carbon-layout",
  },
  {
    packageDir: "motion",
    skill: "carbon-motion",
  },
  {
    packageDir: "pictograms",
    skill: "carbon-pictograms",
  },
  {
    packageDir: "react",
    skill: "carbon-react",
  },
  {
    packageDir: "styles",
    skill: "carbon-styles",
  },
  {
    packageDir: "themes",
    skill: "carbon-themes",
  },
  {
    packageDir: "type",
    skill: "carbon-type",
  },
  {
    packageDir: "web-components",
    skill: "carbon-web-components",
  },
];

const packageReferenceFiles = ["README.md"] as const;
const packageReferenceDirectories: Record<string, readonly string[]> = {
  colors: ["docs"],
  elements: ["docs"],
  grid: ["docs"],
  icons: [],
  layout: ["docs"],
  motion: ["docs"],
  pictograms: ["docs"],
  react: ["docs", "src/components", "src/internal"],
  styles: ["docs"],
  themes: ["docs"],
  type: ["docs"],
  "web-components": ["docs", "src/components"],
};
const packageReferenceExtensions = new Set([".md", ".mdx"]);
const packageTopicByDir: Record<string, string> = {
  colors: "color",
  elements: "elements",
  grid: "2x-grid",
  icons: "icons",
  layout: "spacing",
  motion: "motion",
  pictograms: "pictograms",
  styles: "styles",
  themes: "themes",
  type: "typography",
};

const reactComponentWebsiteSlugAliases: Record<string, readonly string[]> = {
  ComboButton: ["menu-buttons"],
  MenuButton: ["menu-buttons"],
};

function parseArgs(argv: readonly string[]): Args {
  const args: Args = {
    cacheDir: ".cache/carbon-website",
    carbonCacheDir: ".cache/carbon",
    carbonRef: "main",
    carbonRemote: defaultCarbonRemote,
    ref: "main",
    remote: defaultRemote,
    repo: ".",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];

    if (flag === "--help" || flag === "-h") {
      printHelp();
      process.exit(0);
    }

    if (value === undefined || value.startsWith("--")) {
      throw new Error(`missing value for ${flag}`);
    }

    switch (flag) {
      case "--cache-dir":
        args.cacheDir = value;
        break;
      case "--carbon-cache-dir":
        args.carbonCacheDir = value;
        break;
      case "--carbon-ref":
        args.carbonRef = value;
        break;
      case "--carbon-remote":
        args.carbonRemote = value;
        break;
      case "--ref":
        args.ref = value;
        break;
      case "--remote":
        args.remote = value;
        break;
      case "--repo":
        args.repo = value;
        break;
      case "--source-dir":
        args.sourceDir = value;
        break;
      case "--target-dir":
        args.targetDir = value;
        break;
      default:
        throw new Error(`unknown argument: ${flag}`);
    }

    index += 1;
  }

  return args;
}

function printHelp(): void {
  console.log(`Sync official Carbon source references into skill references.

Usage:
  bun scripts/sync-carbon-references.ts [options]

Options:
  --repo <path>        Skill pack repository root. Default: .
  --cache-dir <path>   Gitignored carbon-website clone cache. Default: .cache/carbon-website
  --carbon-cache-dir <path>
                       Gitignored carbon monorepo clone cache. Default: .cache/carbon
  --source-dir <path>  Existing carbon-website checkout or src/pages fixture.
  --target-dir <path>  Copy all pages into this directory instead of routing by skill.
  --remote <url>       Carbon website git remote. Default: ${defaultRemote}
  --ref <ref>          Branch, tag, or commit to sync. Default: main
  --carbon-remote <url>
                       Carbon monorepo git remote. Default: ${defaultCarbonRemote}
  --carbon-ref <ref>   Carbon monorepo branch, tag, or commit to cache. Default: main
`);
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

async function runGit(args: readonly string[], cwd?: string): Promise<void> {
  const proc = Bun.spawn(["git", ...args], {
    cwd,
    stderr: "pipe",
    stdout: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (exitCode !== 0) {
    throw new Error(
      `git ${args.join(" ")} failed with exit ${exitCode}\n${stdout}${stderr}`,
    );
  }
}

async function ensureCarbonWebsiteClone(args: Args): Promise<string> {
  return ensureGitClone({
    cacheDir: args.cacheDir,
    ref: args.ref,
    remote: args.remote,
    repo: args.repo,
  });
}

async function ensureCarbonMonorepoClone(args: Args): Promise<string> {
  return ensureGitClone({
    cacheDir: args.carbonCacheDir,
    ref: args.carbonRef,
    remote: args.carbonRemote,
    repo: args.repo,
  });
}

async function ensureGitClone(options: {
  cacheDir: string;
  ref: string;
  remote: string;
  repo: string;
}): Promise<string> {
  const repo = resolve(options.repo);
  const cacheDir = resolve(repo, options.cacheDir);
  const gitDir = join(cacheDir, ".git");

  if (!(await pathExists(gitDir))) {
    await mkdir(resolve(cacheDir, ".."), { recursive: true });
    await runGit(["clone", "--filter=blob:none", options.remote, cacheDir]);
  }

  await runGit(["remote", "set-url", "origin", options.remote], cacheDir);
  await runGit(["fetch", "--depth=1", "origin", options.ref], cacheDir);
  await runGit(["checkout", "--detach", "FETCH_HEAD"], cacheDir);

  return cacheDir;
}

async function findPagesDir(sourceDir: string): Promise<string> {
  const srcPages = join(sourceDir, "src", "pages");
  if (await pathExists(srcPages)) {
    return srcPages;
  }

  if (sourceDir.endsWith(`${sep}pages`) && (await pathExists(sourceDir))) {
    return sourceDir;
  }

  throw new Error(`could not find src/pages under ${sourceDir}`);
}

async function collectMdxPages(pagesDir: string): Promise<string[]> {
  const pages: string[] = [];

  async function walk(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
      } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
        pages.push(entryPath);
      }
    }
  }

  await walk(pagesDir);
  return pages.sort((left, right) => left.localeCompare(right));
}

async function resetDir(path: string): Promise<void> {
  await rm(path, { force: true, recursive: true });
  await mkdir(path, { recursive: true });
}

async function copyPages(
  pages: readonly string[],
  pagesDir: string,
  targetDir: string,
  ref: string,
): Promise<string[]> {
  await resetDir(targetDir);

  const copied: string[] = [];
  for (const page of pages) {
    const relPath = toPosix(relative(pagesDir, page));
    const destination = join(targetDir, relPath);
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(page, destination);
    copied.push(relPath);
  }

  await writeIndex(targetDir, copied, ref);
  return copied;
}

async function writeSkillReferences(
  repo: string,
  pages: readonly string[],
  pagesDir: string,
  carbonRepo: string | undefined,
  ref: string,
  carbonRef: string,
): Promise<Record<SkillName, ReferenceFile[]>> {
  const routed = Object.fromEntries(
    allSkills.map((skill) => [skill, [] as ReferenceFile[]]),
  ) as Record<SkillName, ReferenceFile[]>;

  for (const page of pages) {
    const relPath = toPosix(relative(pagesDir, page));
    const skill = routeSkill(relPath);
    if (skill === undefined) {
      continue;
    }

    routed[skill].push({
      canonicalPath: `${canonicalSourceRoot}/${relPath}`,
      relPath: toWebsiteReferencePath(skill, relPath),
      sourceRelPath: relPath,
      sourcePath: page,
    });
  }

  if (carbonRepo !== undefined) {
    const packageReferences = await collectPackageReferences(carbonRepo);
    for (const [skill, references] of Object.entries(packageReferences) as [
      SkillName,
      ReferenceFile[],
    ][]) {
      routed[skill].push(...references);
    }
  }

  const copiedBySkill = Object.fromEntries(
    allSkills.map((skill) => [skill, [] as ReferenceFile[]]),
  ) as Record<SkillName, ReferenceFile[]>;

  for (const skill of allSkills) {
    const routedReferences = routed[skill].sort((left, right) =>
      left.relPath.localeCompare(right.relPath),
    );
    copiedBySkill[skill] = routedReferences;

    const referencesDir = join(repo, "skills", skill, "references");
    await copySkillReferences(referencesDir, routedReferences);
    await writeSkillReferenceIndex(repo, skill, routedReferences, ref, carbonRef);
  }

  return copiedBySkill;
}

function routeSkill(relPath: string): SkillName | undefined {
  for (const mapping of websiteMappings) {
    if (mapping.prefixes.some((prefix) => relPath.startsWith(prefix))) {
      return mapping.skill;
    }
  }

  return undefined;
}

function toWebsiteReferencePath(skill: SkillName, sourceRelPath: string): string {
  const parts = sourceRelPath.split("/");
  const fileName = parts.at(-1);
  if (fileName === undefined) {
    throw new Error(`invalid website reference path: ${sourceRelPath}`);
  }

  if (skill === "carbon-react" && parts[0] === "components" && parts[1]) {
    return `${toKebabCase(parts[1])}/guidelines/${fileName}`;
  }

  if (
    skill === "carbon-web-components" &&
    sourceRelPath.startsWith("developing/web-components-tutorial/")
  ) {
    return `tutorial/guidelines/${fileName}`;
  }

  if (skill === "carbon-patterns") {
    const topic =
      parts[0] === "patterns" && parts[1] !== undefined
        ? stripMarkdownExtension(parts[1])
        : undefined;
    return `${topic ?? "overview"}/guidelines/${fileName}`;
  }

  if (sourceRelPath.startsWith("elements/") && parts[1]) {
    return `${parts[1]}/guidelines/${fileName}`;
  }

  if (skill === "carbon-foundations") {
    if (parts[0] === "all-about-carbon") {
      return `carbon/guidelines/${fileName}`;
    }
    if (parts[0] === "designing" || parts[0] === "developing") {
      return `${parts[0]}/guidelines/${fileName}`;
    }
    if (parts[0] === "guidelines" && parts[1]) {
      return `${parts[1]}/guidelines/${fileName}`;
    }
  }

  const topic = parts[0]?.replace(/\.(md|mdx)$/, "") ?? "reference";
  return `${topic}/guidelines/${fileName}`;
}

function stripMarkdownExtension(fileName: string): string {
  return fileName.replace(/\.(md|mdx)$/, "");
}

async function collectPackageReferences(
  carbonRepo: string,
): Promise<Record<SkillName, ReferenceFile[]>> {
  const bySkill = Object.fromEntries(
    allSkills.map((skill) => [skill, [] as ReferenceFile[]]),
  ) as Record<SkillName, ReferenceFile[]>;

  for (const mapping of packageMappings) {
    for (const file of packageReferenceFiles) {
      const sourcePath = join(carbonRepo, "packages", mapping.packageDir, file);
      if (!(await pathExists(sourcePath))) {
        continue;
      }

      const sourceRelPath = `packages/${mapping.packageDir}/${file}`;
      bySkill[mapping.skill].push({
        canonicalPath: `${canonicalCarbonPackageRoot}/${mapping.packageDir}/${file}`,
        relPath: toPackageReferencePath(mapping.packageDir, sourceRelPath),
        sourceRelPath,
        sourcePath,
      });
    }

    const directories = packageReferenceDirectories[mapping.packageDir] ?? [];
    for (const directory of directories) {
      const directoryPath = join(carbonRepo, "packages", mapping.packageDir, directory);
      if (!(await pathExists(directoryPath))) {
        continue;
      }

      const references = await collectPackageDirectoryReferences(
        carbonRepo,
        mapping.packageDir,
        directoryPath,
      );
      bySkill[mapping.skill].push(...references);
    }
  }

  return bySkill;
}

async function collectPackageDirectoryReferences(
  carbonRepo: string,
  packageDir: string,
  directoryPath: string,
): Promise<ReferenceFile[]> {
  const references: ReferenceFile[] = [];

  async function walk(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
        continue;
      }

      const extension = entry.name.slice(entry.name.lastIndexOf("."));
      if (!entry.isFile() || !packageReferenceExtensions.has(extension)) {
        continue;
      }

      const sourceRelPath = toPosix(relative(carbonRepo, entryPath));
      if (!shouldIncludePackageReference(packageDir, sourceRelPath)) {
        continue;
      }

      references.push({
        canonicalPath: `carbon-design-system/carbon/${sourceRelPath}`,
        relPath: toPackageReferencePath(packageDir, sourceRelPath),
        sourceRelPath,
        sourcePath: entryPath,
      });
    }
  }

  await walk(directoryPath);
  return references.sort((left, right) => left.relPath.localeCompare(right.relPath));
}

function shouldIncludePackageReference(
  packageDir: string,
  sourceRelPath: string,
): boolean {
  if (packageDir !== "react") {
    return true;
  }

  return !/^packages\/react\/src\/components\/[^/]+\/docs\/overview\.mdx$/.test(
    sourceRelPath,
  );
}

function toPackageReferencePath(packageDir: string, sourceRelPath: string): string {
  const packagePrefix = `packages/${packageDir}/`;
  if (!sourceRelPath.startsWith(packagePrefix)) {
    throw new Error(`package reference ${sourceRelPath} is outside ${packagePrefix}`);
  }

  const childPath = sourceRelPath.slice(packagePrefix.length);
  if (packageDir === "react") {
    const componentMatch = /^src\/components\/([^/]+)\/(.+)$/.exec(childPath);
    if (componentMatch !== null) {
      const [, component, componentPath] = componentMatch;
      if (component !== undefined && componentPath !== undefined) {
        return `${toKebabCase(component)}/specs/${componentPath}`;
      }
    }

    if (childPath.startsWith("src/internal/")) {
      return `internal/specs/${childPath.slice("src/internal/".length)}`;
    }

    return `package/specs/${childPath}`;
  }

  if (packageDir === "web-components") {
    const componentMatch = /^src\/components\/([^/]+)\/(.+)$/.exec(childPath);
    if (componentMatch !== null) {
      const [, component, componentPath] = componentMatch;
      if (component !== undefined && componentPath !== undefined) {
        return `${component}/specs/${componentPath}`;
      }
    }

    return `package/specs/${childPath}`;
  }

  const topic = packageTopicByDir[packageDir] ?? packageDir;
  return `${topic}/specs/${childPath}`;
}

async function writeIndex(
  targetDir: string,
  copied: readonly string[],
  ref: string,
): Promise<void> {
  const generatedAt = new Date().toISOString();
  const lines = [
    "# Carbon Website MDX Source Index",
    "",
    "Generated by `scripts/sync-carbon-references.ts`.",
    `Source: \`${defaultSource}\`.`,
    `Ref: \`${ref}\`.`,
    `Generated at: \`${generatedAt}\`.`,
    "",
    `Indexed MDX files: ${copied.length}`,
    "",
    ...copied.map((path) => `- \`${path}\``),
    "",
  ];

  await writeFile(join(targetDir, "source-index.md"), lines.join("\n"), "utf8");
}

async function writeSkillReferenceIndex(
  repo: string,
  skill: SkillName,
  copied: readonly ReferenceFile[],
  ref: string,
  carbonRef: string,
): Promise<void> {
  const referencesDir = join(repo, "skills", skill, "references");
  await mkdir(referencesDir, { recursive: true });

  const lines = [
    `# ${skillTitles[skill]} Source Index`,
    "",
    "Generated by `scripts/sync-carbon-references.ts`.",
    "",
    "Reference files are organized by topic under",
    "`references/<topic>/{guidelines,specs}/` for this skill.",
    "The local Carbon website and package checkouts are only development sources",
    "used while regenerating these references.",
    "",
    `Canonical website source root: \`${canonicalSourceRoot}/\`.`,
    `Canonical package source root: \`${canonicalCarbonPackageRoot}/\`.`,
    `Reference root: \`${copiedReferenceRoot}/\`.`,
    `Website ref: \`${ref}\`.`,
    `Carbon package ref: \`${carbonRef}\`.`,
    "",
    "## Search Workflow",
    "",
    "1. Start with the document selection guide below before opening source files.",
    "2. Open only the minimum needed files from the relevant topic directory.",
    "   Use `guidelines/` for product guidance, behavior, style, accessibility,",
    "   and examples. Use `specs/` for package APIs, setup, and implementation",
    "   details.",
    "3. If the topic is not obvious, run",
    ...formatRgSearchLines(skill),
    "4. Cite or reference the exact canonical source path when applying source-backed",
    "   Carbon guidance.",
    "",
    "## Document Selection Guide",
    "",
    ...formatDocumentSelectionGuide(skill, copied),
    "",
    "## Source Boundaries",
    "",
    ...formatBoundaryLines(skill),
    "",
    `Indexed reference files: ${copied.length}`,
    "",
    "## Catalog",
    "",
    ...buildCatalogLines(copied),
    "",
  ];

  await writeFile(join(referencesDir, "source-index.md"), lines.join("\n"), "utf8");
}

async function copySkillReferences(
  referencesDir: string,
  references: readonly ReferenceFile[],
): Promise<void> {
  await resetDir(referencesDir);

  for (const reference of references) {
    const destination = join(referencesDir, reference.relPath);
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(reference.sourcePath, destination);
  }
}

function formatRgSearchLines(skill: SkillName): string[] {
  return searchRootsBySkill[skill].flatMap((root) => [
    `   \`rg -n "<query>" "${root}"\``,
    "   from the skill directory.",
  ]);
}

const searchRootsBySkill: Record<SkillName, readonly string[]> = {
  "carbon-colors": [`${copiedReferenceRoot}/color`],
  "carbon-elements": [`${copiedReferenceRoot}/elements`],
  "carbon-foundations": [
    `${copiedReferenceRoot}/carbon`,
    `${copiedReferenceRoot}/designing`,
    `${copiedReferenceRoot}/developing`,
    `${copiedReferenceRoot}/accessibility`,
    `${copiedReferenceRoot}/content`,
  ],
  "carbon-grid": [`${copiedReferenceRoot}/2x-grid`],
  "carbon-icons": [`${copiedReferenceRoot}/icons`],
  "carbon-layout": [`${copiedReferenceRoot}/spacing`],
  "carbon-motion": [`${copiedReferenceRoot}/motion`],
  "carbon-pictograms": [`${copiedReferenceRoot}/pictograms`],
  "carbon-patterns": [copiedReferenceRoot],
  "carbon-react": [copiedReferenceRoot],
  "carbon-styles": [`${copiedReferenceRoot}/styles`],
  "carbon-themes": [`${copiedReferenceRoot}/themes`],
  "carbon-type": [`${copiedReferenceRoot}/typography`],
  "carbon-web-components": [copiedReferenceRoot],
};

function formatBoundaryLines(skill: SkillName): string[] {
  if (skill === "carbon-foundations") {
    return [
      "Carbon Foundations indexes framework-neutral Carbon principles, ecosystem",
      "overview, accessibility guidelines, and content guidance. Package APIs,",
      "element implementation details, tutorials, migration pages, help pages, and",
      "community patterns are intentionally excluded.",
    ];
  }

  if (skill === "carbon-react") {
    return [
      "Carbon React indexes official component pages under `components/` and",
      "`@carbon/react` package sources.",
    ];
  }

  if (skill === "carbon-icons") {
    return [
      "Carbon Icons indexes official icon guidance under `elements/icons/` and",
      "`@carbon/icons` package sources.",
    ];
  }

  if (skill === "carbon-colors") {
    return [
      "Carbon Colors indexes official color guidance under `elements/color/` and",
      "`@carbon/colors` package sources.",
    ];
  }

  if (skill === "carbon-elements") {
    return ["Carbon Elements indexes `@carbon/elements` package sources."];
  }

  if (skill === "carbon-grid") {
    return [
      "Carbon Grid indexes official 2x grid guidance under `elements/2x-grid/`",
      "and `@carbon/grid` package sources.",
    ];
  }

  if (skill === "carbon-layout") {
    return [
      "Carbon Layout indexes official spacing guidance under `elements/spacing/`",
      "and `@carbon/layout` package sources.",
    ];
  }

  if (skill === "carbon-motion") {
    return [
      "Carbon Motion indexes official motion guidance under `elements/motion/`",
      "and `@carbon/motion` package sources.",
    ];
  }

  if (skill === "carbon-pictograms") {
    return [
      "Carbon Pictograms indexes official pictogram guidance under",
      "`elements/pictograms/` and `@carbon/pictograms` package sources.",
    ];
  }

  if (skill === "carbon-styles") {
    return ["Carbon Styles indexes `@carbon/styles` Sass package sources."];
  }

  if (skill === "carbon-themes") {
    return [
      "Carbon Themes indexes official theme guidance under `elements/themes/` and",
      "`@carbon/themes` package sources.",
    ];
  }

  if (skill === "carbon-type") {
    return [
      "Carbon Type indexes official typography guidance under `elements/typography/`",
      "and `@carbon/type` package sources.",
    ];
  }

  if (skill === "carbon-web-components") {
    return [
      "Carbon Web Components indexes Web Components tutorial guidance and",
      "`@carbon/web-components` package sources.",
    ];
  }

  return [
    "Carbon Patterns indexes official product UX pattern pages under `patterns/`.",
  ];
}

function formatDocumentSelectionGuide(
  skill: SkillName,
  copied: readonly ReferenceFile[],
): string[] {
  const commonLines = [
    "- Use `guidelines/usage.mdx` for when to use a component or element and how it should behave in product UI.",
    "- Use `guidelines/accessibility.mdx` for keyboard, screen reader, focus, labeling, and accessibility review tasks.",
    "- Use `guidelines/style.mdx` for visual anatomy, sizing, spacing, alignment, and state styling decisions.",
    "- Use `guidelines/code.mdx` for high-level implementation examples when package API docs are not specific enough.",
    "- Use `specs/README.md` for package entrypoints and installation notes.",
    "- Use `specs/docs/**` files for package-specific setup, Sass, migration, and implementation notes.",
  ];

  if (skill === "carbon-react") {
    return [
      "- Use package component API docs first for props, slots, events, exports, and component-specific examples.",
      "- Use website component docs after the API docs to check product behavior, accessibility, visual style, and usage guidance.",
      "- For component work, open the relevant row in the React Component Lookup, then load only the columns needed for the task.",
      "",
      ...commonLines,
      "",
      ...buildReactComponentLookupLines(copied),
    ];
  }

  if (skill === "carbon-web-components") {
    return [
      "- Use package component API docs first for attributes, slots, events, exports, and component-specific examples.",
      "- Use package `docs/**` for setup, styling, forms, feature flags, and Web Components integration guidance.",
      "- Use the website Web Components tutorial for project setup walkthroughs, not as the primary API reference.",
      "",
      ...commonLines,
      "",
      ...buildWebComponentsLookupLines(copied),
    ];
  }

  return commonLines;
}

function buildReactComponentLookupLines(copied: readonly ReferenceFile[]): string[] {
  const apiDocsByComponent = new Map<string, ReferenceFile[]>();
  const websiteDocsBySlug = new Map<string, Map<string, ReferenceFile>>();

  for (const reference of copied) {
    const componentMatch = /^packages\/react\/src\/components\/([^/]+)\/(.+)$/.exec(
      reference.sourceRelPath,
    );
    if (componentMatch !== null) {
      const [, component, childPath] = componentMatch;
      if (
        component !== undefined &&
        childPath !== undefined &&
        isPrimaryPackageComponentDoc(childPath)
      ) {
        const docs = apiDocsByComponent.get(component) ?? [];
        docs.push(reference);
        apiDocsByComponent.set(component, docs);
      }
      continue;
    }

    const websiteMatch =
      /^components\/([^/]+)\/(usage|code|accessibility|style)\.mdx$/.exec(
        reference.sourceRelPath,
      );
    if (websiteMatch !== null) {
      const [, slug, kind] = websiteMatch;
      if (slug !== undefined && kind !== undefined) {
        const docs = websiteDocsBySlug.get(slug) ?? new Map<string, ReferenceFile>();
        docs.set(kind, reference);
        websiteDocsBySlug.set(slug, docs);
      }
    }
  }

  if (apiDocsByComponent.size === 0) {
    return ["No React component API docs are currently synced for lookup."];
  }

  const lines = [
    "## React Component Lookup",
    "",
    "| Component | Package API docs | Usage | Accessibility | Style | Code |",
    "| --- | --- | --- | --- | --- | --- |",
  ];

  for (const component of [...apiDocsByComponent.keys()].sort((left, right) =>
    left.localeCompare(right),
  )) {
    const websiteDocs = getReactWebsiteDocs(component, websiteDocsBySlug);
    const cells = [
      component,
      formatReferenceCell(apiDocsByComponent.get(component) ?? []),
      formatReferenceCell(websiteDocs?.get("usage")),
      formatReferenceCell(websiteDocs?.get("accessibility")),
      formatReferenceCell(websiteDocs?.get("style")),
      formatReferenceCell(websiteDocs?.get("code")),
    ];
    lines.push(`| ${cells.join(" | ")} |`);
  }

  return lines;
}

function getReactWebsiteDocs(
  component: string,
  websiteDocsBySlug: ReadonlyMap<string, Map<string, ReferenceFile>>,
): Map<string, ReferenceFile> | undefined {
  const slugs = new Set([
    toKebabCase(component),
    ...(reactComponentWebsiteSlugAliases[component] ?? []),
  ]);

  for (const slug of slugs) {
    const docs = websiteDocsBySlug.get(slug);
    if (docs !== undefined) {
      return docs;
    }
  }

  return undefined;
}

function buildWebComponentsLookupLines(copied: readonly ReferenceFile[]): string[] {
  const apiDocsByComponent = new Map<string, ReferenceFile[]>();

  for (const reference of copied) {
    const componentMatch =
      /^packages\/web-components\/src\/components\/([^/]+)\/(.+)$/.exec(
        reference.sourceRelPath,
      );
    if (componentMatch === null) {
      continue;
    }

    const [, component, childPath] = componentMatch;
    if (
      component === undefined ||
      childPath === undefined ||
      !isPrimaryPackageComponentDoc(childPath)
    ) {
      continue;
    }

    const docs = apiDocsByComponent.get(component) ?? [];
    docs.push(reference);
    apiDocsByComponent.set(component, docs);
  }

  if (apiDocsByComponent.size === 0) {
    return ["No Web Components component API docs are currently synced for lookup."];
  }

  const lines = [
    "## Web Components Component Lookup",
    "",
    "| Component | Package API docs |",
    "| --- | --- |",
  ];

  for (const component of [...apiDocsByComponent.keys()].sort((left, right) =>
    left.localeCompare(right),
  )) {
    lines.push(
      `| ${component} | ${formatReferenceCell(apiDocsByComponent.get(component) ?? [])} |`,
    );
  }

  return lines;
}

function isPrimaryPackageComponentDoc(childPath: string): boolean {
  if (!childPath.endsWith(".md") && !childPath.endsWith(".mdx")) {
    return false;
  }

  const fileName = childPath.slice(childPath.lastIndexOf("/") + 1).toLowerCase();
  if (fileName.startsWith("migrate") || fileName.startsWith("migration")) {
    return false;
  }

  return !childPath.startsWith("docs/") && !childPath.startsWith("stories/");
}

function formatReferenceCell(
  references: ReferenceFile | readonly ReferenceFile[] | undefined,
): string {
  if (references === undefined) {
    return "n/a";
  }

  const values: readonly ReferenceFile[] =
    "relPath" in references ? [references] : references;
  if (values.length === 0) {
    return "n/a";
  }

  return [...values]
    .sort(compareCatalogReferences)
    .map((reference) => `\`${copiedReferenceRoot}/${reference.relPath}\``)
    .join("<br>");
}

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function buildCatalogLines(copied: readonly ReferenceFile[]): string[] {
  if (copied.length === 0) {
    return ["No reference files are currently synced for this skill."];
  }

  const groups = new Map<string, ReferenceFile[]>();
  for (const reference of copied) {
    const separator = reference.relPath.lastIndexOf("/");
    const group = separator === -1 ? "." : reference.relPath.slice(0, separator);
    const files = groups.get(group) ?? [];
    files.push(reference);
    groups.set(group, files);
  }

  return [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([group, references]) => {
      const entries = references
        .sort(compareCatalogReferences)
        .map(
          (reference) =>
            `  - \`${copiedReferenceRoot}/${reference.relPath}\` (source: \`${reference.canonicalPath}\`)`,
        );
      return [`- ${group === "." ? "root" : group}`, ...entries];
    });
}

function compareCatalogReferences(left: ReferenceFile, right: ReferenceFile): number {
  return compareCatalogPaths(left.relPath, right.relPath);
}

function compareCatalogPaths(left: string, right: string): number {
  const leftRank = documentRank(left);
  const rightRank = documentRank(right);

  if (leftRank !== rightRank) {
    return leftRank - rightRank;
  }

  return left.localeCompare(right);
}

function documentRank(path: string): number {
  const file = path.slice(path.lastIndexOf("/") + 1);
  const order = [
    "overview.mdx",
    "index.mdx",
    "usage.mdx",
    "code.mdx",
    "accessibility.mdx",
    "style.mdx",
  ];
  const index = order.indexOf(file);
  return index === -1 ? order.length : index;
}

function toPosix(path: string): string {
  return path.split(sep).join("/");
}

async function main(): Promise<void> {
  const args = parseArgs(Bun.argv.slice(2));
  const repo = resolve(args.repo);
  const sourceRoot = args.sourceDir
    ? resolve(args.sourceDir)
    : await ensureCarbonWebsiteClone(args);
  let carbonRepo: string | undefined;
  if (args.targetDir === undefined) {
    carbonRepo = await ensureCarbonMonorepoClone(args);
  }
  const pagesDir = await findPagesDir(sourceRoot);
  const pages = await collectMdxPages(pagesDir);

  if (pages.length === 0) {
    throw new Error(`no MDX files found under ${pagesDir}`);
  }

  if (args.targetDir !== undefined) {
    const targetDir = resolve(args.targetDir);
    const copied = await copyPages(pages, pagesDir, targetDir, args.ref);
    console.log(`Synced ${copied.length} MDX files to ${targetDir}`);
    return;
  }

  const routed = await writeSkillReferences(
    repo,
    pages,
    pagesDir,
    carbonRepo,
    args.ref,
    args.carbonRef,
  );
  for (const skill of allSkills) {
    console.log(`${skill}: indexed ${routed[skill].length} reference files`);
  }
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`error: ${message}`);
  process.exit(1);
}
