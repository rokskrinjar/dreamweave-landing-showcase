import { Button } from "@/components/ui/button";
import { Check, Crown, Zap, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { navigateToExternal } from "@/lib/navigation";
import { AppLayout } from "@/components/AppLayout";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    plan: "free" as const,
    description: "Dip your toes in. See what your dreams are telling you.",
    icon: Star,
    features: [
      "3 AI dream analyses per month",
      "Unlimited dream journaling",
      "Mood tagging",
      "Basic dream history",
    ],
    cta: "Start Free",
    featured: false,
    badge: null,
    gradient: "gradient-blue",
  },
  {
    name: "Pro",
    price: "€4.99",
    period: "/month",
    plan: "pro" as const,
    description: "For serious dreamers who want the full picture.",
    icon: Zap,
    features: [
      "Unlimited AI dream analyses",
      "Long-term pattern recognition",
      "Personalized suggestions",
      "Mood trend charts",
      "Export your data anytime",
      "Priority analysis speed",
    ],
    cta: "Go Pro",
    featured: true,
    badge: "Most Popular",
    gradient: "gradient-purple",
  },
  {
    name: "Lifetime Dreamer",
    price: "€49.99",
    period: "one-time",
    plan: "lifetime" as const,
    description: "Pay once. Dream forever. No subscriptions, no renewals.",
    icon: Crown,
    features: [
      "Everything in Pro — forever",
      "Early Adopter badge",
      "Priority support",
      "All future features included",
      "Lock in before the price goes up",
    ],
    cta: "Get Lifetime Access",
    featured: false,
    badge: "Best Value",
    gradient: "gradient-orange",
  },
];

const Upgrade = () => {
  const { subscription } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    if (plan === "free") {
      navigate("/dashboard");
      return;
    }

    setLoadingPlan(plan);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan },
      });
      if (error) throw error;
      if (data?.url) {
        navigateToExternal(data.url);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  const isCurrentPlan = (plan: string) => {
    if (plan === "free" && subscription.tier === "free") return true;
    return subscription.tier === plan;
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Continue exploring your dreams
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlock unlimited dream analysis and discover deeper patterns across your dreams.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                tier.featured
                  ? "bg-primary/10 border-2 border-primary/30 shadow-2xl scale-105"
                  : "bg-card border border-border hover:shadow-lg"
              }`}
            >
              {tier.badge && (
                <div
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 ${
                    tier.featured ? "gradient-purple" : "gradient-orange"
                  } text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg`}
                >
                  {tier.badge}
                </div>
              )}

              <div
                className={`w-12 h-12 ${tier.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md`}
              >
                <tier.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-1">{tier.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{tier.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                <span className="text-muted-foreground ml-1 text-sm">{tier.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrentPlan(tier.plan) ? (
                <Button
                  disabled
                  className="w-full py-6 font-semibold text-base bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 cursor-default"
                >
                  ✓ Current Plan
                </Button>
              ) : (
                <Button
                  onClick={() => handleCheckout(tier.plan)}
                  disabled={loadingPlan === tier.plan}
                  className={`w-full py-6 font-semibold text-base transition-all hover:-translate-y-0.5 ${
                    tier.featured
                      ? "gradient-purple text-white shadow-lg"
                      : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                  }`}
                >
                  {loadingPlan === tier.plan ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    tier.cta
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mt-10">
          Cancel anytime · No commitments
        </p>
      </div>
    </AppLayout>
  );
};

export default Upgrade;
