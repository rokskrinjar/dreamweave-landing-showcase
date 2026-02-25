

## Make Your Landing Page Visible to Bots, Facebook, and Google

### The Problem
Your app is a client-side React app. When Facebook, Google, or any crawler visits your site, they see this:

```text
<div id="root"></div>
```

That's it. No text, no content, no pitch. Your beautiful landing page only appears after JavaScript runs, which most bots don't do.

### The Fix
We'll add three things to `index.html` that bots CAN read -- without changing how your site looks or works for real users (React will replace the content instantly when it loads).

---

### 1. Better Meta Tags and OG Image

**File: `index.html`**

- Update `og:url` to `https://dreamweave.me/`
- Update Twitter `site` from `@Lovable` to your brand
- Add `og:site_name`
- Replace the generic Lovable placeholder OG image URL with your own (you'll need to upload a screenshot or branded image to `public/og-image.png`)

### 2. Noscript / Bot-Readable Content

**File: `index.html`**

Add a `<noscript>` block inside `<body>` that contains your full landing page copy as plain HTML. This is what bots, Facebook previews, and Google will actually read. It includes:

- Hero headline: "That dream meant something. Find out what."
- Hero description paragraph
- All 4 feature titles and descriptions
- Pricing info
- A call-to-action link

Real users with JavaScript enabled will never see this -- React replaces it immediately. But crawlers get a full page of rich, keyword-dense content.

### 3. JSON-LD Structured Data

**File: `index.html`**

Add a `<script type="application/ld+json">` block in the `<head>` with structured data telling Google:
- What your site is (SoftwareApplication)
- Name, description, URL
- Pricing info
- Rating/review snippet (optional)

This helps Google show rich results (star ratings, pricing) in search.

### 4. Sitemap

**New file: `public/sitemap.xml`**

A simple sitemap listing your public pages (`/`, `/auth`, `/contact`, `/privacy`, `/terms`) so Google can discover and index them.

### 5. Robots.txt Update

**File: `public/robots.txt`**

Add a reference to the sitemap URL.

---

### What This Solves

| Platform | Before | After |
|----------|--------|-------|
| Facebook Ads | Empty preview, no text | Full headline, description, image |
| Google Ads | Can't read landing page | Sees all your copy and features |
| Google Search | Minimal indexing | Full content indexed, rich results |
| Twitter/X | Generic preview | Branded preview with image |

### Important Note
You'll want to replace the OG image (`https://lovable.dev/opengraph-image-p98pqg.png`) with an actual screenshot or branded image of DreamWeave. You can upload one to `public/og-image.png` and we'll reference that.

