# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**@jig-lang/lexer** is the tokenizer for the Jig template engine (forked from Edge). It converts `.edge` template markup into a token array by detecting Edge-whitelisted syntax (tags, mustache expressions, comments) and performing lexical analysis only within detected markup — not character-by-character. Published as `@jig-lang/lexer` on npm.

Dependency chain: **lexer** → parser → jig (this is the lowest-level package).

## Commands

```bash
# Run full test suite (lint + tests with coverage)
bun test

# Run tests without lint/coverage
bun run quick:test

# Run a specific test file
node --enable-source-maps --import=@poppinss/ts-exec bin/test.ts -- --files="tests/scanner.spec.ts"

# Lint / Format / Type check
bun run lint
bun run format
bun run typecheck

# Build (tsdown + tsc declarations → build/)
bun run build
```

Testing uses **Japa** (`@japa/runner`) with `@japa/assert`. Config is in `bin/test.ts`.

## Architecture

### Core Classes

- **Tokenizer** (`src/tokenizer.ts`) — Main entry point. Takes template string, tag definitions, and options. Call `parse()` to populate `tokenizer.tokens`. Splits template into lines, uses Detector to identify tags/mustache, uses Scanner for multiline expression completion. Manages an opened tags stack for nesting validation.

- **Scanner** (`src/scanner.ts`) — Finds closing delimiters while respecting nested/tolerated pairs (e.g., balanced parentheses). Tracks `closed`, `match`, `leftOver`, and location. Used for both tag arguments `@if(...)` and mustache `{{ ... }}`.

- **Detector** (`src/detector.ts`) — Pure functions `getTag()` and `getMustache()`. Uses a single regex for tag detection. Returns `RuntimeTag`, `RuntimeMustache`, or `RuntimeComment`.

### Token Types

```
Token = RawToken | NewLineToken | TagToken | MustacheToken | CommentToken
```

- `TagTypes`: `TAG`, `ETAG` (escaped with `@@`)
- `MustacheTypes`: `MUSTACHE`, `SMUSTACHE` (safe `{{{ }}}`), `EMUSTACHE` (escaped `@{{ }}`), `ESMUSTACHE`

### Tag Definition Contract

Tags passed to the Tokenizer must satisfy `LexerTagDefinitionContract`:
- `block: boolean` — Is it a block-level tag (has children, requires `@end`)?
- `seekable: boolean` — Does it require arguments in `()`?
- `noNewLine?: boolean` — Drop newline after tag?
- `outputsContent?: boolean` — Tag renders content of its own (e.g. an include); a newline is pushed before it so the output starts on its own line

Tag tokens also carry `indent` (column of the tag) and, when the line has a `: type` suffix, `properties.contentType`.

### Newline model

A newline token is pushed *before* every non-tag line, never before a tag line (unless the previous line was a tag too). A block tag's first child is therefore the newline that ends its own line. A tag on its own line adds no line break before its output, so `a\n@let(x = 1)\nb` renders as `ab`. Tags flagged `outputsContent` are the exception: they get a newline before them, so `a\n@include('p')` keeps the partial on its own line.

### Exports

```
@jig-lang/lexer       → Tokenizer, MustacheTypes, TagTypes
@jig-lang/lexer/types → All TypeScript types
@jig-lang/lexer/utils → Type guard utilities (isTag, isMustache, etc.)
```

### Error Codes

All errors are instances of `edge-error` with `message`, `line`, `col`, `filename`, `code`:
- `E_CANNOT_SEEK_STATEMENT` — Content after tag closing `)`
- `E_UNCLOSED_PAREN` — Mismatched `(` `)` in tag args
- `E_UNOPENED_PAREN` — Seekable tag without `(`
- `E_UNCLOSED_CURLY_BRACE` — Missing `}}` or `}}}` in mustache
- `E_UNCLOSED_TAG` — Block tag never closed with `@end`

## Conventions

- Single regex for tag detection (tested against safe-regex for ReDOS)
- Private class fields (`#field`) throughout
- All imports use `.js` extensions (ESM)
- AdonisJS ecosystem configs: `@adonisjs/eslint-config`, `@adonisjs/prettier-config`, `@adonisjs/tsconfig`
- Conventional commits (Angular preset) enforced by `release-it`
