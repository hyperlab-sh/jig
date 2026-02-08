---
summary: Learn how to pass props to components in Jig
---

# Props

Props are the primary way to share data with a component when rendering it. A component can accept any props without maintaining a list of allowed props.

```edge
// title: templates/components/function.edge
function {{ name }}({{ params.join(', ') }}) {
@if(returnType)
  return {{ defaultReturnValue || 'null' }}
@end
}
```

Let's render the `function` component and pass it some props.

```edge
@!function({
  name: 'calculateTotal',
  params: ['items', 'tax'],
  returnType: 'number',
  defaultReturnValue: '0'
})

@!function({
  name: 'logMessage',
  params: ['message']
})
```

## Props API

Following is the list of methods available on the `$props` object.

### has

Find if a given prop exists.

```edge
{{ $props.has('returnType') }}
```

### get

Get value for a given prop.

```edge
{{ $props.get('name') }}
```

### only

Get a new props object with only the mentioned keys.

```edge
@let(essentialProps = $props.only(['name', 'params']))
{{ essentialProps.get('name') }}
```

### except

Get a new props object except for the mentioned keys.

```edge
@let(nonInternalProps = $props.except(['_internal', '_debug']))
```

### merge/mergeIf/mergeUnless

Merge custom properties with the props values. The props values have priority over custom properties.

In the following example, the value of the `returnType` property will be `void` unless an explicit value is provided at the time of rendering the component.

```edge
@let(allProps = $props.merge({ returnType: 'void' }))
function {{ allProps.get('name') }}(): {{ allProps.get('returnType') }} {}
```

### serialize

Get a plain JavaScript object with all props. Useful for passing props to other components or JSON output.

```edge
{{ json :: $props.serialize() }}
```
