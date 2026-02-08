---
summary: Comprehensive guide to the differences between Edge.js and Jig, including breaking changes, new features, and migration considerations
---

# Edge vs Jig

Jig is a fork of [Edge.js](https://edgejs.dev) optimized for **code generation** rather than HTML rendering. It inherits Edge's battle-tested lexer, parser, and template syntax while stripping away HTML-specific features and adding new capabilities for clean code output.

This guide documents all differences between Edge.js 6.x and Jig 7.0.

## Philosophy Shift

**Edge.js is designed for rendering HTML** with automatic escaping to prevent XSS attacks. It includes helpers for HTML attributes, class names, and newline-to-BR conversion.

**Jig is designed for generating code**, configuration files, SQL, GraphQL schemas, and other structured text formats. It removes all HTML concerns and adds features for controlling output indentation and applying transformations via filters.

## Breaking Changes

### 1. No HTML Escaping

Edge automatically escapes values in `{{ }}` expressions to prevent XSS:

```edge
{{-- Edge.js --}}
{{ '<script>alert(1)</script>' }}
{{-- Output: &lt;script&gt;alert(1)&lt;/script&gt; --}}
```

Jig outputs raw values directly:

```edge
{{-- Jig --}}
{{ '<script>alert(1)</script>' }}
{{-- Output: <script>alert(1)</script> --}}
```

**Impact**: In Jig, `{{ }}` and `{{{ }}}` behave identically (both output raw). There is no distinction between escaped and raw output.

### 2. Removed `safe()` Function

Edge provides `safe()` to bypass escaping:

```edge
{{-- Edge.js --}}
{{ safe('<strong>Bold</strong>') }}
```

Jig has no `safe()` function since there's no escaping to bypass.

**Migration**: Remove all `safe()` calls. Output is already raw.

### 3. Removed HTML Helpers

Edge provides HTML-specific helpers:

```js
// Edge.js globals
html.attrs({ class: 'btn', disabled: true })  // → class="btn" disabled
html.classNames({ active: true, disabled: false })  // → active
html.escape('<script>')  // → &lt;script&gt;
nl2br('Line 1\nLine 2')  // → Line 1<br>\nLine 2
```

Jig removes all `html.*` helpers and `nl2br()`.

**Migration**: Handle HTML attribute serialization manually if generating HTML with Jig. For most code generation use cases, these helpers aren't needed.

### 4. Removed `$props.toAttrs()`

Edge components can serialize props to HTML attributes:

```edge
{{-- Edge.js component --}}
<button {{ $props.toAttrs() }}>
  {{ await $slots.main() }}
</button>
```

Jig removes `toAttrs()` from `ComponentProps`.

**Migration**: Manually serialize component props if needed, or avoid using Jig for HTML generation.

### 5. Removed `EdgeOptions.escape`

Edge allows customizing the escape function:

```js
// Edge.js
const edge = new Edge({
  escape: (value) => customEscape(value)
})
```

Jig has no `escape` option since escaping is removed.

### 6. Removed Migration Plugin

Edge 6.x included a migration plugin (`edge.js/plugins/migrate`) for v5→v6 compatibility. Jig removes this plugin and all v5 compatibility code.

### 7. Implicit Indentation Changes Output Whitespace

Jig automatically dedents block tag content, which may change the exact whitespace in your output compared to Edge.

**Example**:

```edge
@if(condition)
    Some content
        with indentation
@end
```

**Edge output** (preserves exact whitespace):
```
    Some content
        with indentation
```

**Jig output** (dedented relative to tag):
```
Some content
    with indentation
```

The content is dedented by the tag's indent level (4 spaces in this example).

## New Features

### 1. Filter Syntax

Jig introduces a new syntax for transforming mustache expressions:

```edge
{{ mode :: expression }}
```

The filter is applied by rewriting the expression to `$filters.mode(expression)` during compilation.

**Built-in filter**:

```edge
{{ json :: { name: 'John', age: 30 } }}
{{-- Output: {"name":"John","age":30} --}}
```

**Custom filters**:

```js
import { Edge } from 'jig'

const jig = new Edge()

jig.registerFilter('upper', (value) => String(value).toUpperCase())
jig.registerFilter('quote', (value) => `"${value}"`)
```

```edge
{{ upper :: 'hello world' }}
{{-- Output: HELLO WORLD --}}

{{ quote :: user.name }}
{{-- Output: "John Doe" --}}
```

Filters can be chained (left-to-right evaluation):

```edge
{{ upper :: quote :: 'hello' }}
{{-- Equivalent to: $filters.upper($filters.quote('hello')) --}}
{{-- Output: "HELLO" --}}
```

### 2. Implicit Indentation Control

Jig automatically manages indentation for clean output.

#### Block Tag Dedenting

Content inside block tags is automatically dedented based on the tag's position:

```edge
class User {
    @if(hasName)
        public name: string
    @end

    @if(hasAge)
        public age: number
    @end
}
```

**Output** (no extra indentation from the block tags):
```
class User {
    public name: string
    public age: number
}
```

The dedent amount is calculated as: `firstContentLineIndent - tagIndent`.

Applies to: `@if`, `@elseif`, `@else`, `@unless`, `@each`, `@component`, `@slot`, `@pushTo`, `@pushOnceTo`

#### Include Tag Re-indenting

When including a partial, subsequent lines are automatically indented to match the include tag's position:

**partial.edge**:
```
function example() {
  return true
}
```

**main.edge**:
```
class MyClass {
    @include('partial')
}
```

**Output**:
```
class MyClass {
    function example() {
      return true
    }
}
```

The first line of the partial is inserted as-is, and subsequent lines are indented by the column position of the `@include` tag (4 spaces in this example).

This ensures partials integrate cleanly into the surrounding code structure.

## Internal Changes

### Compilation

- `{{ }}` and `{{{ }}}` both compile to direct output with no escaping wrapper
- Compiler uses `onMustache` hook to convert all MUSTACHE tokens to SMUSTACHE
- Filter syntax is processed by the `onMustache` hook, rewriting `{{ mode :: expr }}` to `{{ $filters.mode(expr) }}`

### Template API

- `template.escape(value)` still exists for backward compatibility but just returns `String(value)`
- New `template.indentOutput(output, column)` method for include tag re-indenting
- `$filters` global object injected into all templates for filter syntax support

### Dependencies

Jig requires updated versions of the lexer and parser:

- **edge-lexer** 6.1.0+ — Adds `indent: number` field to tag tokens
- **edge-parser** 9.2.0+ — Propagates indent information through AST

## Migration from Edge.js

### 1. Remove `safe()` calls

```diff
- {{ safe(htmlContent) }}
+ {{ htmlContent }}
```

### 2. Remove HTML helper usage

```diff
- <div {{ html.attrs(attributes) }}></div>
+ <div>...</div>  {{-- Or handle attributes manually --}}
```

### 3. Review output whitespace

Run your test suite and check for whitespace differences. The implicit dedenting may change output formatting, which is usually desirable for code generation but may require test fixture updates.

### 4. Leverage new features

#### Use filters for output transformation

```diff
- {{ JSON.stringify(data) }}
+ {{ json :: data }}
```

#### Rely on implicit indentation instead of manual management

Edge templates often require manual whitespace trimming with `~`:

```edge
{{-- Edge.js --}}
@if(condition)~
Some content
@end~
```

Jig handles this automatically:

```edge
{{-- Jig --}}
@if(condition)
    Some content
@end
```

The output will be cleanly dedented without manual `~` trimming.

## Use Cases

### Edge.js is ideal for:

- Rendering HTML in web applications
- Email templates
- Server-side rendering (SSR)
- Any use case requiring XSS protection

### Jig is ideal for:

- Code generators (TypeScript, GraphQL, SQL, etc.)
- Configuration file generation (YAML, JSON, TOML)
- Build tool output (webpack configs, package.json)
- Documentation generation
- Template-based scaffolding tools
- Any text format where manual control of escaping is preferred

## Syntax Compatibility

Since Jig uses the same lexer and parser as Edge, most Edge syntax works identically in Jig:

- Tags: `@if`, `@each`, `@component`, `@include`, etc.
- JavaScript expressions in mustache and tag arguments
- Components, slots, layouts
- Async/await support
- Template inheritance via components
- Globals and helpers (except removed HTML helpers)

The only syntax additions are:
- Filter syntax: `{{ mode :: expr }}`

## Further Reading

- [Edge.js Documentation](https://edgejs.dev)
- [Jig Syntax Specification](syntax_specification)
- [Jig Components Guide](components/introduction)
