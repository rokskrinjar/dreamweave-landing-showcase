

## Serve Different Video Versions by Device

### What changes

In `src/components/CaseStudy.tsx`, use two `<video>` elements — one with the original uncropped video (better for desktop) and one with the cropped version (better for mobile). Show/hide them using Tailwind responsive classes.

### Steps

1. **Add original video files back** — Copy the original uncropped video to `public/videos/tutorial-desktop.mp4` and `public/videos/tutorial-desktop.mov`
2. **Rename current cropped files** — Keep `tutorial.mp4`/`.mov` as the mobile (cropped) versions
3. **Update `CaseStudy.tsx`** — Render two `<video>` elements:
   - Desktop video: `hidden md:block` — shows original with black bars (looks better on wide screens)
   - Mobile video: `block md:hidden` — shows cropped version (fills narrow screens nicely)

### File changes
- `public/videos/tutorial-desktop.mp4` (new — original uncropped)
- `public/videos/tutorial-desktop.mov` (new — original uncropped)
- `src/components/CaseStudy.tsx` — add responsive dual-video rendering

