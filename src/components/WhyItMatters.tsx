import { Brain, Heart, Lightbulb, Eye, Moon } from "lucide-react";

const benefits = [
  { icon: Brain, label: "Stronger dream recall" },
  { icon: Heart, label: "Better emotional awareness" },
  { icon: Lightbulb, label: "Increased creativity" },
  { icon: Eye, label: "More self-reflection" },
  { icon: Moon, label: "Higher chances of lucid dreaming" },
];

export const WhyItMatters = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-3xl mx-auto px-8">
        <div className="bg-card rounded-3xl shadow-md border border-border/60 p-12 md:p-16">
          <div className="flex justify-center mb-8">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full border border-primary/20">
              Backed by Research
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-5">
            Why tracking your dreams actually matters
          </h2>

          <p className="text-muted-foreground text-center leading-relaxed tracking-wide mb-12 max-w-2xl mx-auto">
            You spend nearly one third of your life dreaming. That's hours of thoughts, emotions, and patterns your mind processes every night — not random, not meaningless. Writing them down improves recall and awareness. Over time, you start noticing recurring patterns and emotional themes.
          </p>

          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground text-center mt-2 mb-6">
            This practice can help with:
          </p>

          <div className="flex flex-wrap justify-center gap-3.5">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-background border border-border rounded-full px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30"
              >
                <b.icon className="w-4 h-4 text-primary" />
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
