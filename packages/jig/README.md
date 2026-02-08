# Jig

[![gh-workflow-image]][gh-workflow-url] [![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

A template engine for code generation, built on the Edge.js foundation.

## What is Jig?

Jig is a fork of [Edge.js](https://github.com/edge-js/edge) that strips away HTML-specific functionality and optimizes the engine for code generation. It inherits Edge.js's syntax (powered by `edge-lexer` and `edge-parser`) while removing all escaping and HTML helpers, making it ideal for generating code, configuration files, SQL, and other text-based formats.

If you know JavaScript, you know Jig. Use familiar control flow (`@if`, `@each`, `@component`), interpolation (`{{ }}`), and add custom filters for transformations.

## Key Differences from Edge.js

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
npm i jig
```

Using bun:
```bash
bun add jig
```

## Documentation

Full documentation is available at [https://jig.saulo.engineer](https://jig.saulo.engineer)

## Built on Edge.js

Jig is forked from [Edge.js](https://github.com/edge-js/edge), an excellent template engine created by the [AdonisJS](https://adonisjs.com) team. We thank them for building such a solid foundation.

## License

MIT

---

[gh-workflow-image]: https://img.shields.io/github/actions/workflow/status/edge-js/edge/checks.yml?style=for-the-badge
[gh-workflow-url]: https://github.com/edge-js/edge/actions/workflows/checks.yml "Github action"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"

[license-image]: https://img.shields.io/npm/l/jig?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md 'license'

[npm-image]: https://img.shields.io/npm/v/jig.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/jig 'npm'
