import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Brain, Heart, Eye, Lightbulb, Trash2 } from "lucide-react";

interface Dream {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  tags: string[];
  recorded_at: string;
}

interface Analysis {
  id: string;
  summary: string | null;
  symbols: any;
  themes: any;
  emotions: any;
  psychological_insight: string | null;
  created_at: string;
}

const DreamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dream, setDream] = useState<Dream | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!id || !user) return;

    const fetch = async () => {
      const [dreamRes, analysisRes] = await Promise.all([
        supabase.from("dreams").select("*").eq("id", id).maybeSingle(),
        supabase.from("analyses").select("*").eq("dream_id", id).maybeSingle(),
      ]);

      if (dreamRes.error || !dreamRes.data) {
        toast.error("Dream not found");
        navigate("/dashboard");
        return;
      }

      setDream(dreamRes.data);
      if (analysisRes.data) setAnalysis(analysisRes.data);
      setLoading(false);
    };

    fetch();
  }, [id, user]);

  const handleAnalyze = async () => {
    if (!dream || !user) return;
    setAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-dream", {
        body: { dreamId: dream.id, content: dream.content, title: dream.title, mood: dream.mood },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Refetch analysis
      const { data: analysisData } = await supabase
        .from("analyses")
        .select("*")
        .eq("dream_id", dream.id)
        .maybeSingle();

      if (analysisData) setAnalysis(analysisData);
      toast.success("Dream analyzed!");
    } catch (error: any) {
      toast.error(error.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (!dream || !confirm("Delete this dream permanently?")) return;

    const { error } = await supabase.from("dreams").delete().eq("id", dream.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Dream deleted");
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </AppLayout>
    );
  }

  if (!dream) return null;

  const moodColors: Record<string, string> = {
    peaceful: "bg-emerald-100 text-emerald-700",
    anxious: "bg-amber-100 text-amber-700",
    euphoric: "bg-blue-100 text-blue-700",
    confused: "bg-purple-100 text-purple-700",
    nostalgic: "bg-indigo-100 text-indigo-700",
    fearful: "bg-red-100 text-red-700",
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={handleDelete} className="text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Dream content */}
        <div className="bg-card rounded-2xl p-8 border border-border mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-foreground">{dream.title}</h1>
            {dream.mood && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${moodColors[dream.mood] || "bg-muted text-muted-foreground"}`}>
                {dream.mood}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {new Date(dream.recorded_at).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{dream.content}</p>
          {dream.tags && dream.tags.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {dream.tags.map((tag) => (
                <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Analysis */}
        {analysis ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Analysis
            </h2>

            {analysis.summary && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Summary
                </h3>
                <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
              </div>
            )}

            {analysis.symbols && analysis.symbols.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" /> Key Symbols
                </h3>
                <div className="space-y-3">
                  {analysis.symbols.map((symbol: any, i: number) => (
                    <div key={i} className="border-l-2 border-primary/30 pl-4">
                      <p className="font-medium text-foreground">{symbol.name || symbol}</p>
                      {symbol.meaning && <p className="text-sm text-muted-foreground">{symbol.meaning}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.themes && analysis.themes.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" /> Themes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.themes.map((theme: any, i: number) => (
                    <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {typeof theme === "string" ? theme : theme.name || theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.emotions && analysis.emotions.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" /> Emotions Detected
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.emotions.map((emotion: any, i: number) => (
                    <span key={i} className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {typeof emotion === "string" ? emotion : emotion.name || emotion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.psychological_insight && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" /> Psychological Insight
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysis.psychological_insight}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center bg-card rounded-2xl p-12 border border-border">
            <div className="w-16 h-16 gradient-indigo rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Ready to analyze this dream?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our AI will identify symbols, themes, and emotional patterns to help you understand what your subconscious is telling you.
            </p>
            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="gradient-indigo text-white font-semibold gap-2 px-8 py-6"
            >
              <Sparkles className="w-5 h-5" />
              {analyzing ? "Analyzing..." : "Analyze This Dream"}
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DreamDetail;
