

## Replace Crown Icon with Sparkles Across the App

### Problem
The Crown icon feels too "money-focused." The user wants a Sparkles/stars icon instead — matching the vibe of the Dreamer plan.

### Changes

**3 files, simple find-and-replace of `Crown` → `Sparkles`:**

1. **`src/pages/DreamDetail.tsx`**
   - Remove `Crown` from import (already has `Sparkles`)
   - Remove `Loader2` (part of the approved plan to simplify limit-reached block)
   - Replace all `<Crown .../>` with `<Sparkles .../>`

2. **`src/pages/Dashboard.tsx`**
   - Remove `Crown` from import (already has `Sparkles`)
   - Replace `<Crown className="w-4 h-4" />` → `<Sparkles className="w-4 h-4" />` in both "View Plans" buttons

3. **`src/components/AppLayout.tsx`**
   - Remove `Crown` from import, add `Sparkles` if not present
   - Replace `<Crown className="w-3 h-3" />` → `<Sparkles className="w-3 h-3" />` next to tier label

All instances use the same `Sparkles` icon from `lucide-react` that's already imported in most files.

