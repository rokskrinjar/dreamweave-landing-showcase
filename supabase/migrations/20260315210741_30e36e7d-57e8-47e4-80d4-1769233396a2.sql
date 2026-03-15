DROP POLICY "Anyone can insert" ON public.contact_messages;
CREATE POLICY "Anyone can insert own" ON public.contact_messages
  FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);