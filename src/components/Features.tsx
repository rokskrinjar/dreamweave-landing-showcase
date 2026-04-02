import { Moon } from "lucide-react";

export const Features = () => {
  const points = [
    {
      bold: "Your dreams process what your waking life buries.",
      body: "Every night your mind works through stress, fear, and emotion. Dreams are the result — raw and more honest than anything you'd say out loud.",
    },
    {
      bold: "The patterns are already there. You just can't see them yet.",
      body: "Recurring places, familiar faces, the same feelings. These aren't random — they're your subconscious showing you what it keeps returning to.",
    },
    {
      bold: "The longer you journal, the more yourself you become.",
      body: "Self-awareness builds slowly, dream by dream. People who journal consistently report feeling more grounded and more in tune with what they actually want.",
    },
  ];

  return (
    <section
      className="py-24 relative"
      style={{
        backgroundColor: '#f5f0e8',
        backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(180,160,130,0.1) 31px, rgba(180,160,130,0.1) 32px)',
        backgroundSize: '100% 32px',
      }}
    >
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left column — headline */}
          <div className="md:sticky md:top-24">
            <Moon className="w-5 h-5 text-muted-foreground mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground leading-tight mb-4">
              A third of your life happens while you sleep
            </h2>
            <p className="text-lg text-muted-foreground">
              Dream journaling changes that.
            </p>
          </div>

          {/* Right column — journal margin notes */}
          <div className="flex flex-col gap-10">
            {points.map((point, i) => (
              <div key={i} className="border-l-2 border-primary pl-5">
                <p className="text-base font-bold text-foreground mb-1 leading-snug">
                  {point.bold}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
