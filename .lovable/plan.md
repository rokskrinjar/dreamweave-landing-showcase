

## Add Navy Color System and Apply Consistently

### What changes

**1. CSS variables and utilities in `src/index.css`**
- Add `--navy-gradient-from: 222 47% 11%` and `--navy-gradient-to: 224 76% 30%` to `:root`
- Update existing `--cta-dark-from` / `--cta-dark-to` values (already present, just confirm they match)
- Add `.gradient-navy` utility class
- Confirm `.cta-dark-gradient` already exists (it does)

**2. Replace all `gradient-indigo` with `gradient-navy`** across these files:
- `src/components/Navbar.tsx` — CTA buttons
- `src/components/AppLayout.tsx` — logo icon
- `src/components/Footer.tsx` — logo icon
- `src/pages/Auth.tsx` — logo icon + buttons
- `src/pages/NewDream.tsx` — save button
- `src/pages/Patterns.tsx` — upgrade + generate buttons
- `src/pages/PaymentSuccess.tsx` — dashboard button
- `src/pages/Contact.tsx` — logo icon
- `src/pages/DreamDetail.tsx` — checkout button + icon
- `src/components/CaseStudy.tsx` — tab pills + calendar icon

**3. Navbar styling** (`src/components/Navbar.tsx`)
- Non-scrolled state: change `bg-[#1a1a2e]` to `cta-dark-gradient` with `border-b border-white/10`
- All buttons: add `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`

**4. How It Works circles** (`src/components/HowItWorks.tsx`)
- Change `bg-[#1a1a2e]` to `gradient-navy` on step icon circles
- Add hover effects: `group-hover:shadow-primary/30 group-hover:shadow-xl transition-all duration-200`

**5. Hero buttons** (`src/components/Hero.tsx`)
- "Start Free" button: keep white bg (it's on a gradient background, white stands out)
- "See It In Action" button: no change needed (already transparent style on gradient bg)

**6. AppLayout header** (`src/components/AppLayout.tsx`)
- Change header from `bg-card` to `cta-dark-gradient` with `border-b border-white/10`
- Update nav link colors to white variants
- Update user menu button to white text

### Files modified (10 files)
- `src/index.css`
- `src/components/Navbar.tsx`
- `src/components/AppLayout.tsx`
- `src/components/HowItWorks.tsx`
- `src/components/Footer.tsx`
- `src/components/CaseStudy.tsx`
- `src/pages/Auth.tsx`
- `src/pages/NewDream.tsx`
- `src/pages/Patterns.tsx`
- `src/pages/PaymentSuccess.tsx`
- `src/pages/Contact.tsx`
- `src/pages/DreamDetail.tsx`

No functionality changes. Pure visual/CSS updates.

