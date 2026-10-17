# Changelog

## Unreleased

### Bug Fixes

- `@include`, `@includeIf` and `@stack` on their own line now start on a new line. Before, `class X {` followed by `@include('p')` rendered as `class X {` glued to the partial's first line
- `@include` and `@includeIf` indent the first line of the partial too, not only the continuation lines

### Internal

- Tags opt in with the lexer's new `outputsContent` flag (requires `@jig-lang/lexer` 1.2.0)
- `template.indentOutput()` takes an optional `indentFirstLine` argument
- `@component` is not flagged yet: a component whose template starts with its own newline would render an extra blank line

## 1.1.0 (2026-10-17)

### Bug Fixes

- **Nested blocks** are dedented by every enclosing block, not only their own
- A nested `@if`, `@unless` or `@each` no longer adds a blank line after its parent block's opening tag
- `@include` and `@includeIf` indent relative to the dedented block they sit in
- `template.indentOutput()` no longer indents blank lines or a trailing newline
- An unregistered filter (`{{ nope :: value }}`) now throws `Unknown filter "nope"` with the template location instead of a bare `TypeError`

### Internal

- Rebased on Edge 6.5.1 (adds `pushToTop` and `pushToTopOnce`)
- Depends on `@jig-lang/lexer` and `@jig-lang/parser` 1.1.0
- Added `getActiveDedent()` and `withDedent()` to track cumulative dedent

---

## 1.0.0 (2026-02-08, Jig fork of Edge 6.4.0)

### Breaking Changes

- **Renamed**: Package renamed from `edge.js` to `@jig-lang/jig`
- **Removed HTML escaping**: `{{ }}` now outputs raw values. No `template.escape()` wrapping in compiled output
- **Removed `safe()` function**: No longer needed since there's no escaping
- **Removed `SafeValue` class**: Internal class for escape bypass removed
- **Removed HTML helpers**: `html.attrs`, `html.classNames`, `html.escape`, `html.safe`, `nl2br` removed
- **Removed `$props.toAttrs()`**: HTML attribute serialization removed from ComponentProps
- **Removed `EdgeOptions.escape`**: Custom escape function option removed
- **Removed migration plugin**: the v5 to v6 migration plugin (`src/migrate`) is gone
- **Removed layout compatibility**: the `compat` option and the `@layout`, `@section`, `@set` and `@super` tags are gone; use components and `@let`/`@assign`
- **`ComponentProps.merge`** no longer merges `class` values

### New Features

- **Implicit indentation control**: Block tag content is automatically dedented based on the tag's position. Content inside `@if`, `@each`, `@unless`, `@pushTo`, `@pushOnceTo`, `@component`, and `@slot` blocks has cosmetic indentation removed using the formula `dedent = firstContentLineIndent - tagIndent`. Include tags (`@include`, `@includeIf`) auto-indent subsequent lines of partial output based on the include tag's column position.
- **Filter syntax**: `{{ mode :: expr }}` — apply registered filters to expressions
- **Built-in `json` filter**: `{{ json :: value }}` outputs `JSON.stringify(value)`
- **`registerFilter()` API**: `edge.registerFilter('name', fn)` for custom filters

### Internal

- `{{ }}` and `{{{ }}}` now behave identically (both output raw values)
- Compiler uses `onMustache` hook to convert all MUSTACHE tokens to SMUSTACHE
- `template.escape()` method kept for backward compatibility (returns `String(input)`)
- Added `computeDedent()`, `dedentRaw()`, `processChildrenDedented()` utility functions
- Added `template.indentOutput()` method for include tag output indentation
- Depends on `@jig-lang/lexer` and `@jig-lang/parser` for tag indent tracking

---

<a name="1.1.4"></a>

## [1.1.4](https://github.com/poppinss/edge/compare/v1.1.3...v1.1.4) (2018-01-26)

### Bug Fixes

