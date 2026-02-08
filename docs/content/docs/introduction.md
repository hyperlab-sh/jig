---
summary: Jig is a template engine for code generation in Node.js, forked from Edge
---

# Introduction

Jig is a template engine for Node.js purpose-built for **code generation**. It is a fork of [Edge](https://edgejs.dev) — the template engine behind [AdonisJS](https://adonisjs.com) — with HTML-specific features stripped out and new capabilities like implicit indentation control and filter syntax added in. If you know JavaScript, you know Jig.

<div class="feature_highlight">

```edge
Hello {{ user.username }}!
```

::include{template="partials/features/hello_world"}

</div>


<div class="feature_highlight">

```edge
{{ user.subscription?.plan || 'Not subscribed' }}
```

::include{template="partials/features/js_expressions"}

</div>

<div class="feature_highlight">

```edge
@let(payments = await user.getPayments())
You have made {{ payments.length }} payments so far.
```

::include{template="partials/features/async_await"}

</div>

<div class="feature_highlight">

```edge
@if(user.hasSubscription)
  Hurray! You have access to over 280 videos.
@else
  Videos are available only to subscribers.
@end
```

::include{template="partials/features/conditionals"}

</div>

<div class="feature_highlight">

```edge
@each(comment in post.comments)
  @include('partials/comment')
@end
```

::include{template="partials/features/loops"}

</div>

<div class="feature_highlight">

```edge
@accordion()
  @accordion.item({ title: 'What is Jig?' })
    Jig is a template engine for code generation
  @end

  @accordion.item({ title: 'Why should I use Jig?' })
    Because you need a template engine 🤷🏻‍♂️
  @end

  @accordion.item({ title: 'How can I contribute?' })
    By opening issues and PRs on Github
  @end
@end
```

::include{template="partials/features/components"}

</div>

## Why another template engine?

Edge has powered AdonisJS for almost seven years and is battle-tested. Jig inherits that foundation and adapts it for code generation — where you need clean, predictable output without HTML baggage.

### Differences from Edge

Jig is specifically optimized for code generation, not HTML rendering:

- **No HTML escaping**: `{{ }}` outputs raw values. There's no automatic HTML escaping since you're generating code, not HTML.
- **Implicit indentation control**: Block tag content is automatically dedented, and `@include` re-indents partial output. Clean output without manual whitespace management.
- **Filter syntax**: New `{{ mode :: expr }}` syntax for output transformation. Built-in `json` filter with extensible `registerFilter` API.
- **No HTML-specific helpers**: Removed `html.attrs`, `html.classNames`, `nl2br`, and other HTML utilities.
- **Same powerful syntax**: Inherits Edge's lexer and parser, so you still get `.edge` file syntax, components, slots, and all the features you know.

### Key Features

- Not restrictive — write any JavaScript expression inside templates.
- Accurate error stack pointing to the original source file and line.
- Simple mental model — no custom dialect to learn.
- **Implicit indentation control** — block tags automatically strip cosmetic indentation, and include tags re-indent partial output. Template nesting doesn't pollute output formatting.
- Components layer with support for slots and provide/inject API.
- Extensible API. 80% of Jig features are implemented using the public API.
- Filter syntax for custom output transformations.

## Why should I use Jig?

If you're building code generators, scaffolding tools, or any system that needs to output structured text (TypeScript, GraphQL schemas, configuration files, etc.), Jig provides a clean template syntax without the overhead of HTML-specific features.

## Next steps

- Start with the [Getting Started](./getting_started.md) guide.
- Read the [Syntax specification](./syntax_specification.md) guide to understand the Jig templating syntax better.
