# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Jig** is a template engine purpose-built for code generation, forked from [Edge.js](https://edgejs.dev) (AdonisJS ecosystem). It strips away HTML escaping and HTML-specific helpers, adds implicit indentation control and filter syntax, and keeps components, slots, partials, and full JavaScript expressions.

This repo is a Bun workspace monorepo (`workspaces: ["packages/*", "docs"]`) with a single root `bun.lock`. Install once from the root with `bun install`; the isolated linker (`bunfig.toml`) gives each package its own `node_modules`.

| Directory | Package | Description |
|-----------|---------|-------------|
| `packages/lexer/` | `@jig-lang/lexer` | Tokenizer — converts `.edge` markup into token arrays |
| `packages/parser/` | `@jig-lang/parser` | Parser — converts tokens into compiled JavaScript via Acorn |
| `packages/jig/` | `@jig-lang/jig` | Template engine — compiler, runtime, tags, components, plugins |
| `packages/vscode/` | `jig` (VS Code extension) | Syntax highlighting and snippets; own tsup/CommonJS setup and older toolchain |
| `docs/` | `@jig-lang/docs` (private) | Documentation website — static site on AdonisJS + @dimerapp |

### Dependency Chain

```
lexer → parser → jig
```

- `packages/parser` depends on `@jig-lang/lexer` via `workspace:^`
- `packages/jig` depends on `@jig-lang/lexer` and `@jig-lang/parser` via `workspace:^`
- Siblings resolve through each package's `build/` directory (`exports` point there), so build lexer, then parser, before typechecking or testing a dependent package from a clean checkout. The root `typecheck` does this through `build:libs`.

### Compilation Pipeline

```
.edge template → Lexer (tokenize) → Parser (AST + variable scoping) → Compiler (generate JS) → Template runtime (execute)
```

1. **Lexer** detects Edge syntax (tags `@if()`, mustache `{{ }}`, comments `{{-- --}}`) and produces tokens with line/col tracking
2. **Parser** uses Acorn to parse JS expressions in tokens, transforms AST to prefix unknown variables with `state.`, generates JavaScript via astring
3. **Compiler** (in `packages/jig/src/compiler.ts`) orchestrates lexer+parser, applies processor hooks, produces cached executable functions
4. **Template** (in `packages/jig/src/template.ts`) executes compiled functions with state, globals, and helpers

## Commands

Run from the repo root. `lint`, `typecheck`, `build` and `format` fan out to `packages/*`; `docs` is excluded.

```bash
bun install              # install + link workspace packages
bun run test             # build:libs + generate, then each package's `test`: lexer/parser = lint + tests with c8 coverage; jig = lint + tests (no coverage); vscode = tests with coverage (no lint)
bun run quick:test       # build:libs + generate, then each package's `quick:test` (no coverage). build:libs lints and builds lexer and parser first, so they are linted even here
bun run lint             # ESLint
bun run typecheck        # build:libs first (lint + build lexer and parser), then tsc --noEmit everywhere
bun run build            # build every package (lexer, parser, jig, vscode)
bun run format           # Prettier

bun run test:lexer       # quick:test in one package
bun run test:parser      # lints + builds lexer first (its `build` runs `precompile`)
bun run test:jig         # lints + builds lexer and parser first (build:libs)
bun run test:vscode      # runs generate (grammar) first
```

### Single test file (lexer, parser, jig)

```bash
bun run --cwd packages/jig quick:test -- --files="dedent.spec.ts"
```

The `--files` value is matched against the package's test files.

### docs/

```bash
bun run --cwd docs dev     # Vite build + dev server
bun run --cwd docs serve   # Dev server only
bun run --cwd docs export  # Static build → dist/ (requires APP_URL env var)
```

## Releases

`release-it` runs per package (lexer, parser, jig). Tags are prefixed per package: `lexer-v<version>`, `parser-v<version>`, `jig-v<version>`; release commits read `chore(release): <pkg> <version>`. Version bump and release notes only consider commits touching that package's directory.

