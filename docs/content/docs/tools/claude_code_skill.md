---
summary: Claude Code skill for writing Jig templates — install it to teach Claude how to generate correct Jig template syntax
---

# Claude Code Skill

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that teaches Claude how to write Jig templates. Once installed, Claude can generate correct Jig syntax for code generation templates — TypeScript interfaces, GraphQL schemas, SQL tables, configuration files, and more.

The skill provides Claude with complete knowledge of Jig's syntax, tags, filters, components, implicit indentation control, and common code generation patterns.

## Installation

**For all projects** (recommended):

```sh
mkdir -p ~/.claude/skills/jig-templates
curl -fsSL https://raw.githubusercontent.com/svallory/jig-docs/main/.claude/skills/jig-templates/SKILL.md \
  -o ~/.claude/skills/jig-templates/SKILL.md
```

**For a single project:**

```sh
mkdir -p .claude/skills/jig-templates
curl -fsSL https://raw.githubusercontent.com/svallory/jig-docs/main/.claude/skills/jig-templates/SKILL.md \
  -o .claude/skills/jig-templates/SKILL.md
```

Once installed, invoke the skill with `/jig-templates` in Claude Code, or Claude will activate it automatically when working with `.jig` files.

## What the Skill Covers

The skill teaches Claude the complete Jig template syntax:

- **Interpolation** — `{{ expression }}` with raw output (no HTML escaping)
- **Tags** — `@if`, `@each`, `@unless`, `@let`, `@assign`, `@eval`, `@include`, `@component`, and more
- **Filter syntax** — `{{ filterName :: expression }}` for output transformation
- **Implicit indentation control** — Automatic dedenting in block tags and re-indenting in includes
- **Components** — Props, slots, layouts, provide/inject, tag shorthand
- **Stacks** — `@stack`, `@pushTo`, `@pushOnceTo` for deferred content
- **Global helpers** — Case transformation functions (`camelCase`, `snakeCase`, `pascalCase`, etc.)
- **Code generation patterns** — TypeScript, GraphQL, SQL, YAML, and more
- **Anti-patterns** — Common mistakes to avoid when coming from Edge.js

## Skill Content

Below is the full content of the skill file. You can also copy it directly from here.

````yaml
---
name: jig-templates
description: Write Jig templates for code generation. Use when creating or modifying .edge/.jig template files, when the user asks about Jig template syntax, or when generating code templates for TypeScript, GraphQL, SQL, YAML, or other structured text formats.
allowed-tools: Read, Glob, Grep, Write, Edit
argument-hint: [description or file-path]
---
````

````md
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
@each(item in items)
  {{ item.name }}
@end

@each((item, index) in items)
  {{ index }}: {{ item.name }}
@end

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
{{ json :: { name: 'User', id: 1 } }}

{{ upper :: username }}
{{ quote :: fieldName }}
```

Filters chain left-to-right:

```jig
{{ upper :: quote :: 'hello' }}
```

Registering custom filters in JavaScript:

```ts
jig.registerFilter('upper', (value) => String(value).toUpperCase())
jig.registerFilter('quote', (value) => `"${value}"`)
```

## Implicit Indentation Control

This is Jig's killer feature for code generation. It works automatically.

### Block Tag Dedenting

Content inside block tags is automatically dedented based on the tag's indent position. The formula is: `dedent = firstContentLineIndent - tagIndent`.

```jig
class User {
    @if(hasName)
        public name: string
    @end
}
```

Output (no extra indentation from the @if block):

```
class User {
    public name: string
}
```

This applies to: `@if`, `@elseif`, `@else`, `@unless`, `@each`, `@component`, `@slot`, `@pushTo`, `@pushOnceTo`

### Include Tag Re-indenting

When `@include` is indented, subsequent lines of the partial are indented to match:

```jig
function setup() {
  @include('partial')
}
```

If `partial.jig` contains `const a = 1\nconst b = 2\nreturn a + b`, the output is:

```
function setup() {
  const a = 1
  const b = 2
  return a + b
}
```

## Partials

### @include

Include another template. The partial has access to all parent state:

```jig
@include('partials/header')
@include('shared::partials/header')
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

### Props API

Inside a component, access props directly by name or via `$props`:

```jig
{{ name }}
{{ type || 'string' }}

{{ $props.has('name') }}
{{ $props.get('name') }}
@let(rest = $props.except(['name', 'type']))
@let(merged = $props.merge({ type: 'string' }))
{{ json :: $props.serialize() }}
```

### Slots

Slots are named content outlets. Use `$slots` inside the component:

```jig
<div>
  <header>{{ await $slots.header() }}</header>
  <main>{{ await $slots.main() }}</main>
</div>
```

```jig
@card()
  @slot('header')
    Card Title
  @end

  Default content goes to main slot
@end
```

Components can pass data to slots:

```jig
{{ await $slots.content({ size: cardSize }) }}
```

```jig
@slot('content', componentState)
  Size is {{ componentState.size }}
@end
```

### Layouts

Layouts are just components with slots:

```jig
{{ await $slots.imports() }}

{{ await $slots.main() }}
```

```jig
@layout.base()
  @slot('imports')
    import { foo } from './foo'
  @end

  export function main() {}
@end
```

### Provide/Inject

Share state with a component tree:

```jig
@let(shared = { items: [] })
@inject(shared)
{{ await $slots.main() }}
```

```jig
@eval($context.items.push(newItem))
```

## Stacks

Create deferred content placeholders:

```jig
@stack('imports')

@pushTo('imports')
  import { something } from './somewhere'
@end

@pushOnceTo('imports')
  import { shared } from './shared'
@end
```

## Global Helpers

```jig
{{ camelCase('hello-world') }}
{{ snakeCase('hello-world') }}
{{ dashCase('HelloWorld') }}
{{ pascalCase('hello-world') }}
{{ capitalCase('hello-world') }}
{{ sentenceCase('hello-world') }}
{{ dotCase('hello-world') }}
{{ noCase('hello-world') }}
{{ titleCase('hello-world') }}

{{ truncate('long text...', 10) }}
{{ excerpt('<p>HTML content</p>', 20) }}

{{ inspect(someObject) }}
@debugger
```

## Template State Layers

| Layer | Shared with components? | How to set |
|---|---|---|
| Globals | Yes | `jig.global('key', value)` |
| Locals | Yes | `renderer.share({ key: value })` |
| Rendering data | No | `jig.render('tpl', data)` |
| Inline variables | No | `@let(x = value)` |

Reserved keywords: `template`, `$context`, `state`, `$filename`

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
````
