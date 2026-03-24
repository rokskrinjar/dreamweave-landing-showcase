import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { navigateToExternal } from "@/lib/navigation";

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

export const CTASection = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(true);

  const handleCheckout = async (plan: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

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
    <section id="pricing" className="py-24 cta-dark-gradient">
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple pricing. No surprises.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start free. Upgrade when your dreams convince you to. (They will.)
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span
            className={`text-sm font-medium cursor-pointer transition-colors ${!isYearly ? "text-white" : "text-slate-400"}`}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isYearly ? "bg-purple-500" : "bg-white/20"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isYearly ? "translate-x-7" : "translate-x-0"}`}
            />
          </button>
          <span
            className={`text-sm font-medium cursor-pointer transition-colors ${isYearly ? "text-white" : "text-slate-400"}`}
            onClick={() => setIsYearly(true)}
          >
            Yearly
          </span>
          {isYearly && (
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              Save 33%
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10">
            <h3 className="text-xl font-bold text-white mb-1">{freeTier.name}</h3>
            <p className="text-slate-400 text-sm mb-4">{freeTier.description}</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">{freeTier.price}</span>
              <span className="text-slate-400 ml-1 text-sm">{freeTier.period}</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {freeTier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {isCurrentPlan("free") ? (
              <Button
                disabled
                className="w-full py-6 font-semibold text-base bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
              >
                ✓ Current Plan
              </Button>
            ) : (
              <Button
                onClick={() => handleCheckout("free")}
                className="w-full py-6 font-semibold text-base transition-all hover:-translate-y-0.5 bg-white/10 text-white hover:bg-white/20 border border-white/20"
              >
                {freeTier.cta}
              </Button>
            )}
          </div>

          {/* Dreamer Tier */}
          <div className="relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 bg-white/15 backdrop-blur-lg border-2 border-white/30 shadow-2xl scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-purple text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Most Popular
            </div>

            <div className="w-12 h-12 gradient-purple rounded-xl flex items-center justify-center mb-4 shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Dreamer</h3>
            <p className="text-slate-400 text-sm mb-4">For serious dreamers who want the full picture.</p>

            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{dreamerPrice}</span>
              <span className="text-slate-400 text-sm">{dreamerPeriod}</span>
              {isYearly && (
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  33% off
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {dreamerFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
              {isYearly && (
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  All future features included
                </li>
              )}
            </ul>

            {isCurrentPlan("pro") ? (
              <Button
                disabled
                className="w-full py-6 font-semibold text-base bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
              >
                ✓ Current Plan
              </Button>
            ) : (
              <Button
                onClick={() => handleCheckout(dreamerPlan)}
                disabled={loadingPlan === dreamerPlan}
                className="w-full py-6 font-semibold text-base transition-all hover:-translate-y-0.5 bg-white text-primary hover:bg-white/90 shadow-lg"
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

        <p className="text-center text-slate-500 text-sm mt-10">
          Cancel anytime · No commitments
        </p>
      </div>
    </section>
  );
};
