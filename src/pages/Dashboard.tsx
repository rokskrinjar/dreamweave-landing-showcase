import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { PenLine, Sparkles, Search, Crown, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Dream {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  tags: string[];
  recorded_at: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, subscription } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState<{ subscription_tier: string; dreams_this_month: number } | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [dreamsRes, profileRes] = await Promise.all([
        supabase
          .from("dreams")
          .select("*")
          .order("recorded_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("subscription_tier, dreams_this_month")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      if (dreamsRes.error) toast.error(dreamsRes.error.message);
      else setDreams(dreamsRes.data || []);

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
          {subscription.tier === "free" ? (
            <p className="text-sm text-muted-foreground mt-1">
              {profile ? 3 - profile.dreams_this_month : "..."} free analyses remaining this month ·{" "}
              <Link to="/#pricing" className="text-primary hover:underline">Upgrade</Link>
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
                    if (data?.url) window.open(data.url, "_blank");
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
              className="block bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1 truncate">{dream.title}</h3>
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
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Dashboard;
