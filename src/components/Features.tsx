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
    <section className="py-24 bg-secondary">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left column — headline */}
          <div className="md:sticky md:top-24">
            <Moon className="w-5 h-5 text-muted-foreground mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              A third of your life happens while you sleep
            </h2>
            <p className="text-lg text-muted-foreground">
              Dream journaling changes that.
            </p>
          </div>

          {/* Right column — notebook page */}
          <div
            className="relative rounded-lg px-8 py-8 shadow-md transition-transform duration-300 hover:rotate-0"
            style={{
              backgroundColor: '#faf6ef',
              backgroundImage: `
                repeating-linear-gradient(transparent, transparent 31px, rgba(170,155,130,0.18) 31px, rgba(170,155,130,0.18) 32px),
                url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")
              `,
              backgroundSize: '100% 32px, 200px 200px',
              border: '1px solid rgba(180,165,140,0.3)',
              transform: 'rotate(0.5deg)',
            }}
          >
            {/* Red margin line */}
            <div
              className="absolute top-0 bottom-0 left-10"
              style={{ borderLeft: '2px solid rgba(220,80,80,0.2)' }}
            />

            {/* Subtle corner fold */}
            <div
              className="absolute top-0 right-0 w-8 h-8"
              style={{
                background: 'linear-gradient(225deg, hsl(var(--secondary)) 50%, rgba(200,185,160,0.3) 50%)',
                borderBottomLeftRadius: '4px',
              }}
            />

            <div className="flex flex-col gap-10 relative z-10 pl-6">
              {points.map((point, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-2xl font-serif italic text-primary/60 select-none mt-0.5 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <div>
                    <p className="text-base font-bold text-foreground mb-1 leading-snug">
                      {point.bold}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {point.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
