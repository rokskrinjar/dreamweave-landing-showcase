

## Redesign Locked Patterns Page — No Blur, Placeholder Content

### File: `src/pages/Patterns.tsx`

**Replace the entire `isLocked` block (lines 389-470)** with a clean, non-blurred layout that mirrors the real unlocked page structure.

**Header (same as unlocked):**
- Keep "Dream Patterns" title and subtitle (use static text like "Insights from your subconscious")
- Replace "Refresh Insights" button with "Upgrade to Dreamer" button in same `gradient-navy` style → navigates to `/upgrade`

**Charts card:**
- Same card structure with Emotion Breakdown / Mood over Time tabs
- Emotion Breakdown tab: render a simple placeholder bar chart using Recharts with 3 generic bars (soft green, amber, rose) with generic labels like "Positive", "Neutral", "Negative" and small static values — no real emotion keys, just clean colored bars
- Mood over Time tab: render a simple smooth placeholder line chart with ~6 static data points forming a gentle wave, using a soft muted blue/gray stroke — no real sentiment coloring
- Below the chart area inside the card: a small muted text line: *"Your emotional data will appear here after upgrading."*

**Upgrade prompt (new — between charts and themes):**
- A centered line with a small purple `Sparkles` icon and a link-styled button: "Unlock your real patterns — Upgrade to Dreamer" → navigates to `/upgrade`

**Recurring Themes card:**
- Card with "Recurring Themes" title
- 5 empty pill outlines: `border border-muted-foreground/20 rounded-full h-7 w-16/w-20/w-14` (varying widths, no text, gray outlines)

**Emotional Patterns card:**
- Card with "Emotional Patterns" title
- Single muted italic line: *"A personal analysis of your emotional arc across all your dreams will appear here."*

**Actionable Suggestions card:**
- Card with "Actionable Suggestions" title
- Single muted italic line: *"Personalized suggestions based on your recurring dream patterns will appear here."*

**Cleanup:**
- Remove `mockDreams`, `mockThemes` arrays (no longer needed)
- Remove `Lock` from lucide imports if unused elsewhere

### Files changed
- `src/pages/Patterns.tsx` — replace locked state with placeholder content layout

