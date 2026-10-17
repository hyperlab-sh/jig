# Jig

Jig is a fork of [Edge](https://edgejs.dev) — the template engine behind [AdonisJS](https://adonisjs.com) — purpose-built for code generation. It strips away HTML escaping and HTML-specific helpers, adds implicit indentation control and filter syntax, and keeps components, slots, partials, and full JavaScript expressions. If you know JavaScript, you know Jig.

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@jig-lang/lexer` | [packages/lexer](packages/lexer) | Tokenizer for Jig templates |
| `@jig-lang/parser` | [packages/parser](packages/parser) | Parser that compiles tokens to JavaScript |
| `@jig-lang/jig` | [packages/jig](packages/jig) | The template engine |
| `jig` (VS Code) | [packages/vscode](packages/vscode) | VS Code extension: syntax highlighting and snippets |
| `@jig-lang/docs` | [docs](docs) | Documentation website (private) |

## Development

This is a [Bun](https://bun.sh) workspace.

```bash
bun install            # install and link all packages
bun run build          # build lexer, parser, jig
bun run quick:test     # run all test suites
bun run lint
bun run typecheck
bun run test:jig       # one package: test:lexer, test:parser, test:jig, test:vscode
```

See [CLAUDE.md](CLAUDE.md) for architecture and conventions.
