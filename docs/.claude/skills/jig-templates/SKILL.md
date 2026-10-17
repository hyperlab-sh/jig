---
name: jig-templates
description: Write Jig templates for code generation. Use when creating or modifying .edge/.jig template files, when the user asks about Jig template syntax, or when generating code templates for TypeScript, GraphQL, SQL, YAML, or other structured text formats.
allowed-tools: Read, Glob, Grep, Write, Edit
argument-hint: [description or file-path]
---

# Jig Template Writer

You are an expert at writing **Jig** templates. Jig is a template engine purpose-built for **code generation**, forked from Edge.js. It strips away HTML escaping and HTML-specific helpers, adds implicit indentation control and filter syntax, and keeps components, slots, partials, and full JavaScript expressions.

When asked to write a Jig template:

1. Clarify what the template should generate (language, structure, data shape)
2. Write the template using correct Jig syntax
3. Show example input data and expected output
4. Explain any non-obvious patterns used

## Quick Reference

### File Extensions

- `.edge` — Traditional Edge.js extension (still supported)
- `.jig` — Jig-specific extension
- `.ts.jig`, `.py.jig`, etc. — Host language extensions for IDE syntax highlighting

### Two Primitives

Jig has only two syntactic primitives:

1. **Curly braces** `{{ }}` — Evaluate a JavaScript expression and output the result
2. **Tags** `@tagName(args)` — Control flow, composition, and logic

### Interpolation (Mustache)

Output any JavaScript expression. The result is always stringified via `String()`. There is **no HTML escaping** — output is always raw.

```jig
{{ username }}
{{ user.name.toUpperCase() }}
{{ (2 + 2) * 3 }}
{{ (await getUser()).username }}
{{ items.map(i => i.name).join(', ') }}
```

Multiline expressions — both braces must be on the same line:

```jig
{{
  users.map((user) => {
    return user.username
  }).join('\n')
}}
```

### Comments

```jig
{{-- This is a comment --}}

{{--
  This is a
  multi-line comment
--}}
```

### Escaping Curly Braces

Prefix with `@` to output literal curly braces (useful when generating templates for other systems):

```jig
@{{ notEvaluated }}
{{-- Output: {{ notEvaluated }} --}}
```

## Tags

Tags must appear on their own line with no other content. They start with `@` followed by the tag name.

### Block Tags

Block tags have an opening statement, content, and a closing `@end`:

```jig
@if(condition)
  content here
@end
```

Auto-close block tags with `!` prefix (for components without body content):

```jig
@!component('button', { text: 'Click' })
```

### Inline Tags

Inline tags do not have a body:

```jig
@include('partials/header')
@debugger
```

### Swallow Newlines

Append `~` to suppress the newline a tag creates:

```jig
@let(name = 'world')~
Hello {{ name }}
{{-- Output: Hello world (no blank line) --}}
```

### Content Type Suffix

Annotate a block's content language for IDE highlighting:

```jig
@if(generateJson): json
  { "name": "{{ name }}" }
@end

@each(query in queries): sql
  SELECT * FROM {{ query.table }};
@end
```

## Conditionals

### @if / @elseif / @else

```jig
@if(user.role === 'admin')
  // admin code
@elseif(user.role === 'editor')
  // editor code
@else
  // default code
@end
```

### @unless

Negated if — renders when the condition is falsy:

```jig
@unless(account.isActive)
  Account is inactive
@end
```

### Ternary Operator

Inline conditionals inside mustache:

```jig
{{ isPublic ? 'export ' : '' }}class {{ name }} {}
```

## Loops

### @each

Loop over arrays or objects:

```jig
{{-- Array --}}
@each(item in items)
  {{ item.name }}
@end

{{-- Array with index --}}
@each((item, index) in items)
  {{ index }}: {{ item.name }}
@end

{{-- Object --}}
@each((value, key) in obj)
  {{ key }}: {{ value }}
@end
```

### @each with @else (fallback for empty collections)

```jig
@each(user in users)
  {{ user.name }}
@else
  No users found
@end
```

## Variables

### @let — Define a variable

```jig
@let(count = 0)
@let(config = await loadConfig())
@let({ name, age } = user)
```

### @assign — Reassign a variable

```jig
@let(total = 0)
@each(item in items)
  @assign(total = total + item.price)
@end
Total: {{ total }}
```

### @eval — Execute an expression without output

```jig
@eval(items.push(newItem))
@eval(user.username = user.username.toUpperCase())
```

## Filter Syntax

Transform mustache output with `{{ filterName :: expression }}`:

```jig
{{-- Built-in json filter --}}
{{ json :: { name: 'User', id: 1 } }}
{{-- Output: {"name":"User","id":1} --}}

{{-- Custom filters (registered via jig.registerFilter) --}}
{{ upper :: username }}
{{ quote :: fieldName }}
```

