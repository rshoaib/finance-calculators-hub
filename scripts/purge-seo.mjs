import fs from 'fs'
import path from 'path'

const pagesDir = path.join(process.cwd(), 'src', 'pages')
const files = fs.readdirSync(pagesDir)

for (const file of files) {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(pagesDir, file)
    let content = fs.readFileSync(filePath, 'utf8')

    // Remove import SEO from
    content = content.replace(/import\s+SEO\s+from\s+['"].*?['"]\r?\n?/g, '')

    // Remove `<SEO ... />` blocks
    content = content.replace(/<SEO\s+[^>]*?\/>/g, '')

    fs.writeFileSync(filePath, content)
    console.log(`Purged SEO from \${file}`)
  }
}

console.log('SEO Purge complete!')
