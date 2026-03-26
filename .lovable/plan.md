

## Restore Rachel Intro + Video Below

### What changes

**File: `src/components/CaseStudy.tsx`**

Rebuild the component to have two parts:

1. **Top section — Rachel's story intro** (restored):
   - Section header: "See It in Action" + subtitle about Rachel
   - Rachel's portrait image (`rachel-portrait.png`) with a short bio/intro card
   - 4 step indicators with icons showing her journey (Moon → BookOpen → Brain → TrendingUp) with labels like "Logged her dream", "AI analyzed it", "Discovered patterns", "Gained insight"
   - These are displayed as a horizontal row of small icon+label items (no carousel, just static display)

2. **Bottom section — Video** (replacing the old carousel screenshots):
   - The `<video>` element with both `.mov` and `.mp4` sources, same styling as current
   - Copy the uploaded MP4 to `public/videos/tutorial.mp4`

### Layout
```text
┌──────────────────────────────────┐
│     See It in Action (heading)   │
│     Rachel's journey subtitle    │
│                                  │
│  [Rachel portrait]  [Bio text]   │
│                                  │
│  🌙 Log  📖 Analyze  🧠 Pattern │
│                                  │
│  ┌────────────────────────────┐  │
│  │      VIDEO PLAYER          │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### Files
- `public/videos/tutorial.mp4` (new — copy uploaded MP4)
- `src/components/CaseStudy.tsx` (rewritten with Rachel intro + video)

