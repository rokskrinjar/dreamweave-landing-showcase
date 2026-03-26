

## Wrap Step Indicators + Video in a Unified Frame

### What changes

In `src/components/CaseStudy.tsx`, wrap the step indicators and video together inside a single card container so they look connected and professional.

**The frame:**
- A single `bg-card border border-border rounded-2xl shadow-lg` container (matching the Rachel intro card style above it)
- Inside: step indicators at the top with padding, a subtle `border-b border-border` divider, then the video below with no extra border/shadow (since the card provides it)
- The video gets `rounded-b-2xl` (bottom corners only) so it sits flush inside the card
- Step indicators get slightly more padding and spacing inside the card

```text
┌─────────────────────────────────┐
│  🌙 Log  📖 Analyze  🧠 Pattern │  ← inside card, padded
│─────────────────────────────────│  ← subtle divider
│                                 │
│         VIDEO PLAYER            │  ← flush inside card
│                                 │
└─────────────────────────────────┘
```

### File
- `src/components/CaseStudy.tsx` — wrap lines 52-75 in a unified card container

