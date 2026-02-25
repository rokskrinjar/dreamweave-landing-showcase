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

    if (!analyses || analyses.length < 5) {
      return new Response(
        JSON.stringify({ error: "You need at least 5 analyzed dreams to generate pattern insights." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI key not configured");

    const analysesText = analyses.map((a: any, i: number) =>
      `Analysis ${i + 1}: ${a.summary}\nThemes: ${JSON.stringify(a.themes)}\nSymbols: ${JSON.stringify(a.symbols)}\nEmotions: ${JSON.stringify(a.emotions)}\nInsight: ${a.psychological_insight || "N/A"}`
    ).join("\n\n");

    const dreamsText = dreams && dreams.length > 0
      ? dreams.map((d: any, i: number) =>
          `Dream ${i + 1}: "${d.title}" (mood: ${d.mood || "unknown"}, date: ${d.recorded_at})\n${d.content}`
        ).join("\n\n---\n\n")
      : "";

    const dreamCount = analyses.length;
    let depthInstruction: string;
    if (dreamCount >= 15) {
      depthInstruction = `The user has EXACTLY ${dreamCount} analyzed dreams — this is a substantial dataset. Write a COMPREHENSIVE psychological profile for the emotional_patterns field. This should be 4-6 paragraphs covering: dominant emotional cycles, defense mechanisms, unresolved tensions, attachment patterns visible in dream content, and how their emotional landscape has evolved over time. Use **bold** for key psychological terms and pattern names. Be specific and reference actual patterns from the data. IMPORTANT: When referring to the number of dreams, always say "${dreamCount} dreams" — never round or approximate.`;
    } else if (dreamCount >= 10) {
      depthInstruction = `The user has EXACTLY ${dreamCount} analyzed dreams — a solid dataset. Write a DETAILED emotional analysis for the emotional_patterns field. This should be 2-3 paragraphs covering: primary emotional cycles, recurring emotional triggers, and notable shifts over time. Use **bold** for key findings. Be specific and reference actual patterns. IMPORTANT: When referring to the number of dreams, always say "${dreamCount} dreams" — never round or approximate.`;
    } else {
      depthInstruction = `The user has EXACTLY ${dreamCount} analyzed dreams. Write a concise but insightful paragraph for the emotional_patterns field, highlighting the most prominent emotional trends. Use **bold** for key findings. IMPORTANT: When referring to the number of dreams, always say "${dreamCount} dreams" — never round or approximate.`;
    }

    const systemPrompt = `You are DreamWeave's pattern recognition AI. You analyze dream analyses to find recurring patterns, emotional trends, and provide actionable life suggestions.

Be specific and personal. Don't give generic advice. Reference actual patterns you see in the analysis data.

${depthInstruction}

Provide 5-10 actionable suggestions spanning different life areas: mindset shifts, daily habits, sleep hygiene, emotional processing techniques, relationships/social, and physical wellbeing. Go beyond purely psychological advice.

Call the dream_patterns function with your analysis.`;

    const userPrompt = `Here are the AI analyses of the user's ${dreamCount} dreams (primary source):\n\n${analysesText}${dreamsText ? `\n\nSupplementary raw dream content:\n\n${dreamsText}` : ""}\n\nFind recurring patterns across these analyses and provide actionable suggestions. Remember: scale the depth of your emotional patterns analysis to match the volume of data available.`;

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
                    description: "Emotional patterns analysis with **bold** markdown for key terms. Length scales with data: 1 paragraph for 5-9 dreams, 2-3 paragraphs for 10-14 dreams, 4-6 paragraphs as a full psychological profile for 15+ dreams."
                  },
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "5-10 specific, actionable suggestions spanning different life areas (mindset, daily habits, sleep hygiene, emotional processing, relationships, physical wellbeing)"
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
      dreams_analyzed: analyses.length,
    });

    return new Response(JSON.stringify({ ...patterns, dreams_analyzed: analyses.length }), {
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