```bash
bun run --cwd packages/lexer release    # release in order: lexer, then parser, then jig
bun run --cwd packages/parser release
bun run --cwd packages/jig release
```

Releases run from the `release` workflow (Actions > release > Run workflow, pick the package; leave "Dry run" on for a rehearsal). It publishes with npm trusted publishing: the workflow's OIDC token authenticates to npm, so no npm token exists anywhere, and every version gets a provenance attestation. Each package has a trusted publisher on npmjs.com for repo `hyperlab-sh/jig`, workflow `release.yml`, environment `release`. The checkout uses the `RELEASE_DEPLOY_KEY` deploy key because the `main` ruleset only lets admins and deploy keys push commits that have not passed `ci`; release-it pushes the release commit and tag with it.

Before releasing a package, release every workspace dependency of it that changed, in order lexer -> parser -> jig. The packed tarball rewrites `workspace:^` to `^<current workspace version>`, so releasing jig without releasing a changed parser publishes a range that points at the older parser.

How publishing works: release-it's `before:npm:release` hook runs the package's `pack:release` script, which builds the package and runs `bun pm pack` into `.release/package.tgz`; packing rewrites the `workspace:^` sibling ranges to real versions. A dry run skips hooks but still runs `npm publish --dry-run`, so the workflow runs `pack:release` itself before a dry run. A dry run also really runs `npm version` (release-it treats it as read-only), so a local dry run leaves the bumped version in `package.json`; revert it afterwards. release-it then runs `npm publish ./.release/package.tgz --provenance` (npm, not bun, because `bun publish` has no OIDC support), and only after that commits, tags and pushes. A failed publish therefore leaves no tag behind. Never run `npm publish` from a package folder: it would ship the `workspace:` specifiers verbatim. `--provenance` only works inside GitHub Actions, so `bun run release` on a laptop fails at the publish step; use the workflow.

Tags named `<pkg>-edge-v*` are the upstream Edge.js history imported into this repo; they are not Jig releases.

### VS Code extension releases

The old per-package release workflow was removed in the workspace migration. The root release workflow arrives with the CI task; until then the extension has no automated release.

## Key Differences from Edge.js

- **No HTML escaping** — `{{ value }}` outputs raw values
- **No HTML helpers** — No `html.attrs`, `html.classNames`, `nl2br`
- **Filter syntax** — `{{ mode :: expr }}` applies registered filters
- **No `safe()` function** — Unnecessary since all output is raw
- **Implicit indentation control** — Block tag children are auto-dedented based on tag indent position

## Shared Conventions

- **ESM-only**, all imports use `.js` extensions (except `packages/vscode`, which is CommonJS built with tsup)
- **TypeScript** with private class fields (`#field`)
- **Testing**: Japa (`@japa/runner`) with `@japa/assert` — config in each package's `bin/test.ts`
- **AdonisJS ecosystem configs**: `@adonisjs/eslint-config`, `@adonisjs/prettier-config`, `@adonisjs/tsconfig`
- **Conventional commits** (Angular preset) enforced by `release-it`
- **Build**: tsdown for bundling + tsc for declaration files → `build/`
- **Node.js** >=18.16.0
- `packages/vscode` pins an older lint/test stack (eslint 8, `@japa/assert` 1.x, `@typescript-eslint` 5) and declares its eslint config plugins as direct devDependencies; do not bump it casually.

## Test Fixture Pattern (packages/jig and packages/parser)

Many tests use fixture directories. Each fixture contains:
- `index.edge` — Template source
- `index.json` — Template data (state)
- `compiled.js` — Expected compiled JavaScript output
- `index.txt` — Expected rendered output

Tests iterate these directories to verify both compilation and rendering. Use `tests_helpers/` for cross-platform normalization of newlines and filenames.

Per-package guidance lives in `packages/{lexer,parser,jig}/CLAUDE.md`.
