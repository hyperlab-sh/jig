# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jig documentation website. A static site generator built on **AdonisJS** using `@dimerapp/content` for markdown-to-HTML rendering with Edge.js templates. Uses Shiki for syntax highlighting, Alpine.js for frontend interactivity, and Unpoly for AJAX navigation.

Documentation site: [jig.saulo.engineer](https://jig.saulo.engineer)

## Commands

```bash
# Development server (build assets + start server)
npm run dev

# Start dev server only (without rebuilding assets)
npm run serve

# Production static export → dist/
APP_URL=https://jig.saulo.engineer npm run export

# Download sponsor data
npm run download:sponsors
```

Dev server runs at `http://localhost:3333/docs/introduction`.

**Note:** `APP_URL` env var is required for `export` to generate correct og:url and twitter:url meta tags.

## Architecture

### Content Organization

- `content/docs/db.json` — Navigation database. Manually maintained; each entry has `permalink`, `title`, `contentPath`, `category`. No convention-based file scanning.
- `content/docs/**/*.md` — Markdown files with YAML frontmatter (`summary` for SEO)
- `content/config.json` — Site config (links, fileEditBaseUrl, copyright, optional menu/search)
- Images/videos stored alongside markdown files in content directories

### Rendering Pipeline

`src/bootstrap.ts` wires the pipeline:
1. `@dimerapp/content` Collection loads entries from `db.json`
2. `@dimerapp/edge` RenderingPipeline with `docsHook` from `@dimerapp/docs-theme`
3. Custom hooks for image rendering
4. Shiki syntax highlighting with custom VSCode grammars from `vscode_grammars/`
5. Noctis color theme

### Collections

Defined in `src/collections.ts`. Each collection has its own `db.json`, URL prefix, and renderer. Currently one collection: `docs` at `/docs`.

### Templates

- `templates/docs.edge` — Main content layout (sidebar, content, TOC)
- `templates/layouts/main.edge` — HTML wrapper (meta tags, fonts, Vite assets, dark mode)
- `templates/partials/` — Logo, sponsors, features, color mode detection
- Components from `@dimerapp/docs-theme`: `docs::header`, `docs::sidebar`, `docs::content`, `docs::toc`

### Frontend

- `assets/app.js` — Alpine.js + Unpoly + medium-zoom + DocSearch + edge-uikit tabs
- `assets/app.css` — Radix Colors (sage/teal), theme variables, `@dimerapp/docs-theme/styles`
- Dark mode via Alpine.js store + `.dark` CSS class

### Build Scripts

- `bin/serve.ts` — Dev server with URL rewriting, wildcard route matching against collections
- `bin/build.ts` — Static export: iterates collections, writes each entry to `dist/`
- `bin/download_sponsors.ts` — Fetches sponsor data from configured URLs

---

## Documentation Writing Guidelines

Guidelines based on `writing-readable-docs.md`.

### Working Relationship
- Push back on ideas — cite sources and explain reasoning
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up information

### Document Structure

Every document should be divided into these groups (not all docs need all groups):

**Explanations** — Text-heavy, avoid code until end, goal is comprehension. Installation instructions go right after explanation, before basic example.

**Usage** — Most docs focus here. OK to explain briefly before code examples. Code should be familiar but need not be copy-paste ready. First usage example should be basic.

**Tutorial / Step-by-Step** — Not every doc needs this. Include full working examples. Make examples copy-paste ready. Explain less, show more.

**Reference** — List separately when possible.

### Visual Structure
- Use headings freely but don't break sections below H3
- Admonition blocks: use sparingly — if everything is critical, nothing is
- Explain first, then show code/visuals — don't surround code with before-and-after explanations

### Code Examples
- Avoid diffs between examples (except in step-by-step tutorials)
- Usage/reference examples rarely need line highlights
- Treat related topics as separate usage examples, not incremental changes

### Writing Tone
- Simple, declarative sentences. Brevity is a plus.
- Present tense, second-person voice ("you") — but prefer wordings that avoid "you"s
- American English, Oxford comma
- Gender-neutral pronouns for hypothetical people
- Write an SEO-friendly summary in the YAML frontmatter
