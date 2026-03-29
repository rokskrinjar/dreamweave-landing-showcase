

## Replace Free Analyses Text with Progress Bar

### Change

**File: `src/pages/Dashboard.tsx`**

Replace lines 99-104 (the `<p>` tag with remaining count text) with a slim progress bar + label:

- Add `import { Progress } from "@/components/ui/progress"` at top
- Compute `used = profile ? profile.dreams_this_month : 0` and `total = 3`
- Render a `<Progress>` bar (h-2, rounded, purple accent via `[&>div]:bg-primary`) with `value={(used / total) * 100}`
- Below/beside the bar: `"{used} of {total} analyses used this month"`
- When `atLimit` (`used === 3`), append an "Upgrade" link next to the label
- Remove the old text paragraph

The bar sits directly under "Your Dreams" heading, inside the existing `<div>`, keeping it compact and consistent.

### Files
- `src/pages/Dashboard.tsx` — replace subtitle text with progress bar + label

