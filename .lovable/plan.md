

## Add Admin Link to User Dropdown

Add an "Admin Dashboard" menu item in the existing dropdown menu in `AppLayout.tsx`, visible only when the logged-in user has the admin role.

### Approach

1. **Check admin role** — Add a state variable and effect in `AppLayout` that queries the `admin-stats` edge function or checks `user_roles` via the `has_role` function. Since `user_roles` is locked to service_role only, the simplest approach is to call a lightweight check. Actually, the easiest: just check if the current route or use the existing edge function. Even simpler — since only one admin exists, check `user?.email === 'rok.skrinjar@gmail.com'` client-side for visibility only (security is enforced server-side in the edge function).

   Better approach: Add a small state + effect that calls `supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })`. This is cleaner and scales if more admins are added.

2. **Render conditionally** — In the dropdown, before "Contact", add:
   ```
   {isAdmin && (
     <DropdownMenuItem asChild>
       <Link to="/admin">🛡️ Admin Dashboard</Link>
     </DropdownMenuItem>
   )}
   ```

### Changes

- **`src/components/AppLayout.tsx`** — Import `ShieldCheck` from lucide-react, add `isAdmin` state with `useEffect` calling `has_role` RPC, render admin link in dropdown.

