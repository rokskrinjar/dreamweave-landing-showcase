CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS trigger LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF current_setting('role') = 'authenticated' THEN
    NEW.subscription_tier := OLD.subscription_tier;
    NEW.stripe_customer_id := OLD.stripe_customer_id;
    NEW.dreams_this_month := OLD.dreams_this_month;
    NEW.is_demo := OLD.is_demo;
  END IF;
  RETURN NEW;
END;
$$;