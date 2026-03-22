import { Clock, Sparkles, BarChart3 } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      icon: Clock,
      title: "Wake Up. Capture the Dream.",
      time: "30 seconds",
      description:
        "Open DreamWeave and write down what you remember. No overthinking — raw thoughts are enough.",
    },
    {
      number: "2",
      icon: Sparkles,
      title: "AI Highlights the Meaning",
      time: "Instant",
      description:
        "DreamWeave identifies emotional themes, symbols, and patterns — helping you see your dream in a new light.",
    },
    {
      number: "3",
      icon: BarChart3,
      title: "Patterns Emerge Over Time",
      time: "After 7+ dreams",
      description:
        "After several dreams, recurring themes appear — emotions, places, people, and situations. This is where real insights begin.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Three steps. Zero effort.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The whole point is that it's dead simple. If it takes more than a minute, you won't do it. We know that.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              <div className="w-20 h-20 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <step.icon className="w-9 h-9" />
              </div>
              <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">
                ⏱ {step.time}
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