- **memberexpression:** parse nested memberexpression ([5aee3ba](https://github.com/poppinss/edge/commit/5aee3ba)), closes [#21](https://github.com/poppinss/edge/issues/21)

<a name="1.1.3"></a>

## [1.1.3](https://github.com/poppinss/edge/compare/v1.1.2...v1.1.3) (2017-11-27)

### Bug Fixes

- **include:** allow callExpression inside include ([cbbe629](https://github.com/poppinss/edge/commit/cbbe629))
- **ReDoS:** Regular Expression Denial of Service (#7) ([39777cc](https://github.com/poppinss/edge/commit/39777cc))

### Features

- **edge:** add edge.new method to newup isolated template ([5db5710](https://github.com/poppinss/edge/commit/5db5710))
- **globals:** add orderBy method ([6ad7190](https://github.com/poppinss/edge/commit/6ad7190))

<a name="1.1.2"></a>

## [1.1.2](https://github.com/poppinss/edge/compare/v1.1.1...v1.1.2) (2017-10-29)

### Bug Fixes

- **ast:** trim whitespace in tag end ([2ff8b36](https://github.com/poppinss/edge/commit/2ff8b36)), closes [#3](https://github.com/poppinss/edge/issues/3)
- **component:** access globals and optionally share data ([5bc9889](https://github.com/poppinss/edge/commit/5bc9889)), closes [#2](https://github.com/poppinss/edge/issues/2)

### Features

- **tags:** add set tag ([a6735fc](https://github.com/poppinss/edge/commit/a6735fc))

### Reverts

- **component:** remove option to share data with component ([83c57e5](https://github.com/poppinss/edge/commit/83c57e5))

<a name="1.1.1"></a>

## [1.1.1](https://github.com/poppinss/edge/compare/v1.1.0...v1.1.1) (2017-10-08)

### Features

- **tags:** add mustache tag ([d46022e](https://github.com/poppinss/edge/commit/d46022e))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/poppinss/edge/compare/v1.0.2...v1.1.0) (2017-09-23)

### Features

- **tags:** allow multiline tags ([e7783f5](https://github.com/poppinss/edge/commit/e7783f5))

<a name="1.0.2"></a>

## [1.0.2](https://github.com/poppinss/edge/compare/v1.0.1...v1.0.2) (2017-08-08)

### Bug Fixes

- **context:** bind context to global functions ([e0a2685](https://github.com/poppinss/edge/commit/e0a2685))

### Features

- **globals:** add elIf ([fb522ce](https://github.com/poppinss/edge/commit/fb522ce))

<a name="1.0.1"></a>

## [1.0.1](https://github.com/poppinss/edge/compare/v1.0.0...v1.0.1) (2017-06-21)

### Features

- **globals:** add globals ([7ddbb1e](https://github.com/poppinss/edge/commit/7ddbb1e))
- **tags:** export BaseTag to be extended by custom tags ([cfdfd04](https://github.com/poppinss/edge/commit/cfdfd04))
- **template:** edge.share now merges locals ([7402af4](https://github.com/poppinss/edge/commit/7402af4))

<a name="1.0.0"></a>

# 1.0.0 (2017-03-30)

### Bug Fixes

- **tags:** allow nested each loops ([47ebd9c](https://github.com/poppinss/edge/commit/47ebd9c))

### Features

- **ast:** add support for inline & block comments ([cb06a6b](https://github.com/poppinss/edge/commit/cb06a6b))
- **ast:** add support for self closing tags ([016bf48](https://github.com/poppinss/edge/commit/016bf48))
- **cache:** support for in-memory cache ([7e7b61b](https://github.com/poppinss/edge/commit/7e7b61b))
- **component:** add support for define presenter ([7a90885](https://github.com/poppinss/edge/commit/7a90885))
- **context:** add safe method to ignore escaping ([dfb7d46](https://github.com/poppinss/edge/commit/dfb7d46))
- **each:** add support for inlcude inside each ([c876c2d](https://github.com/poppinss/edge/commit/c876c2d))
- **each-tag:** add `isEven` and `isOdd` to ([9be4fbe](https://github.com/poppinss/edge/commit/9be4fbe))
- **edge:** add support for cache ([3e46c85](https://github.com/poppinss/edge/commit/3e46c85))
- **expression:** add support for conditional expression ([6b6d1d2](https://github.com/poppinss/edge/commit/6b6d1d2))
- **globals:** add couple of globals ([f1bf6e0](https://github.com/poppinss/edge/commit/f1bf6e0))
- **if:** add support for unary expression ([15ea142](https://github.com/poppinss/edge/commit/15ea142))
- **layout:** add support for [@super](https://github.com/super) keyword ([8f79a9b](https://github.com/poppinss/edge/commit/8f79a9b))
- **layout:** implement layouts ([56ed7c9](https://github.com/poppinss/edge/commit/56ed7c9))
- **tag:** add debugger tag ([65ac9cd](https://github.com/poppinss/edge/commit/65ac9cd))
- **tag:** add raw tag ([9498e63](https://github.com/poppinss/edge/commit/9498e63))
- **tag:** add unless tag ([5c86bb0](https://github.com/poppinss/edge/commit/5c86bb0))
- **tags:** implement yield tag ([e1445d8](https://github.com/poppinss/edge/commit/e1445d8))
