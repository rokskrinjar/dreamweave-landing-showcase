-- 1. Add DELETE policy to analyses table
CREATE POLICY "Users can delete own analyses"
  ON public.analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Add auth checks to SECURITY DEFINER functions
CREATE OR REPLACE FUNCTION public.can_analyze_dream(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN p_user_id != auth.uid() THEN false
    WHEN p.subscription_tier IN ('pro', 'lifetime') THEN true
    WHEN p.dreams_this_month < 3 THEN true
    ELSE false
  END
  FROM public.profiles p
  WHERE p.user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION public.increment_dream_count(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  UPDATE public.profiles
  SET dreams_this_month = dreams_this_month + 1
  WHERE user_id = p_user_id;
END;
$$;