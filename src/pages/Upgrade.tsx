import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { navigateToExternal } from "@/lib/navigation";
import { AppLayout } from "@/components/AppLayout";

const freeTier = {
  name: "Free",
  price: "$0",
  period: "forever",
  plan: "free" as const,
  description: "Dip your toes in. See what your dreams are telling you.",
  features: [
    "3 AI dream analyses per month",
    "Unlimited dream journaling",
    "Mood tagging",
    "Basic dream history",
  ],
  cta: "Start Free",
};

const dreamerFeatures = [
  "Unlimited AI dream analyses",
  "Long-term pattern recognition",
  "Personalized suggestions",
  "Mood trend charts",
  "Export your data anytime",
  "Priority analysis speed",
];

const Upgrade = () => {
  const { subscription } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(true);

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

  const dreamerPlan = isYearly ? "pro_yearly" : "pro";
  const dreamerPrice = isYearly ? "€39.99" : "€4.99";
  const dreamerPeriod = isYearly ? "/year" : "/month";

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Continue exploring your dreams
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlock unlimited dream analysis and discover deeper patterns across your dreams.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span
            className={`text-sm font-medium cursor-pointer transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isYearly ? "bg-primary" : "bg-muted-foreground/30"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isYearly ? "translate-x-7" : "translate-x-0"}`}
            />
          </button>
          <span
            className={`text-sm font-medium cursor-pointer transition-colors ${isYearly ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setIsYearly(true)}
          >
            Yearly
          </span>
          {isYearly && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 px-2.5 py-1 rounded-full">
              Save 33%
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border border-border hover:border-primary/20">
            <h3 className="text-xl font-bold text-foreground mb-1">{freeTier.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{freeTier.description}</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">{freeTier.price}</span>
              <span className="text-muted-foreground ml-1 text-sm">{freeTier.period}</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {freeTier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {isCurrentPlan("free") ? (
              <Button
                disabled
                className="w-full py-6 font-semibold text-base bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 cursor-default"
              >
                ✓ Current Plan
              </Button>
            ) : (
              <Button
                onClick={() => handleCheckout("free")}
                className="w-full py-6 font-semibold text-base transition-all duration-200 bg-muted text-foreground hover:bg-muted/80 border border-border hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {freeTier.cta}
              </Button>
            )}
          </div>

          {/* Dreamer Tier */}
          <div className="relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-primary/10 border-2 border-primary/30 shadow-2xl scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-purple text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Most Popular
            </div>

            <div className="w-12 h-12 gradient-purple rounded-xl flex items-center justify-center mb-4 shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1">Dreamer</h3>
            <p className="text-muted-foreground text-sm mb-4">For serious dreamers who want the full picture.</p>

            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{dreamerPrice}</span>
              <span className="text-muted-foreground text-sm">{dreamerPeriod}</span>
              {isYearly && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                  33% off
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {dreamerFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {isCurrentPlan("pro") ? (
              <Button
                disabled
                className="w-full py-6 font-semibold text-base bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 cursor-default"
              >
                ✓ Current Plan
              </Button>
            ) : (
              <Button
                onClick={() => handleCheckout(dreamerPlan)}
                disabled={loadingPlan === dreamerPlan}
                className="w-full py-6 font-semibold text-base transition-all duration-200 gradient-purple text-white shadow-md hover:shadow-primary/30 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {loadingPlan === dreamerPlan ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Go Pro"
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-10">
          Cancel anytime · No commitments
        </p>
      </div>
    </AppLayout>
  );
};

export default Upgrade;
