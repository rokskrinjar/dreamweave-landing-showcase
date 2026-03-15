

## Admin Dashboard

A protected `/admin` route accessible only by your account, showing key metrics and user activity.

### Access Control
- Use a `user_roles` table (enum: admin, user) with a `has_role()` security definer function
- Assign your account the `admin` role
- Create an edge function `admin-stats` that checks the role server-side and returns all data (so we don't need to relax RLS on any tables)

### Dashboard Sections

**1. Overview Cards (KPIs)**
- Total users (real vs demo)
- Total dreams recorded
- Total dreams analyzed (with % analyzed rate)
- Paid subscribers (pro + lifetime count)
- New signups this week/month

**2. User Table**
- Display name, signup date, subscription tier, total dreams, dreams analyzed, last active
- Sort/filter by tier, signup date, activity
- Highlight demo accounts vs real users

**3. Growth Charts**
- Signups over time (daily/weekly)
- Dreams recorded over time
- Conversion rate (free → paid)

**4. Engagement Metrics**
- Average dreams per user
- % of users who recorded at least 1 dream
- % of users who analyzed at least 1 dream
- Most common moods/tags/sentiments across all users
- Users who signed up but never logged a dream (drop-off)

**5. Revenue Overview**
- Active pro subscribers count
- Lifetime purchases count
- MRR estimate (pro count × price)

### Technical Approach

1. **Database migration**: Create `user_roles` table + `has_role()` function + insert your user as admin
2. **Edge function** `admin-stats`: Queries all tables using service role key, returns aggregated stats — only if caller has admin role
3. **Frontend**: New `/admin` page behind `AuthGuard` + admin role check, with cards, a user table, and simple bar charts (using recharts, already in dependencies)

### What You'll See Right Away
Based on current data: 16 total users (9 real, 7 demo), 70 dreams, 54 analyzed, 9 free / 4 pro / 3 lifetime tier users. Your newest real signups from the last 2 days have 1 dream each.

