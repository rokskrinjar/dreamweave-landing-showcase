import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const analyzeDreamSchema = z.object({
  dreamId: z.string().uuid(),
  content: z.string().min(10).max(10000),
  title: z.string().min(1).max(200),
  mood: z.string().max(500).optional().nullable(),
});

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

    const parsed = analyzeDreamSchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { dreamId, content, title, mood } = parsed.data;

    // Check if user can analyze
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: canAnalyze } = await serviceClient.rpc("can_analyze_dream", { p_user_id: user.id });
    if (!canAnalyze) {
      return new Response(
        JSON.stringify({ error: "You've used all 3 free analyses this month. Upgrade to Pro for unlimited analyses." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if analysis already exists
    const { data: existing } = await serviceClient
      .from("analyses")
      .select("id")
      .eq("dream_id", dreamId)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "This dream has already been analyzed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI key not configured");

    const systemPrompt = `You are DreamWeave's AI dream analyst. You are an expert in dream psychology, drawing from Jungian, Freudian, Gestalt, and cognitive approaches.

Analyze the following dream and return structured insights. Be specific, insightful, and relate symbols to the dreamer's potential waking life.

Respond by calling the analyze_dream function with your analysis.`;

    const userPrompt = `Dream title: "${title}"
${mood ? `Mood upon waking: ${mood}` : ""}

Dream content:
${content}`;

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
              name: "analyze_dream",
              description: "Return a structured dream analysis",
              parameters: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "A 2-3 sentence summary of the dream's core meaning"
                  },
                  symbols: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        meaning: { type: "string" }
                      },
                      required: ["name", "meaning"],
                      additionalProperties: false
                    },
                    description: "Key symbols found in the dream (3-6 symbols)"
                  },
                  themes: {
                    type: "array",
                    items: { type: "string" },
                    description: "Major psychological themes (2-4 themes)"
                  },
                  emotions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Emotions detected in the dream (3-5 emotions)"
                  },
                  psychological_insight: {
                    type: "string",
                    description: "A detailed psychological interpretation (3-5 sentences) connecting dream content to potential waking life situations"
                  },
                  sentiment: {
                    type: "string",
                    enum: ["positive", "neutral", "negative"],
                    description: "Overall sentiment of the dream: positive, neutral, or negative"
                  }
                },
                required: ["summary", "symbols", "themes", "emotions", "psychological_insight", "sentiment"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_dream" } },
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
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) throw new Error("No analysis returned from AI");

    const analysis = JSON.parse(toolCall.function.arguments);

    // Sanitize: strip non-ASCII artifacts from string arrays
    const sanitizeStr = (s: string) => s.replace(/[^\x00-\x7F]/g, '').trim();
    if (Array.isArray(analysis.themes)) {
      analysis.themes = analysis.themes.map(sanitizeStr).filter(Boolean);
    }
    if (Array.isArray(analysis.emotions)) {
      analysis.emotions = analysis.emotions.map(sanitizeStr).filter(Boolean);
    }
    if (Array.isArray(analysis.symbols)) {
      analysis.symbols = analysis.symbols.map((s: any) => ({
        name: sanitizeStr(s.name || ''),
        meaning: sanitizeStr(s.meaning || ''),
      })).filter((s: any) => s.name);
    }

    // Save sentiment to dream record
    if (analysis.sentiment) {
      await serviceClient.from("dreams").update({ sentiment: analysis.sentiment }).eq("id", dreamId);
    }

    // Save analysis
    const { error: insertError } = await serviceClient.from("analyses").insert({
      dream_id: dreamId,
      user_id: user.id,
      summary: analysis.summary,
      symbols: analysis.symbols,
      themes: analysis.themes,
      emotions: analysis.emotions,
      psychological_insight: analysis.psychological_insight,
    });

    if (insertError) throw insertError;

    // Increment count
    await serviceClient.rpc("increment_dream_count", { p_user_id: user.id });

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-dream error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
