

## Create Rachel Morgan Demo Profile with 15 Dreams

### Step 1: Create the Demo User
Call the `create-demo-user` edge function with Rachel's credentials:
- Email: `rachel.morgan40@gmail.com`
- Password: `DreamWeave#40`
- Display Name: `Rachel Morgan`
- Tier: `pro`

### Step 2: Seed 15 Dreams
Insert all 15 dreams into the `dreams` table using a backend function call (via the service role). Each dream will include:
- Title, content (description), mood (emotions), and the correct `recorded_at` date
- No sentiment or analysis -- Rachel starts fresh so you can demonstrate the analyze-then-patterns flow

| Date | Title | Emotions |
|------|-------|----------|
| Feb 1 | The Empty House | loneliness, grief |
| Feb 3 | The Locked Phone | frustration, anxiety |
| Feb 5 | The Tidal Wave | fear, helplessness |
| Feb 7 | Lost Child | panic, guilt |
| Feb 9 | The Cracked Mirror | insecurity, sadness |
| Feb 11 | High School Hallway | embarrassment, nostalgia |
| Feb 13 | The Burning Journal | conflict, dread |
| Feb 15 | The Stray Dog | compassion, overwhelm |
| Feb 17 | Falling Elevator | loss of control, shock |
| Feb 18 | The Wedding Dress | regret, confusion |
| Feb 20 | The Hidden Room | curiosity, hope |
| Feb 21 | The Silent Argument | frustration, longing |
| Feb 22 | Floating Above the City | detachment, calm |
| Feb 24 | The Missed Train | regret, urgency |
| Feb 25 | Planting Seeds | renewal, cautious optimism |

### Step 3: Create a Seed Edge Function
Create a new edge function `seed-demo-dreams` that accepts a `userId` and an array of dream objects, then bulk-inserts them into the `dreams` table using the service role client. This keeps the seeding process clean and reusable for future demo profiles.

### Files to Create/Modify
- **Create** `supabase/functions/seed-demo-dreams/index.ts` -- new edge function for bulk dream insertion
- No frontend changes needed

### After Deployment
1. Call `create-demo-user` to create Rachel's account
2. Call `seed-demo-dreams` with Rachel's user ID and all 15 dreams
3. Rachel will have 15 recorded dreams, 0 analyzed -- ready to demonstrate the full flow

