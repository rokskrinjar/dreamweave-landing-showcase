

## Improve Case Study Image Resolution

The images in the case study section were likely compressed or downsized when copied from your uploads into `src/assets/`. The fix is straightforward:

### Plan
1. **Re-import original uploads** — Copy your original uploaded screenshots (`rachels_dreams.png`, `anaylzed_dream_1.png`, `anaylzed_dream_2.png`, `patterns_1.png`, `patterns_2.png`) back into `src/assets/` at their full original resolution, replacing the current compressed versions.

2. **Move images to `public/` folder** — Static assets in `public/` are served as-is without any Vite processing/compression, which preserves full quality. Reference them via absolute paths (`/images/rachels-dreams.png`) instead of imports.

3. **Add image rendering hints** — Add `loading="eager"` and CSS `image-rendering: auto` to ensure browsers render them crisply, plus use `srcSet` if we have 2x versions available.

This is primarily an asset quality issue — the code structure is fine, we just need the full-resolution source files served without compression.

