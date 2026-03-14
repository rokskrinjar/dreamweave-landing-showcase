

## Update Favicon to DreamWeave Moon Icon

Copy the uploaded DreamWeave icon to `public/favicon.png` and update `index.html` to reference it instead of the default `favicon.ico`.

### Changes

1. **Copy** `user-uploads://image-54.png` → `public/favicon.png`
2. **Update `index.html`** — replace the existing favicon link with:
   ```html
   <link rel="icon" href="/favicon.png" type="image/png" />
   ```
   Also add an Apple touch icon for mobile:
   ```html
   <link rel="apple-touch-icon" href="/favicon.png" />
   ```

Google will pick up the new icon within days to weeks after the next crawl of your published site.

