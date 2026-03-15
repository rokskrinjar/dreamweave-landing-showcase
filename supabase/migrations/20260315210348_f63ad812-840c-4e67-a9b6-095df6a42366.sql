CREATE OR REPLACE FUNCTION public.delete_email(message_id bigint, queue_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  EXECUTE format('DELETE FROM pgmq.q_%s WHERE msg_id = $1', queue_name) USING message_id;
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.enqueue_email(payload jsonb, queue_name text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  msg_id bigint;
BEGIN
  SELECT pgmq.send(queue_name, payload) INTO msg_id;
  RETURN msg_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.read_email_batch(batch_size integer, queue_name text, vt integer)
RETURNS TABLE(message jsonb, msg_id bigint, read_ct integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY SELECT (r).message, (r).msg_id, (r).read_ct
  FROM pgmq.read(queue_name, vt, batch_size) r;
END;
$$;

CREATE OR REPLACE FUNCTION public.move_to_dlq(dlq_name text, message_id bigint, payload jsonb, source_queue text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_msg_id bigint;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_msg_id;
  EXECUTE format('DELETE FROM pgmq.q_%s WHERE msg_id = $1', source_queue) USING message_id;
  RETURN new_msg_id;
END;
$$;