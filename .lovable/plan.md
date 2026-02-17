

## High-Converting Dream Dashboard Upgrade

### The Problem
1. **No visual distinction** between analyzed and unanalyzed dreams on the dashboard -- users can't tell which dreams have AI insights
2. **No proactive upgrade CTA** on the dashboard for free users -- the upgrade prompt only appears AFTER they click into a dream and try to analyze it (too late, too buried)
3. Free users can record unlimited dreams but only analyze 3/month -- this gap is an untapped conversion lever

### The Solution: 3-Part Conversion System

#### 1. Analysis Status Badges on Dream Cards
Each dream card on the dashboard gets a small badge:
- **Analyzed dreams**: Green "Analyzed" badge with a sparkle icon -- signals value already received
- **Unanalyzed dreams**: Amber "Not analyzed" badge -- creates curiosity and FOMO

This is fetched by joining the `analyses` table when loading dreams (checking if an analysis exists for each dream_id).

#### 2. Inline Upgrade Banner on Dashboard (Free Users Only)
When a free user has 0 analyses remaining AND has unanalyzed dreams, show a prominent but non-intrusive banner between the search bar and the dream list:

> "You have X unanalyzed dreams waiting for insights. Upgrade to unlock unlimited AI analysis."
> [Unlock All Dreams - $9.99/mo] button

This banner uses urgency (specific count of unanalyzed dreams) + value framing (insights waiting).

#### 3. Smart CTA on Unanalyzed Dream Cards (Free Users at Limit)
When a free user has hit their limit, unanalyzed dream cards show a small lock icon + "Upgrade to analyze" text overlay on hover, linking directly to pricing. This turns every unanalyzed dream into a conversion touchpoint.

### Technical Changes

**`src/pages/Dashboard.tsx`**:
- Fetch analyses alongside dreams to determine analysis status per dream (query `analyses` table for `dream_id` matches)
- Add analysis status badge (sparkle icon + "Analyzed" or "Awaiting analysis") to each dream card
- Add upgrade banner component for free users at their limit with unanalyzed dream count
- Show subtle lock/upgrade hint on unanalyzed cards when limit is reached

**No new files needed** -- all changes are contained within Dashboard.tsx.

### Why This Converts
- **Visibility**: Users SEE the value gap on every visit (analyzed vs not)
- **Specificity**: "You have 4 unanalyzed dreams" is more compelling than "Upgrade for more"
- **Friction-free**: The upgrade CTA is always visible, not hidden behind a failed action
- **Social proof of value**: Analyzed dreams with their green badge show the product works

