
CREATE TABLE public.pattern_insights (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  recurring_themes jsonb NOT NULL DEFAULT '[]'::jsonb,
  emotional_patterns text NOT NULL DEFAULT '',
  suggestions jsonb NOT NULL DEFAULT '[]'::jsonb,
  dreams_analyzed integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.pattern_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pattern insights"
  ON public.pattern_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pattern insights"
  ON public.pattern_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_pattern_insights_user_created
  ON public.pattern_insights (user_id, created_at DESC);
