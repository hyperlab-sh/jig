---
summary: Migration guide for Edge.js v5 users and what changed in Jig
---

# Migrating to Jig (from Edge.js v5/v6)

Jig is a fork of Edge.js v6, optimized for **code generation** rather than HTML rendering. This page covers all breaking changes and new features.

For Jig-specific documentation, see the [Introduction](../introduction.md) page.

## Breaking Changes

### HTML escaping removed

`{{ }}` now outputs raw values. There is no automatic escaping. `{{ }}` and `{{{ }}}` behave identically.

**Before (Edge.js v5):**
```edge
{{-- Escaped output --}}
{{ userInput }}

{{-- Raw output --}}
{{{ userInput }}}
```

**After (Jig):**
```edge
{{-- Both produce raw output --}}
{{ userInput }}
{{{ userInput }}}
```

### `safe()` function removed

The `safe()` global function no longer exists. Since all output is raw, there is no need to bypass escaping.

**Before:**
```edge
{{ safe('<strong>bold</strong>') }}
```

**After:**
```edge
{{ '<strong>bold</strong>' }}
```

### HTML helpers removed

The following globals have been removed:

| Removed helper | Reason |
|---------------|--------|
| `html.attrs()` | HTML-specific |
| `html.classNames()` | HTML-specific |
| `html.escape()` | No escaping in Jig |
| `html.safe()` | No escaping in Jig |
| `nl2br()` | HTML-specific |
| `stringify()` | Use `{{ json :: value }}` filter instead |

### `$props.toAttrs()` removed

The `toAttrs()` method on `ComponentProps` has been removed because it serialized props as HTML attributes. Use `$props.all()` or `$props.serialize()` with the `json` filter instead.

**Before:**
```edge
<div {{ $props.toAttrs() }}>
```

**After:**
```edge
{{ json :: $props.all() }}
```

### `@set` tag removed

The `@set` tag was part of the v5 compatibility layer. Use `@let` for new variables and `@assign` for reassigning existing ones.

**Before:**
```edge
@set('username', 'virk')
```

**After:**
```edge
@let(username = 'virk')
```

### Migration plugin removed

The `edge.js/plugins/migrate` export no longer exists. All v5 compatibility features (layouts via `@layout`/`@section`/`@super`, `@set` tag, compat `Props` class) have been removed.

## New Features

### Implicit indentation control

Block tags (`@if`, `@each`, `@unless`, `@component`, `@slot`, `@pushTo`, `@pushOnceTo`) automatically strip cosmetic indentation from their children. The formula is: `dedent = firstContentLineIndent - tagIndent`, clamped to zero.

```edge
function render() {
  @if(showGreeting)
    return "hello"
  @end
}
```

Output:
```
function render() {
  return "hello"
}
```

Include tags (`@include`, `@includeIf`) automatically indent subsequent lines of the partial's output based on the tag's column position.

```edge
function setup() {
  @include('body')
}
```

If `body.edge` renders `const a = 1\nreturn a`, the output is:
```
function setup() {
  const a = 1
  return a
}
```

### Filter syntax

Use `{{ filterName :: expression }}` to apply a registered filter to expression output.

```edge
{{ json :: { name: 'User', id: 1 } }}
```

The built-in `json` filter calls `JSON.stringify`. Register custom filters with:

```ts
jig.registerFilter('upper', (value) => String(value).toUpperCase())
```

```edge
{{ upper :: username }}
```
