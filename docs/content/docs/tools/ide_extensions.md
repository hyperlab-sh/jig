---
summary: Jig IDE extension — syntax highlighting, embedded languages, and editor features
---

# IDE Extensions

The Jig extension provides syntax highlighting for `.jig` template files with full support for embedded language blocks. It is available for VS Code and compatible editors.

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=svallory.jig) or click a button below to install directly in your editor:

<style>
  .ide-buttons { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin: 24px 0; }
  .ide-btn { display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; border-radius: 8px; color: #fff !important; text-decoration: none !important; font-size: 16px; font-weight: 500; transition: opacity 0.2s; }
  .ide-btn:hover { opacity: 0.85; text-decoration: none !important; }
</style>
<div class="ide-buttons">
  <a href="vscode:extension/svallory.jig" class="ide-btn" target="_blank" style="background: #0066B8;">
    <svg id="Camada_1" version="1.1" height="24" fill="transparent" viewBox="4 4 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <style type="text/css"> .st0{fill:#FFFFFF;} </style>
      <path class="st0" d="M26,24l-4.9,2l-8.1-8l-5.1,4l-2-1V11l2-1l5.1,4l8-8L26,8V24z M15.7,16l5.3,4.1l0,0v-8.3L15.7,16L15.7,16z   M7.9,19.1L7.9,19.1L11,16l-3-3.1l0,0L7.9,19.1L7.9,19.1z"/>
    </svg>
    Install in VS Code
  </a>
  <a href="cursor:extension/svallory.jig" class="ide-btn" target="_blank" style="background: #000;">
    <svg width="24" height="24" viewBox="85 89 343 334" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M255.4 423l149-83.5L255.4 256l-149 83.5 149 83.5z" fill="url(#cp0)"/><path d="M404.4 339.5v-167L255.4 89v167l149 83.5z" fill="url(#cp1)"/><path d="M255.4 89l-149 83.5v167l149-83.5V89z" fill="url(#cp2)"/><path d="M404.4 172.5L255.4 423V256l149-83.5z" fill="#E4E4E4"/><path d="M404.4 172.5L255.4 256l-149-83.5h298z" fill="#fff"/><defs><linearGradient id="cp0" x1="255.4" y1="256" x2="255.4" y2="423" gradientUnits="userSpaceOnUse"><stop offset=".16" stop-color="#fff" stop-opacity=".39"/><stop offset=".66" stop-color="#fff" stop-opacity=".8"/></linearGradient><linearGradient id="cp1" x1="404.4" y1="173" x2="257.5" y2="261.5" gradientUnits="userSpaceOnUse"><stop offset=".18" stop-color="#fff" stop-opacity=".31"/><stop offset=".72" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="cp2" x1="255.4" y1="89" x2="112.3" y2="342.8" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".6"/><stop offset=".67" stop-color="#fff" stop-opacity=".22"/></linearGradient></defs></svg>
    Install in Cursor
  </a>
  <a href="windsurf:extension/svallory.jig" class="ide-btn" target="_blank" style="background: #0DB39E;">
    <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M507.3 106.8h-4.9a46.7 46.7 0 00-46.5 46.8v104.8c0 20.9-17.2 37.9-37.5 37.9a38.8 38.8 0 01-31.4-16.5L280.9 127a46.9 46.9 0 00-38.6-20.3c-24.2 0-46 20.7-46 46.4v105.4c0 20.9-17 37.9-37.5 37.9-12.2 0-24.2-6.2-31.4-16.5L8.7 108.8C6 104.9 0 106.8 0 111.5v91.4c0 4.6 1.4 9.1 4 12.9l116.8 168.3c6.9 9.9 17.1 17.3 28.8 20 29.4 6.7 56.4-16.1 56.4-45.2V253.7c0-20.9 16.8-37.9 37.5-37.9h.1c12.5 0 24.2 6.1 31.4 16.5l106.1 152.8a45.9 45.9 0 0038.6 20.3c24.7 0 45.9-20.8 45.9-46.4V253.6c0-20.9 16.8-37.9 37.5-37.9h4.1c2.6 0 4.7-2.1 4.7-4.7v-99.6a4.7 4.7 0 00-4.7-4.7z" fill="#fff"/></svg>
    Install in Windsurf
  </a>
  <a href="antigravity:extension/svallory.jig" class="ide-btn" target="_blank" style="background: radial-gradient(120px 70px at top left, #00B95C, transparent), radial-gradient(100px 50px at top right, #FC413D, transparent), #749BFF;">
    <svg width="24" height="24" viewBox="40 40 320 320" xmlns="http://www.w3.org/2000/svg"><path d="M224 101c.9.6.9.6 1.8 1.3 12.7 10 19.6 27.2 24.9 42.1 1 2.9 2.1 5.7 3.3 8.6 1.6 4.1 2.9 8.3 4.1 12.5.2.7.4 1.5.7 2.2 1.8 6.1 3.5 12.2 5.3 18.2.3.9.6 1.9.8 2.9.3 1 .6 1.9.8 2.9.4 1.4.4 1.4.8 2.9.6 1.9 1.1 3.9 1.7 5.8 7.1 25.1 7.1 25.1 16.5 49.3.4 1 .9 2 1.3 3 5.6 12.5 11.9 22.8 21.3 32.7 4.2 4.5 8.1 8.9 9.1 15.1-.6 2.9-1.2 3.9-3.6 5.6-4 2-8.8 1.7-13 .4-6-2.8-11-7.1-16-11.4-.8-.6-1.6-1.3-2.4-1.9-15.5-13-25.4-31.4-35.3-48.7-8.4-14.7-17.6-28.7-34.3-34.3-10.6-2.6-22.7-1.7-32.5 3.3-14.4 9-22.3 23.8-30.4 38.2-8 14.2-16.7 26.9-28.1 38.6-.6.7-1.1 1.3-1.8 2-5.8 6.4-16.1 14.5-24.8 15.2-1 0-2 0-3 .1-1 0-2 .1-3 .1-2.6-.3-2.6-.3-4.4-1.7-1.2-1.6-1.2-1.6-1.8-4.3 1.1-6.6 5.5-11.5 10.3-16 23.5-22.8 32.6-60.8 40.5-91.3 21-80.9 21-80.9 47.9-97.3 13.7-7.4 30.7-4.6 42.9 0z" fill="#fff"/></svg>
    Install in Antigravity
  </a>
  <a href="kiro:extension/svallory.jig" class="ide-btn" target="_blank" style="background: #8845F4;">
    <svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M6.6.0A7 7 0 00.7 3.9a7 7 0 00-.7 2.8C0 6.9 0 9.9 0 16.2c0 8.7 0 9.3 0 9.5.1.9.3 1.7.7 2.4a6.9 6.9 0 003.2 3.1c.7.4 1.5.6 2.4.7.2 0 .8 0 9.7 0 8.9 0 9.5 0 9.7 0 .9-.1 1.7-.3 2.4-.7a6.9 6.9 0 003.1-3.2c.4-.7.6-1.5.7-2.4 0-.2 0-.8 0-9.7 0-10 0-9.5-.1-10a7 7 0 00-3-4.8 6.4 6.4 0 00-.8-.4A7.1 7.1 0 0025.2 0c-.3 0-18.4 0-18.8 0zm10.8 5.4a7.6 7.6 0 016 3.8c.1.3.4.8.5 1.1.4 1 .6 2.2.8 3.8 0 .4 0 2 0 2.4-.1 2.2-.6 4.2-1.5 6.1a9.8 9.8 0 01-.8 1.4c-.9 1.3-2.3 2.3-3.5 2.6-.9.2-1.6-.1-2-.8a3.4 3.4 0 01-.3-.5c0-.1-.1-.1-.1-.1 0 0-.1.1-.2.2-1 .7-2 1.2-3.1 1.3-.3 0-.9 0-1.1 0-.7-.1-1.3-.4-1.6-.9a2.6 2.6 0 01-.3-.6c-.1-.4-.2-.8-.1-1.2 0-.6.2-1.2.5-1.8 0 0 0-.1 0-.1-.1 0-.1 0-.1.1-.4.2-.9.3-1.3.4-.8.1-1.4-.1-1.7-.7-.1-.2-.1-.4-.2-.7 0-.3 0-.4.1-.7.1-.2.1-.4.4-.9.4-.7.5-.9.6-1.3.3-.9.5-1.7.7-3.8.1-1.5.3-2.1.4-2.8 0-.1.1-.3.1-.4.8-3.1 3.1-5.2 6.1-5.6.1 0 .3 0 .4 0 .2 0 1 0 1.2 0z" fill="#fff"/><path d="M16.8 11.3a.8.8 0 00-.4.2c-.2.2-.3.4-.4.8 0 .2-.1.6 0 .9 0 .4.1.6.2.9.1.3.3.4.5.5.1 0 .4 0 .5 0 .4-.1.7-.5.8-1.2a4.8 4.8 0 000-1c-.1-.4-.2-.7-.4-.9a.8.8 0 00-.6-.3.8.8 0 00-.3 0zM20.4 11.3a1 1 0 00-.4.2c-.2.1-.3.4-.4.7-.1.2-.1.4-.1.7 0 .3 0 .5.1.7.1.5.4.8.7.9.1 0 .4 0 .5 0 .4-.1.7-.5.8-1.1 0-.2 0-.6 0-.9-.1-.6-.3-1.1-.6-1.2a1.5 1.5 0 00-.2-.1 1.4 1.4 0 00-.4 0z" fill="#fff"/></svg>
    Install in Kiro
  </a>
</div>

Or install from the command line:

```sh
code --install-extension svallory.jig
```

## Features

- Syntax highlighting for Jig tags (`@if`, `@each`, `@component`, etc.), mustache expressions (`{{ }}`), and comments (`{{-- --}}`)
- Host language highlighting — each file extension (`.html.jig`, `.ts.jig`, `.py.jig`, etc.) activates the appropriate host language grammar
- Embedded language blocks via the [content type suffix](../syntax_specification.md#content-type-suffix)
- Emmet support in `.jig` and `.html.jig` files

## Supported Languages

The extension ships grammars for the following host languages. Use the **file extension** for file-level highlighting or the **embed identifiers** with the `: LANG` suffix for inline embedded blocks.

| Language | File Extension | Embed Identifiers |
|----------|---------------|-------------------|
| HTML | `.jig`, `.html.jig` | `html` |
| CSS | `.css.jig` | `css` |
| JavaScript | `.js.jig` | `js`, `javascript`, `es6` |
| TypeScript | `.ts.jig` | `ts`, `typescript` |
| JSON | `.json.jig` | `json` |
| JSX | `.jsx.jig` | `jsx` |
| TSX | `.tsx.jig` | `tsx` |
| C | `.c.jig` | `c` |
| C++ | `.cpp.jig`, `.h.jig` | `cpp`, `c++`, `cxx` |
| C# | `.cs.jig` | `csharp`, `c#`, `cs` |
| Dart | `.dart.jig` | `dart` |
| Dockerfile | `.dockerfile.jig` | `dockerfile` |
| F# | `.fs.jig` | `fsharp` |
| Go | `.go.jig` | `go`, `golang` |
| Java | `.java.jig` | `java` |
| Julia | `.jl.jig` | `julia`, `jl` |
| Less | `.less.jig` | `less` |
| Markdown | `.md.jig` | `markdown`, `md` |
| YAML | `.yml.jig`, `.yaml.jig` | `yaml`, `yml` |
| PHP | `.php.jig` | `php` |
| PowerShell | `.ps1.jig` | `powershell`, `ps1`, `pwsh` |
| Python | `.py.jig` | `python`, `py` |
| R | `.r.jig` | `r` |
| Ruby | `.rb.jig` | `ruby`, `rb` |
| Rust | `.rs.jig` | `rust`, `rs` |
| SCSS | `.scss.jig` | `scss` |
| Shell | `.sh.jig` | `shell`, `sh`, `bash`, `zsh` |
| SQL | `.sql.jig` | `sql` |
| Swift | `.swift.jig` | `swift` |
| XML | `.xml.jig` | `xml` |
| Lua | `.lua.jig` | `lua` |
| Perl | `.pl.jig` | `perl`, `pl` |
| Groovy | `.groovy.jig` | `groovy` |
| Batch | `.bat.jig` | `bat`, `batch`, `cmd` |
| Clojure | `.clj.jig` | `clojure`, `clj` |
| CoffeeScript | `.coffee.jig` | `coffee`, `coffeescript` |
| Diff | `.diff.jig` | `diff` |
| Makefile | `Makefile.jig` | `makefile` |
| Objective-C | `.m.jig` | `objc`, `objective-c` |
| Objective-C++ | `.mm.jig` | `objcpp`, `objective-cpp` |
| ShaderLab | `.shader.jig` | `shaderlab` |
| Visual Basic | `.vb.jig` | `vb` |
| XSL | `.xsl.jig` | `xsl` |
| Elixir | `.ex.jig`, `.exs.jig` | `elixir` |
| Embedded Elixir | `.eex.jig`, `.leex.jig` | `eex` |
| HTML EEX | `.html.eex.jig`, `.html.leex.jig` | `html-eex` |

## Embedded Language Blocks

Use the content type suffix (`: LANG`) on any block-level tag to get syntax highlighting for the tag's body:

```edge
@if(format === 'json'): json
  {
    "name": {{ name }},
    "version": {{ version }}
  }
@end

@each(query in queries): sql
  SELECT * FROM {{ query.table }}
  WHERE id = {{ query.id }};
@end
```

The identifier after `:` must match one of the embed identifiers from the table above. Jig expressions (`{{ }}`) and tags (`@tag`) inside the block are still highlighted as Jig syntax.

## Configuration

### Template Disks

Configure template lookup paths in your project's Jig configuration:

```ts
jig.mount('default', join(__dirname, 'views'))
```

### Emmet

Emmet is enabled by default for `.jig` and `.html.jig` files. If it's not working, add this to your `settings.json`:

```json
{
  "emmet.includeLanguages": {
    "jig-html": "html"
  }
}
```
