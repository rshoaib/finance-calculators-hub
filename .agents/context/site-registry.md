---
site: mycalcfinance.com
git_branch: master
supabase_ref: fyjqnidhhwxvzllhjfxk
content_format: html
---

# MyCalcFinance Site Registry

## Blog Schema (`blog_posts` table)

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | uuid | auto | Primary key |
| `slug` | text | ✅ | URL slug (kebab-case) |
| `title` | text | ✅ | Article title |
| `excerpt` | text | ✅ | Short description |
| `category` | text | ✅ | e.g. `Finance`, `Mortgage` |
| `image_url` | text | ✅ | Path: `/images/blog/{name}.png` |
| `author` | text | ✅ | e.g. `MyCalcFinance Team` |
| `published_at` | text | ✅ | ISO date: `2026-03-27` |
| `content` | text | ✅ | **HTML** (rendered via dangerouslySetInnerHTML) |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

## Image Hosting

- **Strategy**: Local file in `public/images/blog/`
- **Column**: `image_url`
- **Path format**: `/images/blog/{slug}-hero.png`
- **Component**: `next/image` in blog page
- **⚠️ CRITICAL**: Image file MUST be `git add`-ed and pushed to `master`

## Content Format

- **Type**: HTML (rendered via `dangerouslySetInnerHTML`)
- **CSS support**: `.blog-article-content` class handles h2, h3, p, a, ul, ol, li, table, th, td, strong
- **Tables**: ✅ Styled (emerald accent, hover effects) — added to `globals.css`
- **⚠️ IMPORTANT**: Date column is `published_at` (NOT `date`)

## Deployment

- **Git branch**: `master` ← ⚠️ DIFFERENT from other sites!
- **Host**: Vercel
- **Revalidation**: ISR
- **Push command**: `git push origin master`

## Post-Insert Checklist

1. ☐ Image file exists in `public/images/blog/`
2. ☐ Image file is git-tracked (`git status` shows no `??`)
3. ☐ `image_url` column matches the file path exactly
4. ☐ `published_at` is set (NOT `date`)
5. ☐ Push to `master` (NOT `main` — this site is different!)
6. ☐ Wait 90s, verify image URL returns 200
