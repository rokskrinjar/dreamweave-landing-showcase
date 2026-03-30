import { Brain, RefreshCw, Sprout } from "lucide-react";

export const Features = () => {
  const cards = [
    {
      icon: Brain,
      bold: "Your dreams process what your waking life buries.",
      body: "Every night your mind works through stress, fear, and emotion. Dreams are the result — raw and more honest than anything you'd say out loud.",
    },
    {
      icon: RefreshCw,
      bold: "The patterns are already there. You just can't see them yet.",
      body: "Recurring places, familiar faces, the same feelings. These aren't random — they're your subconscious showing you what it keeps returning to.",
    },
    {
      icon: Sprout,
      bold: "The longer you journal, the more yourself you become.",
      body: "Self-awareness builds slowly, dream by dream. People who journal consistently report feeling more grounded and more in tune with what they actually want.",
    },
  ];

  return (
    <section className="py-24 bg-[hsl(40,30%,97%)]">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Most people live their whole lives without ever listening to themselves.
          </h2>
          <p className="text-lg text-muted-foreground">
            Dream journaling changes that.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-purple-50"
            >
              <card.icon className="w-8 h-8 text-primary mb-5" />
              <p className="text-lg font-bold text-foreground mb-3 leading-snug">
                {card.bold}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
