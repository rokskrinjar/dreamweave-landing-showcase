

## Redesign App Top Bar and Navigation

### What changes

Based on the screenshots, the in-app layout needs these updates:

**1. Top bar — white background (desktop & mobile)**
- Change header from `cta-dark-gradient border-white/10` to `bg-white/95 backdrop-blur-md border-border`
- Logo text: dark (`text-foreground`)
- Nav links: dark text with active state styling

**2. Desktop nav — only Dreams & Patterns**
- Remove "Record Dream" from `navItems` array
- Keep only Dreams and Patterns as center nav links
- Replace the email/hamburger area on the right with:
  - "Record Dream" button (dark navy `gradient-navy`, with PenLine icon)
  - Hamburger menu icon (dark) for user dropdown

**3. Mobile bottom nav — redesign**
- Left: Dreams icon+label
- Center: Floating circular "Record" button (`gradient-navy`, raised with shadow)
- Right: Patterns icon+label
- Bottom bar background: white instead of dark
- Text colors: dark with active state in primary blue

**4. Dashboard.tsx cleanup**
- Fix remaining `gradient-indigo` references → `gradient-navy`

### Files modified
- `src/components/AppLayout.tsx` — all changes above
- `src/pages/Dashboard.tsx` — fix `gradient-indigo` remnants

