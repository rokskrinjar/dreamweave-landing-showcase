import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BarChart3, Sparkles, TrendingUp, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend as RechartsLegend,
} from "recharts";

// --- Sentiment types ---

type Sentiment = "positive" | "negative" | "neutral";

const SENTIMENT_COLORS: Record<Sentiment, string> = {
  positive: "#10b981",
  negative: "#f43f5e",
  neutral: "#f59e0b",
};

const EMOTION_PALETTE: Record<Sentiment, string[]> = {
  positive: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#059669", "#047857"],
  negative: ["#f43f5e", "#fb7185", "#fda4af", "#e11d48", "#be123c", "#9f1239"],
  neutral:  ["#f59e0b", "#fbbf24", "#fcd34d", "#d97706", "#b45309", "#92400e"],
};

interface StackedBar {
  category: string;
  [emotion: string]: string | number;
}

function buildStackedData(dreams: any[]) {
  // Group emotions by the dream's AI-classified sentiment
  const grouped: Record<Sentiment, Map<string, number>> = {
    positive: new Map(),
    negative: new Map(),
    neutral: new Map(),
  };

  dreams.forEach((d) => {
    if (!d.mood || !d.sentiment) return;
    const sentiment: Sentiment = d.sentiment;
    const emotions = (d.mood as string).split(",").map((s: string) => s.trim().toLowerCase()).filter(Boolean);
    emotions.forEach((e) => {
      grouped[sentiment].set(e, (grouped[sentiment].get(e) || 0) + 1);
    });
  });

  const categories: Sentiment[] = ["positive", "neutral", "negative"];
  const bars: StackedBar[] = [];
  const allEmotionKeys: { key: string; sentiment: Sentiment; color: string }[] = [];

  categories.forEach((cat) => {
    const emotions = Array.from(grouped[cat].entries()).sort((a, b) => b[1] - a[1]);
    const bar: StackedBar = { category: cat.charAt(0).toUpperCase() + cat.slice(1) };
    emotions.forEach(([emotion, count], i) => {
      bar[emotion] = count;
      if (!allEmotionKeys.find((k) => k.key === emotion)) {
        const palette = EMOTION_PALETTE[cat];
        allEmotionKeys.push({ key: emotion, sentiment: cat, color: palette[i % palette.length] });
      }
    });
    bars.push(bar);
  });

  return { bars, allEmotionKeys };
}

const StackedTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const items = payload.filter((p: any) => p.value > 0).sort((a: any, b: any) => b.value - a.value);
  const total = items.reduce((sum: number, p: any) => sum + p.value, 0);
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm max-w-[200px]">
      <p className="font-semibold text-foreground mb-1">{label} ({total})</p>
      {items.map((item: any) => (
        <div key={item.dataKey} className="flex items-center gap-1.5 capitalize">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span className="text-muted-foreground">{item.dataKey}</span>
          <span className="ml-auto text-foreground font-medium">{item.value}</span>
        </div>
      ))}
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

