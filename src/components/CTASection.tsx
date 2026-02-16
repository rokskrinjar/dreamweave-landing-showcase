import { Button } from "@/components/ui/button";
import { Check, Crown, Zap, Star } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
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
    price: "$9.99",
    period: "/month",
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
    price: "$199",
    period: "one-time",
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

export const CTASection = () => {
  return (
    <section id="pricing" className="py-24 cta-dark-gradient">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple pricing. No surprises.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start free. Upgrade when your dreams convince you to. (They will.)
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                tier.featured
                  ? "bg-white/15 backdrop-blur-lg border-2 border-white/30 shadow-2xl scale-105"
                  : "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10"
              }`}
            >
              {tier.badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${tier.featured ? 'gradient-purple' : 'gradient-orange'} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg`}>
                  {tier.badge}
                </div>
              )}

              <div className={`w-12 h-12 ${tier.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                <tier.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{tier.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-slate-400 ml-1 text-sm">{tier.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full py-6 font-semibold text-base transition-all hover:-translate-y-0.5 ${
                  tier.featured
                    ? "bg-white text-primary hover:bg-white/90 shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-500 text-sm mt-10">
          All plans include a 7-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </section>
  );
};
