import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format, isSameMonth } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { PenLine, Sparkles, Search, Lock, Loader2, Download, CalendarDays, List } from "lucide-react";
import { exportDreamsToExcel } from "@/lib/exportDreams";
import dreamweaveLogo from "@/assets/dreamweave-logo.png";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import DreamCalendar from "@/components/DreamCalendar";

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
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [profile, setProfile] = useState<{ subscription_tier: string; dreams_this_month: number } | null>(null);
  const upgradeBannerRef = useRef<HTMLDivElement>(null);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Dreams</h1>
            {isFree ? (
            <p className="text-sm text-muted-foreground mt-1">
              {profile ? remaining : "..."} free analyses remaining this month ·{" "}
              <Link to="/upgrade" className="text-primary hover:underline">Upgrade</Link>
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {subscription.tier !== "free" && (
            <Button
              variant="outline"
              className="gap-2 font-semibold"
              onClick={() => { exportDreamsToExcel(dreams); }}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 ${viewMode === "calendar" ? "bg-muted" : ""}`}
            onClick={() => setViewMode((v) => (v === "list" ? "calendar" : "list"))}
          >
            {viewMode === "list" ? (
              <CalendarDays className="w-4 h-4" />
            ) : (
              <List className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div
          className="rounded-xl px-4 py-3 text-white hover:scale-[1.03] transition-transform duration-200"
          style={{ backgroundColor: "hsl(235, 30%, 18%)" }}
        >
          <p className="text-3xl font-black tracking-tight">{dreams.length}</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Dreams Journaled — Lifetime</p>
        </div>
        <div
          className="rounded-xl px-4 py-3 text-white hover:scale-[1.03] transition-transform duration-200"
          style={{ backgroundColor: "hsl(265, 50%, 25%)" }}
        >
          <p className="text-3xl font-black tracking-tight">{profile?.dreams_this_month ?? 0}</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Dreams This Month</p>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <>
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
              <Link to="/upgrade">
                <Button className="gradient-navy text-white font-semibold whitespace-nowrap gap-2">
                  <Sparkles className="w-4 h-4" />
                  View Plans
                </Button>
              </Link>
            </div>
          )}
          <DreamCalendar dreams={dreams} moodColors={moodColors} />
        </>
      ) : (
        <>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your dreams..."
              className="pl-10 bg-muted/60"
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
              <Link to="/upgrade">
                <Button className="gradient-navy text-white font-semibold whitespace-nowrap gap-2">
                  <Sparkles className="w-4 h-4" />
                  View Plans
                </Button>
              </Link>
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
              <div className="flex items-center justify-center mx-auto mb-4">
                <img src={dreamweaveLogo} alt="DreamWeave" className="w-16 h-16" />
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
                  <Button className="gradient-navy text-white font-semibold gap-2">
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
                  className="group block rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all relative"
                  style={{ backgroundColor: "hsl(30, 20%, 98%)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground truncate mb-1">{dream.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{dream.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(dream.recorded_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {dream.hasAnalysis ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        <Sparkles className="w-3 h-3" />
                        Analyzed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        Not analyzed
                      </span>
                    )}
                    {dream.mood && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${moodColors[dream.mood] || "bg-muted text-muted-foreground"}`}>
                        {dream.mood}
                      </span>
                    )}
                    {dream.tags && dream.tags.length > 0 && dream.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
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
        </>
      )}
    </AppLayout>
  );
};

export default Dashboard;
