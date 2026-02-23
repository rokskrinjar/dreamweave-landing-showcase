import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BarChart3, Sparkles, Lock, TrendingUp, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
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

// --- Weekly sentiment data for stacked area chart ---

interface WeekData {
  label: string;
  positive: number;
  neutral: number;
  negative: number;
  emotions: string[];
  dreamCount: number;
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function buildWeeklyData(dreams: any[]): WeekData[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the Monday that starts the grid (up to 14 weeks back)
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const endMonday = new Date(today);
  endMonday.setDate(today.getDate() - mondayOffset);
  const startDate = new Date(endMonday);
  startDate.setDate(endMonday.getDate() - 13 * 7);

  // Index dream emotions by date
  const dreamsByDate = new Map<string, string[]>();
  dreams.forEach((d) => {
    if (!d.mood) return;
    const dateKey = toDateKey(new Date(d.recorded_at));
    const emotions = (d.mood as string).split(",").map((s: string) => s.trim().toLowerCase()).filter(Boolean);
    const existing = dreamsByDate.get(dateKey) || [];
    existing.push(...emotions);
    dreamsByDate.set(dateKey, existing);
  });

  const weeks: WeekData[] = [];
  for (let w = 0; w < 14; w++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Skip fully future weeks
    if (weekStart > today) continue;

    const counts: Record<Sentiment, number> = { positive: 0, negative: 0, neutral: 0 };
    const allEmotions: string[] = [];
    let dreamCount = 0;

    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + d);
      if (date > today) break;
      const key = toDateKey(date);
      const emotions = dreamsByDate.get(key) || [];
      if (emotions.length > 0) dreamCount++;
      emotions.forEach((e) => {
        counts[classifySentiment(e)]++;
        allEmotions.push(e);
      });
    }

    const total = counts.positive + counts.negative + counts.neutral;
    const label = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    weeks.push({
      label,
      positive: total > 0 ? Math.round((counts.positive / total) * 100) : 0,
      neutral: total > 0 ? Math.round((counts.neutral / total) * 100) : 0,
      negative: total > 0 ? Math.round((counts.negative / total) * 100) : 0,
      emotions: [...new Set(allEmotions)],
      dreamCount,
    });
  }

  return weeks;
}

// Custom tooltip for the area chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload as WeekData;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">Week of {label}</p>
      <p className="text-muted-foreground mb-2">
        {data.dreamCount} day{data.dreamCount !== 1 ? "s" : ""} with dreams
      </p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS.positive }} />
          <span>Positive: {data.positive}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS.neutral }} />
          <span>Neutral: {data.neutral}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS.negative }} />
          <span>Negative: {data.negative}%</span>
        </div>
      </div>
      {data.emotions.length > 0 && (
        <p className="text-muted-foreground mt-2 capitalize text-xs">
          {data.emotions.join(", ")}
        </p>
      )}
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

const SentimentTrendChart = ({ dreams }: { dreams: any[] }) => {
  const weeklyData = useMemo(() => buildWeeklyData(dreams), [dreams]);

  const dreamsWithMood = dreams.filter((d) => d.mood);
  if (dreamsWithMood.length < 3) {
    return (
      <div className="bg-card rounded-2xl p-12 border border-border mb-8 text-center">
        <p className="text-muted-foreground">
          Record at least 3 dreams with moods to see your sentiment trends.
        </p>
      </div>
    );
  }

  // Filter to only weeks that have any data
  const hasData = weeklyData.some((w) => w.dreamCount > 0);
  if (!hasData) {
    return (
      <div className="bg-card rounded-2xl p-12 border border-border mb-8 text-center">
        <p className="text-muted-foreground">No mood data found for the last 14 weeks.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border mb-8">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" /> Sentiment Trends
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={weeklyData} stackOffset="expand" margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="positive"
            stackId="1"
            stroke={SENTIMENT_COLORS.positive}
            fill={SENTIMENT_COLORS.positive}
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="neutral"
            stackId="1"
            stroke={SENTIMENT_COLORS.neutral}
            fill={SENTIMENT_COLORS.neutral}
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="negative"
            stackId="1"
            stroke={SENTIMENT_COLORS.negative}
            fill={SENTIMENT_COLORS.negative}
            fillOpacity={0.8}
          />
        </AreaChart>
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

        {/* Sentiment Trend Chart */}
        <SentimentTrendChart dreams={dreams} />

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
