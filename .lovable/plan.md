

## Add Export Button Next to "Record a Dream"

Place the download/export button right beside the existing "Record a Dream" button on the Dashboard page. Only visible for Pro/Lifetime users.

### Changes

**1. Install dependency**
- Add `xlsx` (SheetJS) for client-side Excel generation.

**2. New file: `src/lib/exportDreams.ts`**
- Utility function that takes an array of dreams, builds an Excel worksheet with columns (Title, Date, Mood, Tags, Content), and triggers a `.xlsx` download.

**3. Update `src/pages/Dashboard.tsx`** (lines 156-161)
- Wrap the "Record a Dream" button in a flex container with a new "Export" button beside it.
- The Export button uses the `Download` icon, only renders when `subscription.tier !== "free"`, and calls the export utility with the current `dreams` array on click.

```text
Before:
  [ Record a Dream ]

After (Pro/Lifetime users):
  [ Download ]  [ Record a Dream ]
```

**4. Remove "Contact" from `AppLayout.tsx` nav**
- Revert the Contact nav item added earlier since it belongs in the footer, not the main nav.

### Technical Details

| Item | Detail |
|------|--------|
| New dependency | `xlsx` |
| New file | `src/lib/exportDreams.ts` |
| Modified | `src/pages/Dashboard.tsx` -- add export button next to Record a Dream |
| Modified | `src/components/AppLayout.tsx` -- remove Contact from nav items |

