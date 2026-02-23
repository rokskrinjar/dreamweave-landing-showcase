

## Fix Emotion Calendar: Timezone Bug + Width

### Root Causes Found

**1. Timezone date mismatch (why dreams are missing)**
The grid builds dates using local time (`new Date()` with `setHours(0,0,0,0)`), then converts them to date strings with `.toISOString().slice(0,10)` which outputs UTC. If you're in any timezone east of UTC (e.g. UTC+1), local midnight Feb 17 becomes "2026-02-16" in UTC. Meanwhile, dream dates from the database (already in UTC) produce correct UTC date strings. The grid keys and dream keys never match, so cells stay empty.

This explains why only 2 of your ~16 dreams with moods show up -- those 2 happen to land on dates where the timezone offset doesn't cause a mismatch (likely dreams recorded around midnight UTC).

**2. Cell size cap too small (why grid doesn't fill the card)**
`MAX_CELL` is capped at 24px. With 14 columns: `14 x 24 + 13 x 3 = 375px`. Your card is roughly 800px wide, so the grid only fills half.

### Fixes (all in `src/pages/Patterns.tsx`)

**Fix 1: Use a timezone-safe date formatter**
Replace all `.toISOString().slice(0,10)` calls with a helper that formats dates using local year/month/day:

```text
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
```

For dream `recorded_at` strings, parse them into a local date first:
```text
const dateKey = toDateKey(new Date(d.recorded_at));
```

For grid dates (already local): same function. Now both sides produce matching local date keys.

**Fix 2: Remove the cell size cap**
- Remove the `MAX_CELL = 24` constant (or raise it to something like 60)
- This lets cells grow to fill the full card width naturally
- Keep `MIN_CELL = 14` so cells don't get too tiny on mobile

### What stays the same
- All sentiment colors and classifier logic unchanged
- Tooltip behavior unchanged
- Legend unchanged
- Month/day labels unchanged

