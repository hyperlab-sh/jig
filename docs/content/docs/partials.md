---
summary: Partials are reusable templates with access to the state of the parent template
---

# Partials

Partials are markup fragments created to reuse them across different templates. Partials have access to all the data available to the parent template, including [inline variables](./templates_state.md#inline-variables).

You may include a partial inside a template using the `@include` tag. The tag accepts the relative path to the template file.

```edge
@include('partials/header')

<main>
  The main content goes here
</main>

@include('partials/footer')
```

You may include partials from other disks by prefixing the disk name before the template path.

```edge
@include('shared::partials/header')
@include('shared::partials/footer')
```

## Indentation handling

When an `@include` tag is indented, Jig automatically indents subsequent lines of the partial's output to match. The first line of output appears at the tag's position, and all following lines receive the same indentation prefix.

```edge
// title: main.edge
function setup() {
  @include('body')
}
```

```edge
// title: body.edge
const a = 1
const b = 2
return a + b
```

```
// title: Output
function setup() {
  const a = 1
  const b = 2
  return a + b
}
```

This is automatic — no configuration is needed. If the `@include` tag has no leading whitespace, no extra indentation is added.

## Include conditionally

You may use the `@includeIf` method to conditionally include partials when a given statement returns `true`. For example:

```edge
@includeIf(post.comments.length, 'partials/comments')
```
