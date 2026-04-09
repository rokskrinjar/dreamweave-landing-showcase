

## Fix Stats Banner — Dynamic Month Count

### Problem
The "Dreams This Month" stat uses `profile.dreams_this_month` from the database, which is stale/incorrect. It needs to be computed from actual dream data, and in calendar view it should reflect the currently viewed month.

### Changes

**File: `src/components/DreamCalendar.tsx`**
- Add an `onMonthChange` callback prop: `onMonthChange?: (month: Date) => void`
- Call `onMonthChange(newMonth)` whenever the user navigates months (inside the chevron click handlers)
- Also call it on mount with the initial month

**File: `src/pages/Dashboard.tsx`**
- Add state: `calendarMonth` (Date, defaults to current month)
- Compute `dreamsThisMonth` dynamically by filtering `dreams` array: count dreams whose `recorded_at` falls within the displayed month
  - In **list view**: always use current real month (today)
  - In **calendar view**: use `calendarMonth` (updated via `onMonthChange` callback from DreamCalendar)
- Replace `profile?.dreams_this_month ?? 0` in the stats banner with the computed count
- Update the label dynamically: show "Dreams This Month" when viewing current month, show "Dreams in {Month name}" when viewing a different month in calendar view
- Pass `onMonthChange={(m) => setCalendarMonth(m)}` to `<DreamCalendar>`
- When switching back to list view, reset `calendarMonth` to current month

### Files changed
- `src/components/DreamCalendar.tsx` — add `onMonthChange` prop
- `src/pages/Dashboard.tsx` — compute month count from dreams array, wire up calendar month tracking

