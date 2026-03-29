

## Flip Progress Bar Logic + Lighter Color

### Change

**File: `src/pages/Dashboard.tsx`**

- Change label from "{used} of 3 analyses used this month" → "{remaining} of 3 analyses left this month"
- Flip bar value: instead of `(used / 3) * 100`, use `(remaining / 3) * 100` — full when 3 left, empty when 0 left
- Lighten the bar color: change `[&>div]:bg-primary` → `[&>div]:bg-primary/70` for a softer purple

### Files
- `src/pages/Dashboard.tsx` — update progress bar value, label text, and color opacity

