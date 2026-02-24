import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Not authenticated");

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch dreams without sentiment for this user
    const { data: dreams, error: fetchError } = await serviceClient
      .from("dreams")
      .select("id, title, mood")
      .eq("user_id", user.id)
      .is("sentiment", null);

    if (fetchError) throw fetchError;
    if (!dreams || dreams.length === 0) {
      return new Response(JSON.stringify({ updated: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI key not configured");

    // Build a prompt listing all dreams
    const dreamList = dreams.map((d, i) => 
      `${i + 1}. ID: ${d.id} | Title: "${d.title}" | Mood: ${d.mood || "unknown"}`
    ).join("\n");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a sentiment classifier for dreams. Classify each dream as positive, neutral, or negative based on its title and mood. Call the classify_dreams function with your classifications.",
          },
          {
            role: "user",
            content: `Classify the sentiment of each dream:\n\n${dreamList}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_dreams",
              description: "Return sentiment classifications for a batch of dreams",
              parameters: {
                type: "object",
                properties: {
                  classifications: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "The dream ID" },
                        sentiment: {
                          type: "string",
                          enum: ["positive", "neutral", "negative"],
                        },
                      },
                      required: ["id", "sentiment"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["classifications"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "classify_dreams" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      throw new Error("AI classification failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("No classifications returned");

    const { classifications } = JSON.parse(toolCall.function.arguments);

    // Update each dream
    let updated = 0;
    for (const c of classifications) {
      if (["positive", "neutral", "negative"].includes(c.sentiment)) {
        const { error } = await serviceClient
          .from("dreams")
          .update({ sentiment: c.sentiment })
          .eq("id", c.id)
          .eq("user_id", user.id);
        if (!error) updated++;
      }
    }

    return new Response(JSON.stringify({ updated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("backfill-sentiments error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
