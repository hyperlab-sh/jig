---
summary: Get started by installing Jig inside an existing Node.js project
---

# Getting started

You may install Jig inside an existing Node.js project from the npm packages registry.

:::warning

Jig is an ESM-only package, and therefore your applications must use ES modules to import the package.

:::

```sh
npm i jig
```

You can start using Jig as soon as you install it. You do not need any compiler or build tools to compile the templates.

Let's start with the following project structure. We will store templates within the `templates` directory and use them to generate TypeScript interfaces.

```ts
.
├── templates
│  └── interface.edge
├── index.js
└── package.json
```

```ts
// title: index.js
import { Edge } from 'jig'

// highlight-start
const jig = Edge.create()
jig.mount(new URL('./templates', import.meta.url))
// highlight-end

// highlight-start
const data = {
  name: 'User',
  properties: [
    { name: 'id', type: 'number' },
    { name: 'username', type: 'string' },
    { name: 'email', type: 'string' }
  ]
}

const output = await jig.render('interface', data)
console.log(output)
// highlight-end
```

```edge
// title: templates/interface.edge
export interface {{ name }} {
@each(prop in properties)
  {{ prop.name }}: {{ prop.type }}
@end
}
```

Let's go through the source code line by line.

- We start by importing the `jig` package. Note: the class is still called `Edge` internally, but the package name is `jig`.

- We use the `jig.mount` method to register the `templates` directory as the root for our templates. Template files end with the `.edge` extension.

- Finally, we use the `jig.render` method to render a template. The render method accepts the template path (without the extension) and the data object to share with the template.

## Caching templates

The templates are re-compiled whenever you call the `jig.render` method. You can verify this by editing the `interface.edge` file and re-running the script to see the modified output.

You must enable the cache mode in production to avoid re-compiling the templates. The compiled output will be saved within the memory.

```js
const jig = Edge.create({
  cache: process.env.NODE_ENV === 'production'
})
```

## Mounting disks

Jig uses the concept of disks to find and render templates from the local filesystem. You can register one default disk and multiple named disks to lookup templates.

In the following example, we register the `templates` directory as the default disk for finding templates.

```ts
const BASE_URL = new URL('./', import.meta.url)

jig.mount(new URL('templates', BASE_URL))

/**
 * Render interface.edge file from
 * {BASE_URL/templates} directory
 */
await jig.render('interface')

/**
 * Render models/user.edge file from
 * {BASE_URL/templates} directory
 */
await jig.render('models/user')
```

You can also mount multiple named disks, which can be helpful if you have multiple template collections.

```ts
const BASE_URL = new URL('./', import.meta.url)

jig.mount(
  'typescript',
  new URL('templates/typescript', BASE_URL)
)

jig.mount(
  'graphql',
  new URL('templates/graphql', BASE_URL)
)

jig.mount(
  'sql',
  new URL('templates/sql', BASE_URL)
)
```

Now you can render templates by prefixing the disk name before the template path. For example:

```ts
await jig.render('typescript::interface')
await jig.render('graphql::schema')
```

## In-memory templates

You can register templates that are kept within memory using the `.registerTemplate()` method. It accepts a unique name for the template as the first argument and the template contents via the options parameter.

```ts
jig.registerTemplate('code.function', {
  template: `function {{ name }}({{ params.join(', ') }}) {
  // TODO: implement
}`
})
```

Now, you can reference the above template as a component inside any other template.

```edge
@!component('code.function', {
  name: 'calculateTotal',
  params: ['items', 'taxRate']
})
```

## Rendering API

You can render Jig templates using one of the following methods.

### render

The `render` method accepts the template path relative to the disk root and an optional data object to share with the template.

The return value is a string output of the rendered template.

```ts
const output = await jig.render('interface')
console.log(output)
```

### renderSync

The `renderSync` method is similar to the `render`. However, it uses synchronous APIs under the hood to read and render the template files.

We recommend using the `render` method over the `renderSync` method.

```ts
const output = jig.renderSync('interface')
console.log(output)
```

### renderRaw

The `renderRaw` method allows you to render raw text as a template.

```ts
const template = `
export interface {{ name }} {
  id: number
}
`

await jig.renderRaw(template, { name: 'User' })
```

### renderRawSync

The `renderRawSync` method is the same as `renderRaw` but uses synchronous APIs under the hood.

```ts
const template = `
export interface {{ name }} {
  id: number
}
`

jig.renderRawSync(template, { name: 'User' })
```

## Reserved keywords

The internals of compiled template relies on the following variables, and you must not define them as template state.

- `template`
- `$context`
- `state`
- `$filename`
