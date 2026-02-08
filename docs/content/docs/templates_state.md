---
summary: Learn about different APIs to define template state
---

# Templates state

Templates state refers to the data the templates can access during their rendering phase. Jig provides four layers to pass or define the template state.

## Globals

The globals refer to the state defined using the `jig.global` method. Globals are available to all the templates, including components.

For example, you can use globals to share configuration with all the templates.

```ts
jig.global('config', {
  defaultType: 'string',
  indent: 2,
  exportKeyword: 'export'
})
```

```edge
{{ config.exportKeyword }} interface User {
  id: {{ config.defaultType }}
}
```

You can also share classes, functions, and almost every JavaScript data-type as global properties.

```ts
jig.global('getTypeDefinition', async function (name) {
  return TypeRegistry.find(name)
})
```

```edge
@let(typedef = await getTypeDefinition('User'))
{{ typedef.toTypeScript() }}
```

## Locals

The `locals` are similar to the global state but isolated between multiple render calls.

In the following example, we use the `jig.createRenderer` method to create multiple children instances of Jig and share separate data objects with them.

The data will be available globally to all the templates included as partials or components, but not with the isolated children instances.

```ts
const renderer1 = jig.createRenderer()
const renderer2 = jig.createRenderer()

renderer1.share({
  namespace: 'Models',
})

renderer2.share({
  namespace: 'Controllers',
})

await renderer1.renderRaw('export namespace {{ namespace }} {}') // export namespace Models {}
await renderer2.renderRaw('export namespace {{ namespace }} {}') // export namespace Controllers {}
```

### Why use locals?

You might be thinking, why create a new isolated instance and use the `.share()` method to share locals with a template when you can pass the data during the `.render()` method call?

:::caption{for="info"}

**Why this?**

:::

```ts
const renderer = jig.createRenderer().share({
  namespace: 'Models'
})

await renderer.render('template-path')
```

:::caption{for="info"}

**And not this?**

:::

```ts
await jig.render('template-path', {
  namespace: 'Models'
})
```

Let's use a concrete example and understand when locals can be helpful.

Imagine you're building a code generator that processes multiple entities in parallel, and each entity needs its own isolated context. You can create a new instance of the Jig renderer for each entity and use the `share` method to share data that's isolated between concurrent generation tasks.

```ts
async function generateModel(entity) {
  const renderer = jig.createRenderer()
  renderer.share({
    namespace: entity.namespace,
    imports: entity.dependencies
  })

  return await renderer.render('model', { entity })
}

// Generate multiple models concurrently
await Promise.all(entities.map(generateModel))
```

## Rendering data object

The rendering data refers to the data object passed when calling the `jig.render` method. The rendering data is not shared with the components used by a template.

```ts
const renderingData = {}
await jig.render('template-path', renderingData)
```

## Inline variables

Inline variables are defined within the template as let variables. You can define inline variables using the `@let` tag and re-assign them new values using the `@assign` tag.

```edge
@let(config = await loadConfig())

{{ config.someKey }}
```

The scope of inline variables is similar to a let variable in JavaScript. Let's consider the following example, in which we mutate an inline variable inside an `each` loop.

```edge
// highlight-start
{{-- Define variable --}}
@let(total = 0)
// highlight-end

<ul>
  @each(item in items)
    // highlight-start
    {{-- Re-assign it a new value --}}
    @assign(total = total + item.price)
    // highlight-end
    <li> {{ item.name }} = {{ item.price }} </li>
  @end

  <li> Gross total = {{ total }} </li>
<ul>
```

## Data layers and their scope

The final template state is a merged copy of all the layers created using `Object.assign`. Therefore, the layer with top most priority will overwrite the values from the previous layers.

```ts
// title: Pseudocode
const finalState = Object.assign(
  {},
  globals,
  locals,
  renderingData
)
```

| Name | Shared with components? | Isolated? |
|----------|------------------------|----------|
| Globals | ✅ | ❌ |
| Locals | ✅ | ✅ |
| Rendering data object | ❌ | ✅ |
| Inline variables | ❌ | ✅ |
