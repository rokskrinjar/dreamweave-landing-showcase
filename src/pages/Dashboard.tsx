import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { PenLine, Sparkles, Search, Crown, Settings, Lock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { navigateToExternal } from "@/lib/navigation";

interface Dream {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  tags: string[];
  recorded_at: string;
  created_at: string;
  hasAnalysis?: boolean;
}

const Dashboard = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState<{ subscription_tier: string; dreams_this_month: number } | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const upgradeBannerRef = useRef<HTMLDivElement>(null);

  const handleCheckout = async (plan: string) => {
    setLoadingPlan(plan);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan },
      });
      if (error) throw error;
      if (data?.url) navigateToExternal(data.url);
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [dreamsRes, profileRes, analysesRes] = await Promise.all([
        supabase
          .from("dreams")
          .select("*")
          .order("recorded_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("subscription_tier, dreams_this_month")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("analyses")
          .select("dream_id"),
      ]);

      if (dreamsRes.error) toast.error(dreamsRes.error.message);

      const analyzedDreamIds = new Set(
        (analysesRes.data || []).map((a) => a.dream_id)
      );

      const dreamsWithStatus = (dreamsRes.data || []).map((d) => ({
        ...d,
        tags: d.tags || [],
        hasAnalysis: analyzedDreamIds.has(d.id),
      }));

      setDreams(dreamsWithStatus);
      if (profileRes.data) setProfile(profileRes.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const filteredDreams = dreams.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase())
  );

  const isFree = subscription.tier === "free";
  const remaining = profile ? Math.max(0, 3 - profile.dreams_this_month) : 0;
  const atLimit = isFree && remaining === 0;
  const unanalyzedCount = dreams.filter((d) => !d.hasAnalysis).length;

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Dreams</h1>
          {isFree ? (
            <p className="text-sm text-muted-foreground mt-1">
              {profile ? remaining : "..."} free analyses remaining this month ·{" "}
              <button type="button" onClick={() => { if (upgradeBannerRef.current) { upgradeBannerRef.current.scrollIntoView({ behavior: "smooth" }); } else { navigate("/"); setTimeout(() => { const el = document.getElementById("pricing"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 300); } }} className="text-primary hover:underline">Upgrade</button>
            </p>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                {subscription.tier === "lifetime" ? "Lifetime Dreamer" : "Pro"}
              </span>
              {subscription.tier === "pro" && (
                <button
                  onClick={async () => {
                    const { data, error } = await supabase.functions.invoke("customer-portal");
                    if (data?.url) navigateToExternal(data.url);
                    else toast.error(error?.message || "Could not open billing portal");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" /> Manage
                </button>
              )}
            </div>
          )}
        </div>
        <Link to="/dreams/new">
          <Button className="gradient-indigo text-white font-semibold gap-2">
            <PenLine className="w-4 h-4" />
            Record a Dream
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search your dreams..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Upgrade Banner — free users at limit with unanalyzed dreams */}
      {atLimit && unanalyzedCount > 0 && (
        <div ref={upgradeBannerRef} className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {unanalyzedCount} dream{unanalyzedCount !== 1 ? "s" : ""} waiting for insights
              </p>
              <p className="text-sm text-muted-foreground">
                Unlock unlimited AI analysis to discover hidden patterns in your subconscious.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => handleCheckout("pro")}
              disabled={loadingPlan === "pro"}
              className="gradient-indigo text-white font-semibold whitespace-nowrap gap-2"
            >
              {loadingPlan === "pro" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  Unlock All Dreams — $9.99/mo
                </>
              )}
            </Button>
            <div className="relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-lime-400 to-emerald-500 text-emerald-950 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap z-10">
                Best Value
              </span>
              <Button
                onClick={() => handleCheckout("lifetime")}
                disabled={loadingPlan === "lifetime"}
                className="bg-gradient-to-r from-lime-400 via-lime-400 to-emerald-500 hover:from-lime-500 hover:to-emerald-600 text-emerald-950 font-semibold whitespace-nowrap gap-2 shadow-lg shadow-emerald-500/20"
              >
                {loadingPlan === "lifetime" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    Lifetime Access — $99
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border animate-pulse">
              <div className="h-5 bg-muted rounded w-1/3 mb-3" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredDreams.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 gradient-indigo rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🌙
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {dreams.length === 0 ? "No dreams yet" : "No matches found"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {dreams.length === 0
              ? "Record your first dream to start uncovering your subconscious patterns."
              : "Try a different search term."}
          </p>
          {dreams.length === 0 && (
            <Link to="/dreams/new">
              <Button className="gradient-indigo text-white font-semibold gap-2">
                <PenLine className="w-4 h-4" />
                Record Your First Dream
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDreams.map((dream) => (
            <Link
              key={dream.id}
              to={`/dreams/${dream.id}`}
              className="group block bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all relative"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground truncate">{dream.title}</h3>
                    {/* Analysis status badge */}
                    {dream.hasAnalysis ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                        <Sparkles className="w-3 h-3" />
                        Analyzed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">
                        Not analyzed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{dream.content}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {new Date(dream.recorded_at).toLocaleDateString()}
                  </span>
                  {dream.mood && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${moodColors[dream.mood] || "bg-muted text-muted-foreground"}`}>
                      {dream.mood}
                    </span>
                  )}
                </div>
              </div>
              {dream.tags && dream.tags.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {dream.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {/* Lock overlay for unanalyzed cards when free user at limit */}
              {atLimit && !dream.hasAnalysis && (
                <div className="absolute inset-0 rounded-2xl bg-background/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Lock className="w-4 h-4" />
                    Upgrade to analyze
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Dashboard;