Filters chain left-to-right:

```jig
{{ upper :: quote :: 'hello' }}
{{-- Equivalent to: $filters.upper($filters.quote('hello')) --}}
```

Registering custom filters in JavaScript:

```ts
jig.registerFilter('upper', (value) => String(value).toUpperCase())
jig.registerFilter('quote', (value) => `"${value}"`)
```

## Implicit Indentation Control

This is Jig's killer feature for code generation. It works automatically — no configuration needed.

### Block Tag Dedenting

Content inside block tags is automatically dedented based on the tag's indent position. The formula is: `dedent = firstContentLineIndent - tagIndent`.

```jig
{{-- Template --}}
class User {
    @if(hasName)
        public name: string
    @end
}
```

```
// Output — no extra indentation from the @if block:
class User {
    public name: string
}
```

This applies to: `@if`, `@elseif`, `@else`, `@unless`, `@each`, `@component`, `@slot`, `@pushTo`, `@pushOnceTo`

### Include Tag Re-indenting

When `@include` is indented, subsequent lines of the partial are indented to match:

```jig
{{-- partial.jig --}}
const a = 1
const b = 2
return a + b
```

```jig
{{-- main.jig --}}
function setup() {
  @include('partial')
}
```

```
// Output:
function setup() {
  const a = 1
  const b = 2
  return a + b
}
```

## Partials

### @include

Include another template. The partial has access to all parent state including inline variables:

```jig
@include('partials/header')
@include('shared::partials/header')  {{-- from named disk --}}
```

### @includeIf

Conditionally include a partial:

```jig
@includeIf(post.comments.length, 'partials/comments')
```

## Components

Components are reusable templates with isolated props and slots. Store them in a `components/` directory.

### Creating a Component

```jig
{{-- components/function.jig --}}
function {{ name }}({{ params.join(', ') }}) {
@if(body)
  {{ body }}
@end
}
```

### Using Components

Via the `@component` tag:

```jig
@!component('components/function', {
  name: 'greet',
  params: ['name'],
  body: 'return `Hello ${name}`'
})
```

Via tag shorthand (for components in the `components/` directory):

```jig
@!function({
  name: 'greet',
  params: ['name']
})
```

### Filename to Tag Name Conversion

| Template path | Tag name |
|---|---|
| `form/input.jig` | `@form.input` |
| `tool_tip.jig` | `@toolTip` |
| `modal/index.jig` | `@modal` |

### Props API

Inside a component, access props directly by name or via `$props`:

```jig
{{-- Direct access --}}
{{ name }}
{{ type || 'string' }}

{{-- $props API --}}
{{ $props.has('name') }}
{{ $props.get('name') }}
@let(rest = $props.except(['name', 'type']))
@let(merged = $props.merge({ type: 'string' }))
{{ json :: $props.serialize() }}
```

### Slots

Slots are named content outlets. Use `$slots` inside the component:

```jig
{{-- components/card.jig --}}
<div>
  <header>{{ await $slots.header() }}</header>
  <main>{{ await $slots.main() }}</main>
</div>
```

```jig
{{-- Usage --}}
@card()
  @slot('header')
    Card Title
  @end

  Default content goes to main slot
@end
```

The **main slot** is all content between the opening and closing tags that isn't in a named `@slot`.

Components can pass data to slots:

```jig
{{-- Inside component --}}
{{ await $slots.content({ size: cardSize }) }}

{{-- In parent template --}}
@slot('content', componentState)
  Size is {{ componentState.size }}
@end
```

### Layouts

Layouts are just components with slots:

```jig
{{-- components/layout/base.jig --}}
// Auto-generated file
{{ await $slots.imports() }}

{{ await $slots.main() }}
```

```jig
{{-- page.jig --}}
@layout.base()
  @slot('imports')
    import { foo } from './foo'
  @end

  export function main() {}
@end
```

### Provide/Inject

Share state with a component tree without explicit prop passing:

```jig
{{-- Parent component --}}
@let(shared = { items: [] })
@inject(shared)
{{ await $slots.main() }}

{{-- Child component --}}
@eval($context.items.push(newItem))
```

## Stacks

Create deferred content placeholders:

```jig
{{-- In layout --}}
@stack('imports')

{{-- In child templates --}}
@pushTo('imports')
  import { something } from './somewhere'
@end

@pushOnceTo('imports')  {{-- Only pushed once even if component renders multiple times --}}
  import { shared } from './shared'
@end
```

## Global Helpers

Available in all templates:

