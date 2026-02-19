import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ subscribed: false, tier: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use getClaims to validate the JWT token
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      logStep("Invalid token, returning free tier");
      return new Response(JSON.stringify({ subscribed: false, tier: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;
    const email = claimsData.claims.email as string;
    if (!email) {
      return new Response(JSON.stringify({ subscribed: false, tier: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    logStep("User authenticated", { userId, email });

    // Use service role client for DB updates
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found");

      // Check if profile has a manually-set tier (e.g. lifetime granted manually)
      const { data: profile } = await supabaseAdmin.from("profiles")
        .select("subscription_tier")
        .eq("user_id", userId)
        .single();

      if (profile?.subscription_tier === "lifetime") {
        logStep("Profile has manually-set lifetime tier, preserving it");
        return new Response(JSON.stringify({ subscribed: true, tier: "lifetime" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabaseAdmin.from("profiles").update({
        subscription_tier: "free",
        stripe_customer_id: null,
      }).eq("user_id", userId);

      return new Response(JSON.stringify({ subscribed: false, tier: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check active subscriptions (Pro)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      const sub = subscriptions.data[0];
      const periodEnd = sub.current_period_end
        ?? sub.items?.data?.[0]?.current_period_end;
      const subscriptionEnd = periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null;
      logStep("Active subscription found", { subscriptionEnd });

      await supabaseAdmin.from("profiles").update({
        subscription_tier: "pro",
        stripe_customer_id: customerId,
      }).eq("user_id", userId);

      return new Response(JSON.stringify({
        subscribed: true,
        tier: "pro",
        subscription_end: subscriptionEnd,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for lifetime one-time payment
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 100,
    });

    const lifetimePurchase = sessions.data.find(
      (s) => s.payment_status === "paid" && s.mode === "payment"
    );

    if (lifetimePurchase) {
      logStep("Lifetime purchase found");
      await supabaseAdmin.from("profiles").update({
        subscription_tier: "lifetime",
        stripe_customer_id: customerId,
      }).eq("user_id", userId);

      return new Response(JSON.stringify({
        subscribed: true,
        tier: "lifetime",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("No active subscription or lifetime purchase");
    await supabaseAdmin.from("profiles").update({
      subscription_tier: "free",
      stripe_customer_id: customerId,
    }).eq("user_id", userId);

    return new Response(JSON.stringify({ subscribed: false, tier: "free" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
