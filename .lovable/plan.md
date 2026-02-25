

## Add "Contact Us" Link to Dashboard Layout

The contact form exists at `/contact` but there's no way to reach it from the logged-in app layout. We'll add a link in two places:

### Changes

**`src/components/AppLayout.tsx`**

1. Add a "Contact" nav item (using `MessageSquare` icon from lucide) to the `navItems` array so it appears in both the desktop top nav and the mobile bottom nav.
2. This keeps it consistent with the existing nav pattern -- no extra UI needed.

| Location | What user sees |
|----------|---------------|
| Desktop top nav bar | "Contact" link next to Dashboard, Record Dream, Patterns |
| Mobile bottom nav | Contact icon + label alongside existing items |

