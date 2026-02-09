import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const docsDir = join(__dirname, '..', 'content', 'docs')
const dbPath = join(docsDir, 'db.json')

interface DbEntry {
  permalink: string
  title: string
  contentPath: string
  category: string
}

const db: DbEntry[] = JSON.parse(readFileSync(dbPath, 'utf-8'))

// Read all markdown files
const documents: Array<{
  title: string
  permalink: string
  category: string
  content: string
}> = []

for (const entry of db) {
  const filePath = join(docsDir, entry.contentPath)
  try {
    const content = readFileSync(filePath, 'utf-8')
    documents.push({
      title: entry.title,
      permalink: entry.permalink,
      category: entry.category,
      content,
    })
  } catch (e) {
    console.error(`Failed to read ${filePath}:`, e)
  }
}

// Generate llms-full.txt (complete content)
const fullContent = documents
  .map((doc) => {
    return `# ${doc.title}\n\nURL: /docs/${doc.permalink}\nCategory: ${doc.category}\n\n${doc.content}\n\n${'='.repeat(80)}\n\n`
  })
  .join('')

const outputDir = join(__dirname, '..', 'public')

writeFileSync(join(outputDir, 'llms-full.txt'), fullContent)
console.log('✓ Generated public/llms-full.txt')

// Generate llms.txt (summary)
const summaryContent = `# Jig Documentation

Jig is a template engine purpose-built for code generation, forked from Edge.js.
It removes HTML escaping, adds implicit indentation control and filter syntax,
while maintaining components, slots, partials, and full JavaScript expressions.

## Documentation Index

${documents
  .map((doc) => `- [${doc.title}](/docs/${doc.permalink}) — ${doc.category}`)
  .join('\n')}

---

For the complete documentation content, see llms-full.txt
`

writeFileSync(join(outputDir, 'llms.txt'), summaryContent)
console.log('✓ Generated public/llms.txt')
console.log(`\nProcessed ${documents.length} documents`)
