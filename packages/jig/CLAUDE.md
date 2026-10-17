# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jig is a template engine for Node.js focused on code generation, forked from Edge.js (part of the AdonisJS ecosystem). It compiles `.edge` templates into JavaScript functions. The compilation pipeline is: **Lexer** (`@jig-lang/lexer`) → **Parser** (`@jig-lang/parser`) → **Compiler** (`src/compiler.ts`) → **Template runtime** (`src/template.ts`).

Published as `@jig-lang/jig` (1.x). ESM-only. Node.js >=18.16.0.

## Commands

```bash
# Run full test suite (lint + tests)
bun run test

# Run tests without lint/coverage (fast iteration)
bun run quick:test

# Run a specific test file
node --import=@poppinss/ts-exec --enable-source-maps bin/test.ts -- --files="tests/edge.spec.ts"

# Lint
bun run lint

# Format
bun run format

# Type check
bun run typecheck

# Build (tsdown + tsc declarations → build/)
bun run build
```

Testing uses **Japa** (`@japa/runner`) with `@japa/assert` and `@japa/file-system` plugins. Config is in `bin/test.ts`. The lockfile is the root `bun.lock` (one lockfile for the whole workspace).

## Architecture

### Compilation Pipeline

Templates go through three external packages before reaching this repo's code:

1. **@jig-lang/lexer** — Tokenizes `.edge` files into a token array (tags, mustache expressions, raw text, comments). Includes `indent` tracking on tag tokens.
2. **@jig-lang/parser** — Parses tokens into an AST, resolves variable scoping (prefixes unknown vars with `state.`)
3. **Compiler** (`src/compiler.ts`) — Orchestrates lexer+parser, produces executable JS functions from templates. Manages caching via `CacheManager`. Uses `onMustache` hook to unify MUSTACHE/SMUSTACHE tokens and support filter syntax.

### Runtime

- **Template** (`src/template.ts`) — Runtime context for template execution. Holds state, shared state, and provides helpers like `$props`, `$slots`, `indentOutput()`. Extended via `@poppinss/macroable`.
- **EdgeRenderer** (`src/edge/renderer.ts`) — Fluent API for rendering: `jig.render(template, data)` or `jig.share(data).render(template)`.
- **Processor** (`src/processor.ts`) — Hook system for pre/post processing of raw templates and compiled output.

### Key Classes

- **Edge** (`src/edge/main.ts`) — Main entry point. Manages plugins, tags, globals, loader, compiler. Factory via `Edge.create()`. Supports `registerFilter()` for filter syntax.
- **Loader** (`src/loader.ts`) — Resolves template paths from "disks" (mounted directories). Supports in-memory templates via `register()`.

### Tags System

Tags are in `src/tags/`. Each tag implements `TagContract` with:
- `tagName` — Name used in templates (e.g., `@if`, `@each`)
- `compile()` — Writes to `EdgeBuffer` during compilation
- `boot()` (optional) — Called once to extend Template class

Built-in tags: `if`, `elseif`, `else`, `each`, `include`, `includeIf`, `component`, `slot`, `inject`, `let`, `assign`, `eval`, `unless`, `debugger`, `newError`, `pushTo`, `pushOnceTo`, `stack`.

Block tags use `processChildrenDedented()` for implicit indentation control. Include tags use `template.indentOutput()`.

All tags are re-exported from `src/tags/main.ts`.

### Component System

Components are templates that receive `$props` and `$slots`. They use the `@component` tag or can be auto-discovered from mounted disks. Component-related code lives in `src/component/` and `src/tags/component.ts`.

### Globals

Built-in globals (`src/edge/globals.ts`) provide helpers available in all templates: `inspect`, `truncate`, `excerpt`, case conversion helpers, etc. The `$filters` object is injected for filter syntax support.

### Plugin System

Plugins are functions `(edge: Edge, firstRun: boolean, options?: T) => void`. The `pluginSuperCharged` plugin (`src/plugins/supercharged.ts`) adds auto-discovery of components from disks.

### Exports

```
@jig-lang/jig        → Edge class, default instance, Template, EdgeError, edgeGlobals
@jig-lang/jig/types  → All TypeScript types
```

## Test Fixture Pattern

Many tests use fixture directories under `fixtures/`, `async_fixtures/`, and `newline_fixtures/`. Each fixture contains:
- `index.edge` — Template source
- `index.json` — Template data (state)
- `compiled.js` — Expected compiler output
- `index.txt` — Expected rendered output

Tests iterate over these directories to verify both compilation and rendering.

## Conventions

- AdonisJS ecosystem conventions: `@adonisjs/eslint-config`, `@adonisjs/prettier-config`, `@adonisjs/tsconfig`
- Commit messages follow **conventional commits** (Angular preset) — enforced by `release-it`
- Source uses private class fields (`#field`) extensively
- All imports use `.js` extensions (ESM requirement)