const EmotionBarChartInner = ({ dreams }: { dreams: any[] }) => {
  const { bars, allEmotionKeys } = useMemo(() => buildStackedData(dreams), [dreams]);
  const hasData = allEmotionKeys.length > 0;

  if (!hasData) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">
          Record dreams with moods to see your emotion breakdown.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={bars} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
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
            dataKey="category"
            width={80}
            tick={{ fontSize: 13, fill: "hsl(var(--foreground))", fontWeight: 600 } as any}
            tickLine={false}
            axisLine={false}
          />
          <RechartsTooltip content={<StackedTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
          {allEmotionKeys.map((ek) => (
            <Bar key={ek.key} dataKey={ek.key} stackId="a" fill={ek.color} radius={0} barSize={28} />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-muted-foreground">
        {allEmotionKeys.map((ek) => (
          <div key={ek.key} className="flex items-center gap-1 capitalize">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: ek.color }} />
            {ek.key}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Mood over Time chart ---

function buildMoodOverTimeData(dreams: any[]) {
  const SCORE: Record<Sentiment, number> = { positive: 1, neutral: 0, negative: -1 };
  return dreams
    .filter((d) => d.sentiment)
    .map((d) => {
      const sentiment: Sentiment = d.sentiment;
      const score = SCORE[sentiment];
      const date = new Date(d.recorded_at);
      const emotions = d.mood ? (d.mood as string).split(",").map((s: string) => s.trim()).filter(Boolean).join(", ") : "";
      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        timestamp: date.getTime(),
        score,
        emotions,
      };
    })
    .sort((a: any, b: any) => a.timestamp - b.timestamp);
}

const MoodTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const score = d?.score ?? 0;
  const sentimentLabel = score > 0.25 ? "Positive" : score < -0.25 ? "Negative" : "Neutral";
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm max-w-[220px]">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground capitalize text-xs mb-1">{d?.emotions}</p>
      <p className="text-foreground font-medium">{sentimentLabel} ({score})</p>
    </div>
  );
};

const sentimentColor = (score: number) =>
  score > 0.25 ? "#10b981" : score < -0.25 ? "#f43f5e" : "#f59e0b";

const CustomMoodLine = (props: any) => {
  const { points } = props;
  if (!points || points.length < 2) return null;
  return (
    <g>
      {points.slice(1).map((point: any, i: number) => {
        const prev = points[i];
        const avgScore = ((prev.payload?.score ?? 0) + (point.payload?.score ?? 0)) / 2;
        return (
          <line
            key={i}
            x1={prev.x}
            y1={prev.y}
            x2={point.x}
            y2={point.y}
            stroke={sentimentColor(avgScore)}
            strokeWidth={2}
          />
        );
      })}
    </g>
  );
};

const MoodOverTimeChart = ({ dreams }: { dreams: any[] }) => {
  const data = useMemo(() => buildMoodOverTimeData(dreams), [dreams]);
  if (data.length < 2) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Record at least 2 dreams with moods to see trends.</p>
      </div>
    );
  }
  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
          <YAxis
            domain={[-1, 1]}
            ticks={[-1, -0.5, 0, 0.5, 1]}
            tickFormatter={(v: number) => v === 1 ? "Positive" : v === -1 ? "Negative" : v === 0 ? "Neutral" : ""}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <RechartsTooltip content={<MoodTooltip />} />
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
              {data.map((d, i) => {
                const pct = data.length === 1 ? 50 : (i / (data.length - 1)) * 100;
                return (
                  <stop key={i} offset={`${pct}%`} stopColor={sentimentColor(d.score)} />
                );
              })}
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="score"
            stroke="url(#moodGradient)"
            strokeWidth={2}
            dot={({ cx, cy, payload }: any) => {
              const score = payload?.score ?? 0;
              const color = sentimentColor(score);
              return <circle cx={cx} cy={cy} r={4} fill={color} stroke={color} />;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const Patterns = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ subscription_tier: string } | null>(null);
  const [dreams, setDreams] = useState<any[]>([]);
  const [patternData, setPatternData] = useState<PatternData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [backfilling, setBackfilling] = useState(false);

  const fetchDreams = useCallback(async () => {
    if (!user) return [];
    // Only fetch dreams that have been analyzed
    const { data: analysisRows } = await supabase
      .from("analyses")
      .select("dream_id");
    const analyzedIds = (analysisRows || []).map((a: any) => a.dream_id);
    if (analyzedIds.length === 0) return [];
    const { data } = await supabase
      .from("dreams")
      .select("id, title, mood, recorded_at, tags, sentiment")
      .in("id", analyzedIds)
      .order("recorded_at", { ascending: true })
      .limit(30);
    return data || [];
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [profileRes, dreamsData, insightsRes] = await Promise.all([
        supabase.from("profiles").select("subscription_tier").eq("user_id", user.id).maybeSingle(),
        fetchDreams(),
        supabase
          .from("pattern_insights" as any)
          .select("recurring_themes, emotional_patterns, suggestions, dreams_analyzed, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      setDreams(dreamsData);
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
  }, [user, fetchDreams]);

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

  // Placeholder data for locked preview
  const placeholderBars = [
    { category: "Positive", value: 5 },
    { category: "Neutral", value: 3 },
    { category: "Negative", value: 2 },
  ];
  const placeholderBarColors = ["#10b981", "#f59e0b", "#f43f5e"];

  const placeholderMoodData = [
    { date: "Mar 1", score: 0.3 },
    { date: "Mar 5", score: 0.6 },
    { date: "Mar 10", score: -0.1 },
    { date: "Mar 15", score: -0.4 },
    { date: "Mar 20", score: 0.2 },
    { date: "Mar 25", score: 0.5 },
  ];

  if (isLocked) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dream Patterns</h1>
              <p className="text-muted-foreground mt-1">Insights from your subconscious</p>
            </div>
            <Button
              onClick={() => navigate("/upgrade")}
              className="gradient-navy text-white font-semibold gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <TrendingUp className="w-4 h-4" />
              Upgrade to Dreamer
            </Button>
          </div>

          {/* Charts card */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-8">
            <Tabs defaultValue="emotions">
              <TabsList className="mb-4">
                <TabsTrigger value="emotions" className="gap-1.5">
                  <BarChart3 className="w-4 h-4" /> Emotion Breakdown
                </TabsTrigger>
                <TabsTrigger value="mood-time" className="gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Mood over Time
                </TabsTrigger>
              </TabsList>
              <TabsContent value="emotions">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={placeholderBars} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
                    <YAxis type="category" dataKey="category" width={80} tick={{ fontSize: 13, fill: "hsl(var(--foreground))", fontWeight: 600 } as any} tickLine={false} axisLine={false} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
                      {placeholderBars.map((_, i) => (
                        <Cell key={i} fill={placeholderBarColors[i]} opacity={0.5} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="mood-time">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={placeholderMoodData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
                    <YAxis domain={[-1, 1]} ticks={[-1, 0, 1]} tickFormatter={(v: number) => v === 1 ? "Positive" : v === -1 ? "Negative" : "Neutral"} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={70} />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeOpacity={0.4} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
            <p className="text-muted-foreground text-sm mt-6 text-center">Your subconscious has patterns. Are you ready to see them?</p>
            <div className="flex justify-center mt-3">
              <Button onClick={() => navigate("/upgrade")} className="gradient-navy text-white px-8">Unlock My Patterns</Button>
            </div>
            <p className="text-muted-foreground text-xs mt-4 text-center">Your emotional data will appear here after upgrading.</p>
          </div>

          {/* What you'll discover */}
          <div className="mt-10 mb-8 px-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground text-lg">What you'll discover:</h3>
            </div>
            <ul className="space-y-3 text-muted-foreground text-sm ml-7 list-disc">
              <li>Recurring emotional themes across all your dreams</li>
              <li>Your personal mood timeline and how it shifts over time</li>
              <li>Deep psychological insights and actionable suggestions tailored to you</li>
            </ul>
          </div>
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
              {dreams.length} dreams analyzed · Insights from your subconscious
            </p>
          </div>
          {dreams.length >= 5 && (
            <div className="flex flex-col items-end gap-1">
              <Button
                onClick={handleGeneratePatterns}
                disabled={analyzing}
                className="gradient-navy text-white font-semibold gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <TrendingUp className="w-4 h-4" />
                {analyzing ? "Analyzing..." : patternData ? "Refresh Insights" : "Generate Insights"}
              </Button>
              <span className="text-xs text-muted-foreground">Based on your last 30 analyses</span>
            </div>
          )}
        </div>

        {dreams.length < 5 ? (
          <div className="bg-card rounded-2xl p-12 border border-border text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Unlock Pattern Insights</h3>
            <p className="text-muted-foreground">
              Analyze at least 5 dreams to unlock AI pattern recognition and charts. You have {dreams.length} analyzed so far.
            </p>
          </div>
        ) : (
          <>
            {/* Tabbed Charts */}
            <div className="bg-card rounded-2xl p-6 border border-border mb-8">
              <Tabs defaultValue="emotions">
                <TabsList className="mb-4">
                  <TabsTrigger value="emotions" className="gap-1.5">
                    <BarChart3 className="w-4 h-4" /> Emotion Breakdown
                  </TabsTrigger>
                  <TabsTrigger value="mood-time" className="gap-1.5">
                    <TrendingUp className="w-4 h-4" /> Mood over Time
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="emotions">
                  <EmotionBarChartInner dreams={dreams} />
                </TabsContent>
                <TabsContent value="mood-time">
                  <MoodOverTimeChart dreams={dreams} />
                </TabsContent>
              </Tabs>
            </div>

            {/* AI Pattern Analysis */}
            {patternData && (
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
                    <div className="text-muted-foreground leading-relaxed space-y-3">
                      {patternData.emotional_patterns.split('\n').filter(Boolean).map((paragraph, i) => {
                        // Frontend safety net: strip lead-ins with wrong dream counts
                        let cleaned = paragraph;
                        if (patternData.dreams_analyzed) {
                          const count = patternData.dreams_analyzed;
                          cleaned = cleaned.replace(
                            /(across|based on|of|from|analyzing|analyzed|in)\s+(these|the|their)?\s*(\d+|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty)\s+dreams?/gi,
                            (match, prep, article, num) => {
                              const wordToNum: Record<string, number> = { zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50 };
                              const mentioned = wordToNum[num.toLowerCase()] ?? parseInt(num, 10);
                              if (isNaN(mentioned) || mentioned === count) return match;
                              const art = article ? `${article} ` : "";
                              return `${prep} ${art}${count} dreams`;
                            }
                          );
                        }
                        // Strip markdown bold markers instead of rendering them
                        const plain = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
                        return (
                          <p key={i}>{plain}</p>
                        );
                      })}
                    </div>
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
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Patterns;
