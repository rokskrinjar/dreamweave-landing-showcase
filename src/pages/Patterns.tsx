import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BarChart3, Sparkles, Lock, TrendingUp, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// --- Sentiment classification ---

type Sentiment = "positive" | "negative" | "neutral";

const POSITIVE_EMOTIONS = new Set([
  "happy", "excited", "peaceful", "euphoric", "hopeful", "joyful", "content",
  "relieved", "grateful", "loved", "inspired", "confident", "optimistic", "amused",
  "calm", "safe", "brave", "proud", "serene", "relaxed",
]);

const NEGATIVE_EMOTIONS = new Set([
  "fearful", "anxious", "sad", "angry", "frustrated", "lonely", "guilty",
  "ashamed", "jealous", "disgusted", "desperate", "hopeless", "terrified", "overwhelmed",
]);

const NEUTRAL_EMOTIONS = new Set([
  "confused", "nostalgic", "surprised", "curious", "melancholic", "bittersweet",
  "curiosity", "urgency", "wonder", "contemplative",
]);

const classifySentiment = (emotion: string): Sentiment => {
  const e = emotion.trim().toLowerCase();
  if (POSITIVE_EMOTIONS.has(e)) return "positive";
  if (NEGATIVE_EMOTIONS.has(e)) return "negative";
  return "neutral";
};

const SENTIMENT_COLORS: Record<Sentiment, string> = {
  positive: "#10b981",
  negative: "#f43f5e",
  neutral: "#f59e0b",
};

// --- Emotion count data for bar chart ---

interface EmotionCount {
  emotion: string;
  count: number;
  sentiment: Sentiment;
}

function buildEmotionCounts(dreams: any[]): EmotionCount[] {
  const counts = new Map<string, number>();

  dreams.forEach((d) => {
    if (!d.mood) return;
    const emotions = (d.mood as string).split(",").map((s: string) => s.trim().toLowerCase()).filter(Boolean);
    emotions.forEach((e) => {
      counts.set(e, (counts.get(e) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([emotion, count]) => ({ emotion, count, sentiment: classifySentiment(emotion) }))
    .sort((a, b) => b.count - a.count);
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload as EmotionCount;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm capitalize">
      <span className="font-semibold text-foreground">{data.emotion}</span>
      <span className="text-muted-foreground ml-2">× {data.count}</span>
    </div>
  );
};

// --- Component ---

interface PatternData {
  recurring_themes: string[];
  emotional_patterns: string;
  suggestions: string[];
  dreams_analyzed?: number;
  created_at?: string;
}

const EmotionBarChart = ({ dreams }: { dreams: any[] }) => {
  const emotionData = useMemo(() => buildEmotionCounts(dreams), [dreams]);

  if (emotionData.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-12 border border-border mb-8 text-center">
        <p className="text-muted-foreground">
          Record dreams with moods to see your emotion breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border mb-8">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" /> Emotion Breakdown
      </h3>

      <ResponsiveContainer width="100%" height={Math.max(280, emotionData.length * 32)}>
        <BarChart data={emotionData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            type="category"
            dataKey="emotion"
            width={100}
            tick={{ fontSize: 12, fill: "hsl(var(--foreground))", textTransform: "capitalize" } as any}
            tickLine={false}
            axisLine={false}
          />
          <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
            {emotionData.map((entry, index) => (
              <Cell key={index} fill={SENTIMENT_COLORS[entry.sentiment]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS.positive }} />
          Positive
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS.neutral }} />
          Neutral
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS.negative }} />
          Negative
        </div>
      </div>
    </div>
  );
};


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

        {/* Emotion Bar Chart */}
        <EmotionBarChart dreams={dreams} />

        {/* AI Pattern Analysis */}
        {patternData ? (
          <div className="space-y-6">
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
