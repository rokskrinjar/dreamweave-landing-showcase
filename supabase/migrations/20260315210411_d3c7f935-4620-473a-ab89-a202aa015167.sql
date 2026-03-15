DROP FUNCTION IF EXISTS public.delete_email(text, bigint);
DROP FUNCTION IF EXISTS public.enqueue_email(text, jsonb);
DROP FUNCTION IF EXISTS public.read_email_batch(text, integer, integer);
DROP FUNCTION IF EXISTS public.move_to_dlq(text, text, bigint, jsonb);