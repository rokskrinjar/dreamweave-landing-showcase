import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BarChart3, Sparkles, Lock, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const defaultMoodValues: Record<string, number> = {
  fearful: 0,
  anxious: 1,
  confused: 2,
  nostalgic: 3,
  peaceful: 4,
  euphoric: 5,
};

/**
 * Build a dynamic mood scale that includes both default moods and any custom
 * moods found in the user's dreams, assigning them numeric positions.
 */
const buildMoodScale = (dreams: any[]): { values: Record<string, number>; labels: string[] } => {
  const customMoods = new Set<string>();

  dreams.forEach((d) => {
    if (!d.mood) return;
    const parts = (d.mood as string).split(",").map((s: string) => s.trim().toLowerCase()).filter(Boolean);
    parts.forEach((m) => {
      if (!defaultMoodValues.hasOwnProperty(m)) {
        customMoods.add(m);
      }
    });
  });

  // Insert custom moods between "nostalgic" (3) and "peaceful" (4) by shifting upper defaults up
  const sortedCustom = [...customMoods].sort();
  const customCount = sortedCustom.length;

  // Build full ordered list: fearful(0), anxious(1), confused(2), nostalgic(3), ...custom..., peaceful, euphoric
  const labels: string[] = ["fearful", "anxious", "confused", "nostalgic", ...sortedCustom, "peaceful", "euphoric"];
  const values: Record<string, number> = {};
  labels.forEach((label, i) => {
    values[label] = i;
  });

  return { values, labels };
};

/** Extract the primary mood from a comma-separated mood string */
const getPrimaryMood = (moodStr: string, scale: Record<string, number>): { value: number; label: string } | null => {
  const parts = moodStr.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  // Prefer the first mood that's in our scale
  for (const m of parts) {
    if (scale.hasOwnProperty(m)) {
      return { value: scale[m], label: m };
    }
  }
  return null;
};

interface PatternData {
  recurring_themes: string[];
  emotional_patterns: string;
  suggestions: string[];
  dreams_analyzed?: number;
  created_at?: string;
}

const Patterns = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ subscription_tier: string } | null>(null);
  const [dreams, setDreams] = useState<any[]>([]);
  const [patternData, setPatternData] = useState<PatternData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [profileRes, dreamsRes, insightsRes] = await Promise.all([
        supabase.from("profiles").select("subscription_tier").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("dreams")
          .select("id, title, mood, recorded_at, tags")
          .order("recorded_at", { ascending: true })
          .limit(30),
        supabase
          .from("pattern_insights" as any)
          .select("recurring_themes, emotional_patterns, suggestions, dreams_analyzed, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (dreamsRes.data) setDreams(dreamsRes.data);
      if (insightsRes.data) {
        const d = insightsRes.data as any;
        setPatternData({
          recurring_themes: d.recurring_themes,
          emotional_patterns: d.emotional_patterns,
          suggestions: d.suggestions,
          dreams_analyzed: d.dreams_analyzed,
          created_at: d.created_at,
        });
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const isLocked = profile?.subscription_tier === "free";

  const moodScale = buildMoodScale(dreams);
  const maxMoodValue = moodScale.labels.length - 1;

  const moodChartData = dreams
    .filter((d) => d.mood)
    .map((d) => {
      const parsed = getPrimaryMood(d.mood, moodScale.values);
      if (!parsed) return null;
      return {
        date: new Date(d.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        mood: parsed.value,
        label: parsed.label,
      };
    })
    .filter(Boolean);

  const handleGeneratePatterns = async () => {
    if (!user) return;
    setAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke("dream-patterns", {
        body: { userId: user.id },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setPatternData({
        ...data,
        created_at: new Date().toISOString(),
      });
      toast.success("Pattern analysis complete!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate patterns");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </AppLayout>
    );
  }

  if (isLocked) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Unlock Pattern Recognition</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Upgrade to Pro or Lifetime to see recurring themes, mood trends, and AI-generated insights across all your dreams.
          </p>
          <Button
            onClick={() => { window.location.href = "/#pricing"; }}
            className="gradient-indigo text-white font-semibold px-8 py-6"
          >
            <Sparkles className="w-5 h-5 mr-2" /> Upgrade Now
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dream Patterns</h1>
            <p className="text-muted-foreground mt-1">
              {dreams.length} dreams recorded · Insights from your subconscious
            </p>
          </div>
          {dreams.length >= 5 && (
            <div className="flex flex-col items-end gap-1">
              <Button
                onClick={handleGeneratePatterns}
                disabled={analyzing}
                className="gradient-indigo text-white font-semibold gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                {analyzing ? "Analyzing..." : patternData ? "Refresh Insights" : "Generate Insights"}
              </Button>
              <span className="text-xs text-muted-foreground">Analyzes your last 30 dreams</span>
            </div>
          )}
        </div>

        {/* Mood Chart */}
        {moodChartData.length >= 3 ? (
          <div className="bg-card rounded-2xl p-6 border border-border mb-8">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Mood Over Time
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={moodChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  domain={[0, maxMoodValue]}
                  ticks={moodScale.labels.map((_: string, i: number) => i)}
                  tickFormatter={(v: number) => moodScale.labels[v] || ""}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                />
                <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-12 border border-border mb-8 text-center">
            <p className="text-muted-foreground">
              Record at least 3 dreams with moods to see your mood chart.
            </p>
          </div>
        )}

        {/* AI Pattern Analysis */}
        {patternData ? (
          <div className="space-y-6">
            {/* Metadata */}
            {(patternData.dreams_analyzed || patternData.created_at) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  Based on {patternData.dreams_analyzed || "?"} dreams
                  {patternData.created_at && (
                    <> · Generated {new Date(patternData.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</>
                  )}
                </span>
              </div>
            )}

            {patternData.recurring_themes && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-bold text-foreground mb-3">Recurring Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {patternData.recurring_themes.map((theme: string, i: number) => (
                    <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {patternData.emotional_patterns && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-bold text-foreground mb-3">Emotional Patterns</h3>
                <p className="text-muted-foreground leading-relaxed">{patternData.emotional_patterns}</p>
              </div>
            )}

            {patternData.suggestions && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-bold text-foreground mb-3">Actionable Suggestions</h3>
                <ul className="space-y-2">
                  {patternData.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : dreams.length < 5 ? (
          <div className="bg-card rounded-2xl p-12 border border-border text-center">
            <p className="text-muted-foreground">
              Record at least 5 dreams to unlock AI pattern recognition.
            </p>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
};

export default Patterns;
