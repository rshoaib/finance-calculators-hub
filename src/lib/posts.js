// Build-time blog post reader. Replaces the old Supabase queries.
//
// Posts live as Markdown files with frontmatter in /content/blog/<slug>.md.
// The body is raw HTML (authored by the scheduled publisher) — Markdown
// allows inline HTML, so no conversion happens. Consumers render
// { __html: post.content } exactly like they did with Supabase rows.
//
// IMPORTANT: this module uses node:fs and must only be imported from
// server components or build-time contexts (generateStaticParams, sitemap).

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

// Hero SVGs now live under /public/blog-images/. Strip the legacy Supabase
// storage prefix so the site serves images from its own origin.
const LEGACY_IMAGE_PREFIX = '/storage/v1/object/public/blog-images/'

function rewriteImageUrl(url) {
  if (!url) return null
  if (url.startsWith(LEGACY_IMAGE_PREFIX)) {
    return '/blog-images/' + url.slice(LEGACY_IMAGE_PREFIX.length)
  }
  return url
}

let cachedPosts = null

function readAll() {
  if (cachedPosts) return cachedPosts
  if (!fs.existsSync(BLOG_DIR)) {
    cachedPosts = []
    return cachedPosts
  }
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))
  const posts = files.map((file) => {
    const slugFromFile = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
    const { data, content } = matter(raw)
    return {
      slug: data.slug || slugFromFile,
      title: data.title || '',
      excerpt: data.excerpt || '',
      category: data.category || '',
      author: data.author || 'MyCalcFinance Team',
      published_at: data.published_at || null,
      updated_at: data.updated_at || data.published_at || null,
      meta_title: data.meta_title || '',
      meta_description: data.meta_description || '',
      image_url: rewriteImageUrl(data.image_url),
      content,
    }
  })
  // Newest first.
  posts.sort((a, b) => {
    const da = a.published_at ? Date.parse(a.published_at) : 0
    const db = b.published_at ? Date.parse(b.published_at) : 0
    return db - da
  })
  cachedPosts = posts
  return posts
}

// Lightweight variant without the (potentially large) HTML body — used by
// the blog index and sitemap so the full content isn't shipped to the
// client bundle or held in memory unnecessarily.
export function getAllPostsMeta() {
  const SVG_RE = /<svg\b[^>]*>[\s\S]*?<\/svg>/i
  return readAll().map(({ content, ...rest }) => {
    const m = content ? content.match(SVG_RE) : null
    return { ...rest, thumbnail_svg: m ? m[0] : null }
  })
}

export function getAllSlugs() {
  return readAll().map((p) => p.slug)
}

export function getPost(slug) {
  return readAll().find((p) => p.slug === slug) || null
}
