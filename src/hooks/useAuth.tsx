import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionInfo {
  subscribed: boolean;
  tier: "free" | "pro" | "lifetime";
  subscription_end?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionInfo;
  refreshSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultSubscription: SubscriptionInfo = { subscribed: false, tier: "free" };

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  subscription: defaultSubscription,
  refreshSubscription: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo>(defaultSubscription);

  const refreshSubscription = useCallback(async () => {
    try {
      // Don't call if no active session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) return;

      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) {
        console.error("Error checking subscription:", error);
        return;
      }
      if (data) {
        setSubscription({
          subscribed: data.subscribed ?? false,
          tier: data.tier ?? "free",
          subscription_end: data.subscription_end,
        });
      }
    } catch (err) {
      console.error("Failed to check subscription:", err);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => authSub.unsubscribe();
  }, []);

  // Check subscription when user changes
  useEffect(() => {
    if (user) {
      refreshSubscription();
    } else {
      setSubscription(defaultSubscription);
    }
  }, [user, refreshSubscription]);

  // Periodic refresh every 60s
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(refreshSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, refreshSubscription]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, subscription, refreshSubscription, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
