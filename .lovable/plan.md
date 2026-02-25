

## Gradient Line Color for Mood over Time Chart

Change the single-color line to a vertical gradient: green at the top (positive) fading to red at the bottom (negative), so the line color visually reflects the sentiment value.

### Approach

Use an SVG `<defs>` block with a vertical `<linearGradient>` inside the Recharts `<LineChart>`. The gradient transitions from green (#10b981) at y=0 (top / positive) to red (#f43f5e) at y=100% (bottom / negative), matching the existing sentiment color scheme.

### Changes

**`src/pages/Patterns.tsx`** -- `MoodOverTimeChart` component (lines 206-226)

- Add an SVG `<defs>` element inside the `<LineChart>` defining a vertical linear gradient (`id="moodGradient"`):
  - Stop at 0%: green (#10b981) -- positive
  - Stop at 50%: amber (#f59e0b) -- neutral  
  - Stop at 100%: red (#f43f5e) -- negative
- Update the `<Line>` stroke from `"hsl(var(--primary))"` to `"url(#moodGradient)"`
- Update the dot fill to dynamically color based on the data point's score value (green/amber/red)

This uses a single vertical gradient on the line stroke, so the line appears green when trending positive and red when trending negative, with amber in the neutral zone.

