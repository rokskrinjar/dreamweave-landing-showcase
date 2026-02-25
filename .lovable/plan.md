

## Expand Actionable Suggestions

### What changes

**1. Edge function (`supabase/functions/dream-patterns/index.ts`)**
- Increase the suggestions count from "3-5" to "5-10" in the tool parameter description
- Update the system prompt to ask the AI for more detailed, varied suggestions covering different angles (e.g. bedtime habits, emotional processing, daily mindset shifts, social/relational, physical wellbeing)

**2. Frontend (`src/pages/Patterns.tsx`)**
- No structural changes needed -- the suggestions list already renders dynamically from the array, so more items will appear automatically

### Technical details

In the edge function, the tool schema description on line ~120 changes from:
```
"3-5 specific, actionable suggestions based on the patterns found"
```
to:
```
"5-10 specific, actionable suggestions spanning different life areas (mindset, daily habits, sleep hygiene, emotional processing, relationships, physical wellbeing)"
```

The system prompt (line ~78-82) gets a small addition asking the AI to provide a wider range of suggestions across multiple life domains, not just psychological ones.

This keeps things simple -- no new UI components, no categories, just more and better suggestions from the AI.

