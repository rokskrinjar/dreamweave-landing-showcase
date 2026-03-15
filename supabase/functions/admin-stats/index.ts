import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user identity
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseUser.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Use service role to check admin + query all data
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all data in parallel
    const [profilesRes, dreamsRes, analysesRes, authUsersRes] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("dreams").select("id, user_id, created_at, mood, tags, sentiment"),
      supabase.from("analyses").select("id, user_id, dream_id, created_at"),
      supabase.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    const profiles = profilesRes.data || [];
    const dreams = dreamsRes.data || [];
    const analyses = analysesRes.data || [];
    const authUsers = authUsersRes.data?.users || [];

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Build user map
    const authMap = new Map(authUsers.map((u: any) => [u.id, u]));

    // KPIs
    const realProfiles = profiles.filter((p) => !p.is_demo);
    const demoProfiles = profiles.filter((p) => p.is_demo);
    const proCount = realProfiles.filter((p) => p.subscription_tier === "pro").length;
    const lifetimeCount = realProfiles.filter((p) => p.subscription_tier === "lifetime").length;
    const newSignupsWeek = realProfiles.filter(
      (p) => new Date(p.created_at) >= weekAgo
    ).length;
    const newSignupsMonth = realProfiles.filter(
      (p) => new Date(p.created_at) >= monthAgo
    ).length;

    // Dreams by non-demo users
    const demoUserIds = new Set(demoProfiles.map((p) => p.user_id));
    const realDreams = dreams.filter((d) => !demoUserIds.has(d.user_id));
    const realAnalyses = analyses.filter((a) => !demoUserIds.has(a.user_id));
    const analyzedDreamIds = new Set(realAnalyses.map((a) => a.dream_id));

    // User table
    const userTable = realProfiles.map((p) => {
      const authUser = authMap.get(p.user_id) as any;
      const userDreams = realDreams.filter((d) => d.user_id === p.user_id);
      const userAnalyses = realAnalyses.filter((a) => a.user_id === p.user_id);
      const lastDream = userDreams.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      return {
        user_id: p.user_id,
        display_name: p.display_name,
        email: authUser?.email || "unknown",
        subscription_tier: p.subscription_tier,
        is_demo: p.is_demo,
        signup_date: p.created_at,
        total_dreams: userDreams.length,
        dreams_analyzed: userAnalyses.length,
        last_active: lastDream?.created_at || p.created_at,
      };
    });

    // Growth: signups by day (last 30 days)
    const signupsByDay: Record<string, number> = {};
    realProfiles.forEach((p) => {
      const day = new Date(p.created_at).toISOString().slice(0, 10);
      signupsByDay[day] = (signupsByDay[day] || 0) + 1;
    });

    // Dreams by day (last 30 days)
    const dreamsByDay: Record<string, number> = {};
    realDreams.forEach((d) => {
      const day = new Date(d.created_at).toISOString().slice(0, 10);
      dreamsByDay[day] = (dreamsByDay[day] || 0) + 1;
    });

    // Engagement
    const usersWithDreams = new Set(realDreams.map((d) => d.user_id)).size;
    const usersWithAnalyses = new Set(realAnalyses.map((a) => a.user_id)).size;

    // Moods
    const moodCounts: Record<string, number> = {};
    realDreams.forEach((d) => {
      if (d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
    });

    // Sentiments
    const sentimentCounts: Record<string, number> = {};
    realDreams.forEach((d) => {
      if (d.sentiment) sentimentCounts[d.sentiment] = (sentimentCounts[d.sentiment] || 0) + 1;
    });

    const stats = {
      kpis: {
        total_users: realProfiles.length,
        demo_users: demoProfiles.length,
        total_dreams: realDreams.length,
        total_analyzed: realAnalyses.length,
        analysis_rate: realDreams.length > 0
          ? Math.round((analyzedDreamIds.size / realDreams.length) * 100)
          : 0,
        pro_subscribers: proCount,
        lifetime_subscribers: lifetimeCount,
        new_signups_week: newSignupsWeek,
        new_signups_month: newSignupsMonth,
      },
      user_table: userTable.sort(
        (a, b) => new Date(b.signup_date).getTime() - new Date(a.signup_date).getTime()
      ),
      growth: {
        signups_by_day: signupsByDay,
        dreams_by_day: dreamsByDay,
      },
      engagement: {
        avg_dreams_per_user: realProfiles.length > 0
          ? Math.round((realDreams.length / realProfiles.length) * 10) / 10
          : 0,
        users_with_dreams: usersWithDreams,
        users_with_analyses: usersWithAnalyses,
        pct_with_dreams: realProfiles.length > 0
          ? Math.round((usersWithDreams / realProfiles.length) * 100)
          : 0,
        pct_with_analyses: realProfiles.length > 0
          ? Math.round((usersWithAnalyses / realProfiles.length) * 100)
          : 0,
        mood_distribution: moodCounts,
        sentiment_distribution: sentimentCounts,
      },
      revenue: {
        pro_count: proCount,
        lifetime_count: lifetimeCount,
        mrr_estimate: proCount * 4.99,
      },
    };

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
