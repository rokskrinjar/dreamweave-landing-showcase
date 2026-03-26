

## Remove Black Bars from Tutorial Video

### What's happening
The video file has black bars (letterboxing) baked into the recording itself. CSS alone cannot remove them — the actual video file needs to be re-encoded with the black regions cropped out.

### Plan

1. **Detect the crop region** — Use `ffmpeg`'s `cropdetect` filter on the MP4 to find the exact pixel boundaries of the actual content (excluding black bars).

2. **Re-encode the video** — Use `ffmpeg` to crop the video, removing the black bars while keeping all visible content at full quality. Output both `.mp4` and `.mov` versions.

3. **Replace the files** — Overwrite `public/videos/tutorial.mp4` and `public/videos/tutorial.mov` with the cropped versions.

No code changes needed in `CaseStudy.tsx` — the video element already uses `w-full` which will adapt to whatever aspect ratio the video has.

### Files
- `public/videos/tutorial.mp4` (re-encoded, cropped)
- `public/videos/tutorial.mov` (re-encoded, cropped)

