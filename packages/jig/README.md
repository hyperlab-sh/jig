<p align="center">
  <img src="logo.png" width="128" alt="Jig logo" />
</p>

# Jig

[![gh-workflow-image]][gh-workflow-url] [![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

A template engine purpose-built for code generation. Fork of [Edge](https://edgejs.dev).

## What is Jig?

Jig is a fork of [Edge](https://edgejs.dev) — the template engine behind [AdonisJS](https://adonisjs.com) — purpose-built for code generation. It strips away HTML escaping and HTML-specific helpers, adds implicit indentation control and filter syntax, and keeps everything else that makes Edge great: components, slots, partials, and full JavaScript expressions.

If you know JavaScript, you know Jig. Use familiar control flow (`@if`, `@each`, `@component`), interpolation (`{{ }}`), and add custom filters for transformations.

## Key Differences from Edge

- **No HTML escaping** — `{{ value }}` outputs raw values without any escaping
- **No HTML helpers** — `html.attrs`, `html.classNames`, `nl2br`, and other HTML-specific utilities are removed
- **Filter syntax** — `{{ mode :: expr }}` applies registered filters to expressions
- **No `safe()` function** — Unnecessary since all output is raw

## Quick Example

Generate TypeScript interfaces from a data structure:

```edge
export interface {{ interfaceName }} {
  @each(field in fields)
    {{ field.name }}: {{ field.type }};
  @end
}
```

With data:

```json
{
  "interfaceName": "User",
  "fields": [
    { "name": "id", "type": "number" },
    { "name": "email", "type": "string" }
  ]
}
```

Outputs:

```typescript
export interface User {
  id: number;
  email: string;
}
```

## Installation

Using npm:
```bash
npm i @jig-lang/jig
```

Using bun:
```bash
bun add @jig-lang/jig
```

## Documentation

Full documentation is available at [https://jig.saulo.engineer](https://jig.saulo.engineer)

## Built on Edge

Jig is forked from [Edge](https://edgejs.dev), the template engine created by the [AdonisJS](https://adonisjs.com) team. We thank them for building such a solid foundation.

## License

MIT

---

[gh-workflow-image]: https://img.shields.io/github/actions/workflow/status/hyperlab-sh/jig/checks.yml?style=for-the-badge
[gh-workflow-url]: https://github.com/hyperlab-sh/jig/actions/workflows/checks.yml "Github action"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: https://www.typescriptlang.org "typescript"

[npm-image]: https://img.shields.io/npm/v/@jig-lang/jig?color=blue&style=for-the-badge
[npm-url]: https://www.npmjs.com/package/@jig-lang/jig "npm"

[license-image]: https://img.shields.io/npm/l/@jig-lang/jig?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md 'license'

[npm-image]: https://img.shields.io/npm/v/jig.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/jig 'npm'
