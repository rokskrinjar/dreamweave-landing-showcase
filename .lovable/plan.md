

## Restore 5-Dream Minimum for Pattern Insights

### Changes

#### 1. Backend: `supabase/functions/dream-patterns/index.ts`
- Change `analyses.length < 3` back to `analyses.length < 5`
- Update error message to "You need at least 5 analyzed dreams to generate pattern insights."

#### 2. Frontend: `src/pages/Patterns.tsx`

**Button logic** (line 375-386):
- Show button only when `dreams.length >= 5`
- Label: "Generate Insights" when no `patternData` exists, "Refresh Insights" when it does

**Charts section** (lines 390-408):
- Only show charts when `dreams.length >= 5` (no point showing charts with fewer analyzed dreams)

**Empty state** (lines 459-465):
- Change threshold from `dreams.length < 3` to `dreams.length < 5`
- When fewer than 5 analyzed dreams: show a message like "Analyze at least 5 dreams to unlock AI pattern recognition and charts. You have X so far."
- This message replaces both the charts and the insights section when under threshold

### Summary of UX Flow
- **< 5 analyzed dreams**: Show only the header with count + a single card saying "Analyze at least 5 dreams to unlock pattern insights. You have X analyzed so far."
- **>= 5 analyzed dreams, no insights yet**: Show charts + "Generate Insights" button
- **>= 5 analyzed dreams, insights exist**: Show charts + "Refresh Insights" button + insight cards

