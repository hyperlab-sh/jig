---
summary: Learn how to embed JavaScript expression alongside raw text
---

# Interpolation

Interpolation refers to embedding the output of JavaScript expressions alongside the raw text markup. Jig uses double curly braces `{{ }}` as delimiters. 

```edge
Hello {{ username }}!
```

Given the username is `Virk`. The output will be

```
Hello Virk!
```

You can use any valid [JavaScript expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#expressions) inside the curly braces, and Jig will evaluate it for you.

```edge
{{ user.username }}
{{ user.username.toUpperCase() }}
{{ (2 + 2) * 3 }}
{{ (await getUser()).username }}
```

## Multiline expressions

Expressions can also span across multiple lines. For example:

```edge
Hello {{
  users.map((user) => {
    return user.username
  })
}}
```

When writing multiline expressions, ensure the double curly braces are in the same line.

<table>

<thead>
<tr>
<th>
Invalid ❌
</th>

<th>
Valid ✅
</th>
</tr>
</thead>

<tbody>

<tr>
<td>

```edge
{
{
  users.map((user) => {
    return user.username
  })
}}
```

```edge
{{
  users.map((user) => {
    return user.username
  })
}
}
```

</td>
<td>

```edge
{{
  users.map((user) => {
    return user.username
  })
}}
```

</td>
</tr>

</tbody>

</table>


## Stringified output

Since the output of a template is always a `string`, the output of a JavaScript expression is also converted to a string by wrapping the output inside the [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/String#return_value) function.

Given the following expression

```edge
// title: Expression
{{
  users.map((user) => {
    return user.username
  })
}}
```

The JavaScript output will be

```ts
// title: JavaScript output code
String(users.map((user) => {
  return user.username
}))
```

The stringified output will be

```txt
// title: Output
virk,romain,julien,michael
```

If you do not want to rely on the default behavior, you can self-convert the array to a string using the JavaScript `Array.join` method.

```edge
Hello {{
  users.map((user) => {
    return user.username
  }).join(', ')
}}
```

## Filter syntax

Jig supports a filter syntax for transforming output. Use `{{ mode :: expression }}` where `mode` is a registered filter name.

```edge
{{ json :: { name: 'User', id: 1 } }}
```

Output:

```
{"name":"User","id":1}
```

The built-in `json` filter outputs JSON. You can register custom filters using `jig.registerFilter`:

```ts
jig.registerFilter('upper', (value) => String(value).toUpperCase())
```

```edge
{{ upper :: username }}
```

## Skipping curly braces from evaluation

If you are using Jig to generate code that includes double curly braces (e.g., generating templates for other systems), you can instruct Jig to skip certain statements by prefixing the braces with the `@` symbol.

```edge
{{-- Input -- }}
Jig should not parse @{{ username }}

{{-- Output -- }}
Jig should not parse {{ username }}
```
