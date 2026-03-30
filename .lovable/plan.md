

## Update Features Cards + Lucid Dreaming Section

### CHANGE 1 — Features section (`src/components/Features.tsx`)

Replace vertical text blocks with three horizontal cards (grid, stacking on mobile). Each card:
- White background, rounded-xl, subtle border, padding
- Hover: lift (`hover:-translate-y-1`), shadow increase, background shifts to soft purple (`hover:bg-purple-50`)
- Smooth transition (`transition-all duration-300`)
- Icon at top (from lucide-react): `Brain`, `RefreshCw`, `Sprout`
- Bold statement + short 2-sentence body

Keep the headline and subheadline. Change container max-width to `max-w-6xl` for the 3-column layout. Section background stays warm off-white.

### CHANGE 2 — Lucid Dreaming section (`src/components/LucidDreamingSection.tsx`)

**Text changes:**
- Keep pill badge
- Headline → `"Lucid Dreaming"` (large, bold)
- Add subheadline: `"Your dream journal is the key to waking up inside your dreams."`
- Replace body paragraph with 4 bullet points (left-aligned list with check or star icons)
- Keep callouts and CTA button unchanged

**Star particle effect:**
- Add a CSS-only twinkling stars background using pseudo-elements or small absolutely-positioned dots with varying opacity and a subtle CSS animation (pulse/twinkle keyframes)
- Use ~20-30 small dots scattered via inline styles with random positions, sizes (1-3px), and animation delays
- Keep very subtle — white dots at 10-40% opacity

### Files changed
- `src/components/Features.tsx` — card layout rewrite
- `src/components/LucidDreamingSection.tsx` — text + stars effect

