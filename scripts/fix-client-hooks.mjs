import fs from 'fs'
import path from 'path'

// 1. Prepend 'use client' to all calculators in src/pages
const pagesDir = path.join(process.cwd(), 'src', 'pages')
const files = fs.readdirSync(pagesDir)
for (const file of files) {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(pagesDir, file)
    let content = fs.readFileSync(filePath, 'utf8')
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
      content = '"use client"\n' + content
      fs.writeFileSync(filePath, content)
      console.log('Added use client to', file)
    }
  }
}

// 2. Fix escaped template literals in app/page.jsx
const appPage = path.join(process.cwd(), 'app', 'page.jsx')
let appPageContent = fs.readFileSync(appPage, 'utf8')
appPageContent = appPageContent.replace(/href=\{\`\/\$\\{s\.slug\\}\`\}/g, 'href={`/${s.slug}`}')
fs.writeFileSync(appPage, appPageContent)

// 3. Fix escaped template literals in app/ClientHomeFilter.jsx
const clientHomeFilter = path.join(process.cwd(), 'app', 'ClientHomeFilter.jsx')
let clientHomeFilterContent = fs.readFileSync(clientHomeFilter, 'utf8')
clientHomeFilterContent = clientHomeFilterContent.replace(/href=\{\`\/\$\\{calc\.slug\\}\`\}/g, 'href={`/${calc.slug}`}')
fs.writeFileSync(clientHomeFilter, clientHomeFilterContent)

// 4. Fix escaped template literals in src/components/RelatedCalculators.jsx
const relatedCalcs = path.join(process.cwd(), 'src', 'components', 'RelatedCalculators.jsx')
let relatedCalcsContent = fs.readFileSync(relatedCalcs, 'utf8')
relatedCalcsContent = relatedCalcsContent.replace(/href=\{\`\/\$\\{calc\.slug\\}\`\}/g, 'href={`/${calc.slug}`}')
fs.writeFileSync(relatedCalcs, relatedCalcsContent)

// 5. Fix blog links in app/blog/ClientBlogFilter.jsx
const clientBlogFilter = path.join(process.cwd(), 'app', 'blog', 'ClientBlogFilter.jsx')
if (fs.existsSync(clientBlogFilter)) {
  let clientBlogFilterContent = fs.readFileSync(clientBlogFilter, 'utf8')
  clientBlogFilterContent = clientBlogFilterContent.replace(/href=\{\`\/blog\/\$\\{post\.slug\\}\`\}/g, 'href={`/blog/${post.slug}`}')
  fs.writeFileSync(clientBlogFilter, clientBlogFilterContent)
}

// 6. Fix catch-all route app/[slug]/page.jsx
const seoPage = path.join(process.cwd(), 'app', '[slug]', 'page.jsx')
let seoPageContent = fs.readFileSync(seoPage, 'utf8')
seoPageContent = seoPageContent.replace(/href=\{\`\/\$\\{r\.slug\\}\`\}/g, 'href={`/${r.slug}`}')
fs.writeFileSync(seoPage, seoPageContent)

// 7. Fix Breadcrumb links (remove escaped $ completely from template literals)
const breadcrumb = path.join(process.cwd(), 'src', 'components', 'Breadcrumb.jsx')
let breadcrumbContent = fs.readFileSync(breadcrumb, 'utf8')
breadcrumbContent = breadcrumbContent.replace(/\\\$\{/g, '${')
fs.writeFileSync(breadcrumb, breadcrumbContent)

console.log('Fixed client issues!')
