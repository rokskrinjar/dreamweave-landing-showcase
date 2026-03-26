

## Replace "See It in Action" Carousel with Video

### Overview
Remove the 4-slide Embla carousel entirely. Replace it with a single embedded `<video>` element that plays the user-provided tutorial video. The section header ("See It in Action" + subtitle) stays.

### Video Quality
The video will be stored in the `public/` folder (not imported via `src/`) so Vite does **not** compress or re-encode it. This preserves the original resolution and quality — same approach already used for Rachel's screenshots.

### Plan

1. **User provides the video file** — I'll place it at `public/videos/tutorial.mp4` (or whatever format they provide).

2. **Rewrite `src/components/CaseStudy.tsx`**:
   - Remove all Embla carousel logic, slide components, step indicators, dot indicators, and navigation arrows
   - Remove the `rachelPortrait` image import and unused icon imports
   - Keep the section wrapper, header ("See It in Action"), and subtitle
   - Add a `<video>` element with:
     - `controls` for play/pause/scrub
     - `preload="metadata"` for fast initial load
     - `rounded-2xl shadow-lg border border-border` styling to match the card aesthetic
     - `max-w-4xl mx-auto` to keep it centered and reasonably sized
     - Optional poster frame if the user provides one
   - The video source references `/videos/tutorial.mp4` (public folder, no build processing)

### Result
A clean, full-width video player replaces the carousel. No resolution loss since the file is served as-is from `public/`.

### Next Step
I need the video file from you — just upload it and I'll put it in place.

### Files
- `public/videos/tutorial.mp4` (new — user-provided)
- `src/components/CaseStudy.tsx` (rewritten)

