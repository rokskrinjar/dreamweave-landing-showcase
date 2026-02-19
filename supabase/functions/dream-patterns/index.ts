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

    // Check subscription
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile } = await serviceClient
      .from("profiles")
      .select("subscription_tier")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile || profile.subscription_tier === "free") {
      return new Response(
        JSON.stringify({ error: "Pattern recognition requires a Pro or Lifetime subscription." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch dreams + analyses
    const { data: dreams } = await serviceClient
      .from("dreams")
      .select("title, content, mood, tags, recorded_at")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(30);

    const { data: analyses } = await serviceClient
      .from("analyses")
      .select("summary, symbols, themes, emotions, psychological_insight")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (!dreams || dreams.length < 5) {
      return new Response(
        JSON.stringify({ error: "You need at least 5 dreams to generate pattern insights." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI key not configured");

    const dreamsText = dreams.map((d, i) =>
      `Dream ${i + 1}: "${d.title}" (mood: ${d.mood || "unknown"}, date: ${d.recorded_at})\n${d.content}`
    ).join("\n\n---\n\n");

    const analysesText = analyses && analyses.length > 0
      ? analyses.map((a, i) =>
          `Analysis ${i + 1}: ${a.summary}\nThemes: ${JSON.stringify(a.themes)}\nSymbols: ${JSON.stringify(a.symbols)}`
        ).join("\n\n")
      : "No prior analyses available.";

    const systemPrompt = `You are DreamWeave's pattern recognition AI. You analyze collections of dreams to find recurring patterns, emotional trends, and provide actionable life suggestions.

Be specific and personal. Don't give generic advice. Reference actual patterns you see in the data.

Call the dream_patterns function with your analysis.`;

    const userPrompt = `Here are the user's recent dreams:\n\n${dreamsText}\n\nPrior analyses:\n${analysesText}\n\nFind recurring patterns across these dreams and provide actionable suggestions.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "dream_patterns",
              description: "Return structured pattern analysis across multiple dreams",
              parameters: {
                type: "object",
                properties: {
                  recurring_themes: {
                    type: "array",
                    items: { type: "string" },
                    description: "Recurring themes found across dreams (3-8 themes)"
                  },
                  emotional_patterns: {
                    type: "string",
                    description: "A paragraph describing emotional patterns and cycles detected"
                  },
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 specific, actionable suggestions based on the patterns found"
                  }
                },
                required: ["recurring_themes", "emotional_patterns", "suggestions"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "dream_patterns" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI service is busy. Please try again in a minute." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) throw new Error("No patterns returned from AI");

    const patterns = JSON.parse(toolCall.function.arguments);

    // Sanitize: strip non-ASCII artifacts
    const sanitizeStr = (s: string) => s.replace(/[^\x00-\x7F]/g, '').trim();
    if (Array.isArray(patterns.recurring_themes)) {
      patterns.recurring_themes = patterns.recurring_themes.map(sanitizeStr).filter(Boolean);
    }
    if (Array.isArray(patterns.suggestions)) {
      patterns.suggestions = patterns.suggestions.map(sanitizeStr).filter(Boolean);
    }
    if (typeof patterns.emotional_patterns === 'string') {
      patterns.emotional_patterns = sanitizeStr(patterns.emotional_patterns);
    }

    // Persist to pattern_insights table
    await serviceClient.from("pattern_insights").insert({
      user_id: user.id,
      recurring_themes: patterns.recurring_themes,
      emotional_patterns: patterns.emotional_patterns,
      suggestions: patterns.suggestions,
      dreams_analyzed: dreams.length,
    });

    return new Response(JSON.stringify({ ...patterns, dreams_analyzed: dreams.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("dream-patterns error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
