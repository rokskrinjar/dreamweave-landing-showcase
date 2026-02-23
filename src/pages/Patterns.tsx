import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BarChart3, Sparkles, Lock, TrendingUp, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  // Explicitly listed neutrals + any unrecognized emotion
  return "neutral";
};

const SENTIMENT_COLORS: Record<Sentiment, string> = {
  positive: "#10b981",
  negative: "#f43f5e",
  neutral: "#f59e0b",
};

// --- Calendar data ---

interface CalendarDay {
  date: Date;
  dateStr: string;
  emotions: string[];
  dreamCount: number;
  dominantSentiment: Sentiment | null;
}

function buildCalendarData(dreams: any[]): CalendarDay[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the Monday that starts the grid (14 weeks back from end of current week)
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const endMonday = new Date(today);
  endMonday.setDate(today.getDate() - mondayOffset);
  const startDate = new Date(endMonday);
  startDate.setDate(endMonday.getDate() - 13 * 7); // 14 weeks total

  // Index dreams by date string
  const dreamsByDate = new Map<string, string[]>();
  dreams.forEach((d) => {
    if (!d.mood) return;
    const dateKey = new Date(d.recorded_at).toISOString().slice(0, 10);
    const emotions = (d.mood as string).split(",").map((s: string) => s.trim().toLowerCase()).filter(Boolean);
    const existing = dreamsByDate.get(dateKey) || [];
    existing.push(...emotions);
    dreamsByDate.set(dateKey, existing);
  });

  // Count dreams per date
  const dreamCountByDate = new Map<string, number>();
  dreams.forEach((d) => {
    const dateKey = new Date(d.recorded_at).toISOString().slice(0, 10);
    dreamCountByDate.set(dateKey, (dreamCountByDate.get(dateKey) || 0) + 1);
  });

  // Build weeks (columns) x days (rows)
  const weeks: CalendarDay[][] = [];
  for (let w = 0; w < 14; w++) {
    const week: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + w * 7 + d);
      const dateStr = date.toISOString().slice(0, 10);
      const emotions = dreamsByDate.get(dateStr) || [];
      const dreamCount = dreamCountByDate.get(dateStr) || 0;

      let dominantSentiment: Sentiment | null = null;
      if (emotions.length > 0) {
        const counts: Record<Sentiment, number> = { positive: 0, negative: 0, neutral: 0 };
        emotions.forEach((e) => counts[classifySentiment(e)]++);
        // Pick the sentiment with strictly the highest count; default to neutral on tie
        const sorted = (Object.keys(counts) as Sentiment[]).sort((a, b) => counts[b] - counts[a]);
        dominantSentiment = counts[sorted[0]] > counts[sorted[1]] ? sorted[0] : "neutral";
      }

      // Don't show future days
      const isFuture = date > today;
      week.push({
        date,
        dateStr,
        emotions: isFuture ? [] : emotions,
        dreamCount: isFuture ? 0 : dreamCount,
        dominantSentiment: isFuture ? null : dominantSentiment,
      });
    }
    weeks.push(week);
  }

  return weeks;
}

function getMonthLabels(weeks: CalendarDay[][]): { label: string; colIndex: number }[] {
  const labels: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, colIndex) => {
    // Use the Monday of each week
    const month = week[0].date.getMonth();
    if (month !== lastMonth) {
      labels.push({
        label: week[0].date.toLocaleDateString("en-US", { month: "short" }),
        colIndex,
      });
      lastMonth = month;
    }
  });
  return labels;
}

// --- Component ---

interface PatternData {
  recurring_themes: string[];
  emotional_patterns: string;
  suggestions: string[];
  dreams_analyzed?: number;
  created_at?: string;
}

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];
const DAY_LABEL_WIDTH = 32;
const CELL_GAP = 3;
const MIN_CELL = 14;
const MAX_CELL = 24;

const EmotionCalendar = ({ dreams }: { dreams: any[] }) => {
  const weeks = useMemo(() => buildCalendarData(dreams), [dreams]);
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(16);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const available = containerRef.current.clientWidth - DAY_LABEL_WIDTH;
    const size = Math.floor((available - CELL_GAP * 13) / 14);
    setCellSize(Math.max(MIN_CELL, Math.min(MAX_CELL, size)));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const dreamsWithMood = dreams.filter((d) => d.mood);
  if (dreamsWithMood.length < 3) {
    return (
      <div className="bg-card rounded-2xl p-12 border border-border mb-8 text-center">
        <p className="text-muted-foreground">
          Record at least 3 dreams with moods to see your emotion calendar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border mb-8" ref={containerRef}>
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" /> Emotion Calendar
      </h3>

      <div className="overflow-x-auto">
        {/* Month labels */}
        <div className="flex" style={{ paddingLeft: DAY_LABEL_WIDTH + 4 }}>
          {monthLabels.map((m, i) => (
            <span
              key={i}
              className="text-xs text-muted-foreground"
              style={{
                position: "relative",
                left: m.colIndex * (cellSize + CELL_GAP),
                width: 0,
                whiteSpace: "nowrap",
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex mt-1">
          {/* Day labels */}
          <div className="flex flex-col" style={{ width: DAY_LABEL_WIDTH }}>
            {DAY_LABELS.map((label, i) => (
              <span
                key={i}
                className="text-xs text-muted-foreground flex items-center"
                style={{ height: cellSize + CELL_GAP }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Cells */}
          <TooltipProvider delayDuration={100}>
            <div className="flex" style={{ gap: CELL_GAP }}>
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col" style={{ gap: CELL_GAP }}>
                  {week.map((day, dIdx) => {
                    const isFuture = day.emotions.length === 0 && day.dreamCount === 0 && day.date > new Date();
                    const bgColor = day.dominantSentiment
                      ? SENTIMENT_COLORS[day.dominantSentiment]
                      : "hsl(var(--muted))";

                    const cell = (
                      <div
                        style={{
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: isFuture ? "transparent" : bgColor,
                          borderRadius: 3,
                          opacity: isFuture ? 0 : 1,
                        }}
                      />
                    );

                    if (isFuture) return <div key={dIdx} style={{ width: cellSize, height: cellSize }} />;

                    return (
                      <Tooltip key={dIdx}>
                        <TooltipTrigger asChild>
                          {cell}
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs max-w-[200px]">
                          <p className="font-semibold">
                            {day.date.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          {day.dreamCount > 0 ? (
                            <>
                              <p className="text-muted-foreground">
                                {day.dreamCount} dream{day.dreamCount > 1 ? "s" : ""}
                              </p>
                              <p className="capitalize">
                                {[...new Set(day.emotions)].join(", ")}
                              </p>
                            </>
                          ) : (
                            <p className="text-muted-foreground">No dreams</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(var(--muted))" }} />
          Empty
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: SENTIMENT_COLORS.positive }} />
          Positive
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: SENTIMENT_COLORS.neutral }} />
          Neutral
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: SENTIMENT_COLORS.negative }} />
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

        {/* Emotion Calendar Heatmap */}
        <EmotionCalendar dreams={dreams} />

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
