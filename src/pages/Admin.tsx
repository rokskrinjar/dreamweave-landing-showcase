import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, BookOpen, Brain, CreditCard, TrendingUp, Activity } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

interface AdminStats {
  kpis: {
    total_users: number;
    demo_users: number;
    total_dreams: number;
    total_analyzed: number;
    analysis_rate: number;
    pro_subscribers: number;
    lifetime_subscribers: number;
    new_signups_week: number;
    new_signups_month: number;
  };
  user_table: Array<{
    user_id: string;
    display_name: string;
    email: string;
    subscription_tier: string;
    is_demo: boolean;
    signup_date: string;
    total_dreams: number;
    dreams_analyzed: number;
    last_active: string;
  }>;
  growth: {
    signups_by_day: Record<string, number>;
    dreams_by_day: Record<string, number>;
  };
  engagement: {
    avg_dreams_per_user: number;
    users_with_dreams: number;
    users_with_analyses: number;
    pct_with_dreams: number;
    pct_with_analyses: number;
    mood_distribution: Record<string, number>;
    sentiment_distribution: Record<string, number>;
  };
  revenue: {
    pro_count: number;
    lifetime_count: number;
    mrr_estimate: number;
  };
}

const COLORS = [
  "hsl(243, 75%, 59%)",
  "hsl(280, 61%, 56%)",
  "hsl(45, 97%, 55%)",
  "hsl(160, 60%, 45%)",
  "hsl(0, 84%, 60%)",
  "hsl(200, 70%, 50%)",
];

const tierBadge = (tier: string) => {
  const colors: Record<string, string> = {
    free: "bg-muted text-muted-foreground",
    pro: "bg-primary/10 text-primary",
    lifetime: "bg-accent text-accent-foreground",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[tier] || colors.free}`}>
      {tier}
    </span>
  );
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("admin-stats");
        if (fnError) throw fnError;
        if (data?.error) {
          setError(data.error === "Forbidden" ? "You don't have admin access." : data.error);
          return;
        }
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-destructive font-medium">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  const { kpis, user_table, growth, engagement, revenue } = stats;

  // Prepare chart data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  const signupChartData = last30Days.map((day) => ({
    date: day.slice(5),
    signups: growth.signups_by_day[day] || 0,
    dreams: growth.dreams_by_day[day] || 0,
  }));

  const moodData = Object.entries(engagement.mood_distribution).map(([name, value]) => ({
    name,
    value,
  }));

  const sentimentData = Object.entries(engagement.sentiment_distribution).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Real-time metrics for your app</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KPICard icon={Users} label="Real Users" value={kpis.total_users} sub={`+${kpis.new_signups_week} this week`} />
          <KPICard icon={BookOpen} label="Dreams" value={kpis.total_dreams} sub={`${kpis.analysis_rate}% analyzed`} />
          <KPICard icon={Brain} label="Analyses" value={kpis.total_analyzed} />
          <KPICard icon={CreditCard} label="Paid" value={kpis.pro_subscribers + kpis.lifetime_subscribers} sub={`${kpis.pro_subscribers} pro · ${kpis.lifetime_subscribers} lifetime`} />
        </div>

        {/* Growth Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Signups & Dreams (30d)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={signupChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip />
                  <Bar dataKey="signups" fill="hsl(243, 75%, 59%)" name="Signups" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="dreams" fill="hsl(280, 61%, 56%)" name="Dreams" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" /> Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Stat label="Avg dreams/user" value={engagement.avg_dreams_per_user} />
                <Stat label="Users with ≥1 dream" value={`${engagement.users_with_dreams}/${kpis.total_users} (${engagement.pct_with_dreams}%)`} />
                <Stat label="Users with ≥1 analysis" value={`${engagement.users_with_analyses}/${kpis.total_users} (${engagement.pct_with_analyses}%)`} />
                <Stat label="Drop-off (no dreams)" value={`${kpis.total_users - engagement.users_with_dreams} users`} />
              </div>
              {moodData.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Mood Distribution</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={moodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} label={(e) => e.name}>
                        {moodData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Revenue */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{revenue.pro_count}</p>
                <p className="text-xs text-muted-foreground">Pro subs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{revenue.lifetime_count}</p>
                <p className="text-xs text-muted-foreground">Lifetime</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">€{revenue.mrr_estimate.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Est. MRR</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Users ({user_table.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-4 text-muted-foreground font-medium">User</th>
                  <th className="pb-2 pr-4 text-muted-foreground font-medium">Tier</th>
                  <th className="pb-2 pr-4 text-muted-foreground font-medium">Dreams</th>
                  <th className="pb-2 pr-4 text-muted-foreground font-medium">Analyzed</th>
                  <th className="pb-2 pr-4 text-muted-foreground font-medium">Signed Up</th>
                  <th className="pb-2 text-muted-foreground font-medium">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {user_table.map((u) => (
                  <tr key={u.user_id} className="border-b border-border/50">
                    <td className="py-2 pr-4">
                      <div className="font-medium text-foreground">{u.display_name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="py-2 pr-4">{tierBadge(u.subscription_tier)}</td>
                    <td className="py-2 pr-4 text-foreground">{u.total_dreams}</td>
                    <td className="py-2 pr-4 text-foreground">{u.dreams_analyzed}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{new Date(u.signup_date).toLocaleDateString()}</td>
                    <td className="py-2 text-muted-foreground">{new Date(u.last_active).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: number | string; sub?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
