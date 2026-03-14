

## Group Account & Utility Items into a Mobile Hamburger Menu

Looking at the circled elements: **logout button** (top-right), **Pro/Manage badges** (below heading), and **Contact** (bottom nav), the plan is to consolidate these into a single dropdown menu accessible from the header on mobile.

### Changes

**`src/components/AppLayout.tsx`**
- Remove "Contact" from the `navItems` array (it moves into the menu)
- Replace the standalone logout button with a hamburger/dropdown menu (using the existing `DropdownMenu` component)
- The dropdown contains: user email, subscription tier badge, Manage subscription link (if Pro), Contact link, and Sign Out
- On desktop: keep the existing inline layout but move Contact into the same user dropdown
- On mobile: show a `Menu` (hamburger) icon in the top-right header that opens the dropdown

**`src/pages/Dashboard.tsx`**
- Remove the Pro badge and Manage button from the page heading area (lines ~137-154), since they'll now live in the global nav menu
- Pass subscription info is already available via `useAuth` in AppLayout, so no prop drilling needed

### Menu Structure (mobile dropdown)
```text
┌──────────────────┐
│ user@email.com   │
│ ── separator ──  │
│ 👑 Pro / Manage  │
│ 💬 Contact       │
│ ── separator ──  │
│ 🚪 Sign Out      │
└──────────────────┘
```

### Desktop behavior
- Nav links stay inline (My Dreams, Record Dream, Patterns)
- Contact moves into a user avatar/dropdown area on the right alongside email and logout
- Or alternatively, keep Contact in the main nav on desktop only — simpler change

### Bottom nav (mobile)
- Reduce to 3 items: My Dreams, Record Dream, Patterns (Contact removed)

