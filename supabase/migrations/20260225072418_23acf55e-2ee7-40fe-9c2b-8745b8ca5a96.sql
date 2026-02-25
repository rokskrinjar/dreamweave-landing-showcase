CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own" ON public.contact_messages FOR SELECT USING (auth.uid() = user_id);