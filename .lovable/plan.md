

## Add Calendar View to Dreams Dashboard

### New File: `src/components/DreamCalendar.tsx`

Create a calendar component that:
- Accepts `dreams` array and `moodColors` map as props
- Uses `date-fns` for all date math (startOfMonth, endOfMonth, startOfWeek with `weekStartsOn: 1`, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, isSameDay, addMonths, subMonths)
- Groups dreams by `recorded_at` date into a `Map<string, Dream[]>` using `format(date, 'yyyy-MM-dd')` as key
- Month navigation with ChevronLeft/ChevronRight buttons and centered month/year label
- 7-column grid, Mon–Sun headers in muted text
- Day cell styling per the requirements: outside-month faint, dreams get `bg-primary/10`, today gets `ring-2 ring-primary text-primary font-bold`, selected gets `ring-1 ring-muted-foreground/40`, selected+today gets `ring-offset-2`
- Dream count as plain purple number in top-right corner (absolute positioned, `text-[10px]`)
- Selected day detail panel below calendar showing date heading and dream cards matching list view style (linked to `/dreams/{id}`, with analyzed/not-analyzed badges, mood pills, tags, content preview)

### Modified File: `src/pages/Dashboard.tsx`

- Add `viewMode` state (`"list" | "calendar"`, default `"list"`)
- Next to the Export button, add a ghost icon button (size `"icon"`) that toggles `viewMode`
  - List view active: show `CalendarDays` icon, ghost style
  - Calendar view active: show `List` icon, add `bg-muted` class
- When `viewMode === "calendar"`: hide search bar and dream list, render `<DreamCalendar dreams={dreams} moodColors={moodColors} />` instead
- Pass full unfiltered `dreams` array to calendar

### Files
- `src/components/DreamCalendar.tsx` (new)
- `src/pages/Dashboard.tsx` (modified)

