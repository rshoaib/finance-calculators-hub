/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pure static export — Next builds the entire site to /out as plain HTML,
  // CSS, and JS. No server, no database, no API routes at runtime. The
  // getcertquiz pattern: drop /out onto any static host (Vercel, Cloudflare
  // Pages, Netlify, S3+CloudFront) and you're done.
  output: 'export',

  reactStrictMode: true,

  images: {
    // Required with `output: 'export'` — there is no Next Image Optimization
    // API at runtime to resize/reformat images. Images in /public are served
    // as-is. Hero SVGs now live in /public/blog-images/.
    unoptimized: true,
  },

  // Ensures URLs like /blog/foo resolve to /blog/foo/index.html on any static
  // host without relying on host-specific rewrites.
  trailingSlash: true,

  // NOTE: `redirects()` and `rewrites()` don't run with `output: 'export'`.
  // The redirects that used to live here are now in vercel.json (and should
  // be mirrored to public/_redirects if you ever migrate to Cloudflare Pages).
  // Don't add server-only config back into this file.
}

export default nextConfig
