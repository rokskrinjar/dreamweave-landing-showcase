

## Remove Free Plan Badge & Add Sparkles Icon to Dreamer Badge

### Changes (in both `src/components/CTASection.tsx` and `src/pages/Upgrade.tsx`):

1. **Free plan** — set `badge: null` (already null, confirmed)
2. **Dreamer plan** — add `Sparkles` icon (from Lucide) inside the badge pill, before "Most Popular" text
3. **Import** `Sparkles` from lucide-react in both files
4. **Badge rendering** — for the Dreamer tier, render `<Sparkles className="w-3 h-3 mr-1" />` inline before the badge text

Both files share the same tier array and badge rendering pattern, so the same change applies to each.

