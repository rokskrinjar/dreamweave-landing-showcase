

## Redesign Locked Patterns Page with Blurred Preview

### File: `src/pages/Patterns.tsx`

**Replace the `isLocked` block (lines 375-395)** with a new design that renders the full patterns page content behind a blur overlay.

**Blurred preview background:**
- Render a fake/mock version of the unlocked patterns page with hardcoded sample data — emotion breakdown chart (with green/red/amber bars), mood over time line chart, recurring theme pills (purple tags), and emotional patterns text card
- Wrap all of this in a container with `filter: blur(8px)` and `pointer-events: none` so it's visible but unreadable, with colors bleeding through
- Use the same chart components (`EmotionBarChartInner`, `MoodOverTimeChart`) fed with static mock data so the preview looks realistic
- Add `overflow-hidden` on the wrapper to prevent blur bleed outside the section

**Overlay card:**
- Position a centered overlay card on top using `absolute inset-0` with flex centering
- Card style: `bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-10 max-w-md` — soft white semi-transparent
- Contents:
  1. Small purple `Lock` icon (lucide) centered at top
  2. Bold headline: "Your subconscious has patterns. Are you ready to see them?"
  3. Muted smaller text: "Upgrade to Dreamer to unlock your emotion breakdown, mood timeline, recurring themes, and personal insights."
  4. Full-width CTA button with `gradient-navy text-white`: "Unlock My Patterns" → navigates to `/upgrade`

**Mock data for preview:**
- 3 stacked bar entries (Positive/Neutral/Negative) with sample emotions like joy, calm, anxiety, fear, curiosity
- ~8 mood-over-time data points with mixed scores
- Theme pills: ["Flying", "Water", "Chase", "Family", "Lost Places", "Animals"]
- Emotional patterns text: a couple of placeholder paragraphs

### Files changed
- `src/pages/Patterns.tsx` — replace locked state UI with blurred preview + overlay card