```jig
{{-- Case transformations --}}
{{ camelCase('hello-world') }}      {{-- helloWorld --}}
{{ snakeCase('hello-world') }}      {{-- hello_world --}}
{{ dashCase('HelloWorld') }}        {{-- hello-world --}}
{{ pascalCase('hello-world') }}     {{-- HelloWorld --}}
{{ capitalCase('hello-world') }}    {{-- Hello-World --}}
{{ sentenceCase('hello-world') }}   {{-- Hello world --}}
{{ dotCase('hello-world') }}        {{-- hello.world --}}
{{ noCase('hello-world') }}         {{-- hello world --}}
{{ titleCase('hello-world') }}      {{-- Hello-World --}}

{{-- String helpers --}}
{{ truncate('long text...', 10) }}
{{ excerpt('<p>HTML content</p>', 20) }}

{{-- Debugging --}}
{{ inspect(someObject) }}
@debugger
```

## Template State Layers

Templates receive data from four layers (in priority order):

| Layer | Shared with components? | How to set |
|---|---|---|
| Globals | Yes | `jig.global('key', value)` |
| Locals | Yes | `renderer.share({ key: value })` |
| Rendering data | No | `jig.render('tpl', data)` |
| Inline variables | No | `@let(x = value)` |

Final state is merged via `Object.assign({}, globals, locals, renderingData)`.

### Reserved Keywords

Never use these as state property names: `template`, `$context`, `state`, `$filename`

## Common Code Generation Patterns

### TypeScript Interface

```jig
export interface {{ name }} {
@each(prop in properties)
  {{ prop.name }}{{ prop.optional ? '?' : '' }}: {{ prop.type }}
@end
}
```

### TypeScript Enum

```jig
export enum {{ name }} {
@each((member, index) in members)
  {{ member.name }}{{ member.value !== undefined ? ` = ${member.value}` : '' }}{{ index < members.length - 1 ? ',' : '' }}
@end
}
```

### Function with JSDoc

```jig
/**
@if(description)
 * {{ description }}
 *
@end
@each(param in params)
 * @param {{ param.name }} {{ param.description || '' }}
@end
@if(returnType)
 * @returns {{ returnDescription || '' }}
@end
 */
{{ isExport ? 'export ' : '' }}{{ isAsync ? 'async ' : '' }}function {{ name }}({{ params.map(p => `${p.name}: ${p.type}`).join(', ') }}){{ returnType ? `: ${returnType}` : '' }} {
  @include('body')
}
```

### GraphQL Schema

```jig
type {{ typeName }} {
@each(field in fields)
  {{ field.name }}{{ field.args ? `(${field.args})` : '' }}: {{ field.type }}{{ field.required ? '!' : '' }}
@end
}
```

### SQL Table

```jig
CREATE TABLE {{ tableName }} (
@each((col, index) in columns)
  {{ col.name }} {{ col.type }}{{ col.nullable ? '' : ' NOT NULL' }}{{ col.default ? ` DEFAULT ${col.default}` : '' }}{{ index < columns.length - 1 ? ',' : '' }}
@end
);
```

### YAML Config

```jig
{{ key }}:
@each((value, subKey) in config)
  {{ subKey }}: {{ json :: value }}
@end
```

### Import Block (with deduplication)

```jig
@each(imp in imports)
import {{ imp.isDefault ? imp.name : `{ ${imp.names.join(', ')} }` }} from '{{ imp.from }}'
@end
```

### Component Composition (layout + partials)

```jig
{{-- components/layout/module.jig --}}
{{-- File header --}}
/**
 * Auto-generated by Jig
 * Do not edit manually
 */

{{ await $slots.imports() }}

{{ await $slots.main() }}
```

```jig
{{-- generate-model.jig --}}
@layout.module()
  @slot('imports')
    import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
  @end

  @Entity()
  export class {{ name }} {
    @PrimaryGeneratedColumn()
    id: number

  @each(field in fields)
    @Column({{ json :: field.options }})
    {{ field.name }}: {{ field.type }}

  @end
  }
@end
```

## Anti-Patterns to Avoid

1. **Never use `safe()`** — It doesn't exist in Jig. All output is raw.
2. **Never use `html.attrs()`, `html.classNames()`, or `nl2br()`** — HTML helpers are removed.
3. **Never use `$props.toAttrs()`** — Removed. Use `$props.serialize()` with `json` filter.
4. **Don't manually manage indentation in block tags** — Jig handles dedenting automatically.
5. **Don't put content on the same line as a tag** — Tags must be on their own line.
6. **Don't use `@set()`** — Removed. Use `@let()` and `@assign()`.

## Syntax Validity Rules

| Invalid | Valid |
|---|---|
| `@if (x)` (space before paren) | `@if(x)` |
| `@if(x) content @endif` (inline) | `@if(x)\n  content\n@end` |
| `@! component('x')` (space after !) | `@!component('x')` |
| `@component\n('x')` (split line) | `@component('x')` |
| `{ { x } }` (spaces in braces) | `{{ x }}` |
