export const Features = () => {
  const blocks = [
    {
      bold: "Your dreams process what your waking life buries.",
      body: "Every night your mind works through your stress, your relationships, your unspoken fears. Dreams are the result — raw, unfiltered, and more honest than anything you'd say out loud.",
    },
    {
      bold: "The patterns are already there. You just can't see them yet.",
      body: "Recurring places. Familiar faces. The same feeling of being chased, or lost, or finally free. These aren't random. They're your subconscious showing you what it keeps coming back to.",
    },
    {
      bold: "The longer you journal, the more yourself you become.",
      body: "Self-awareness doesn't arrive all at once. It builds slowly, entry by entry, dream by dream. People who journal their dreams consistently report feeling more emotionally grounded, more creative, and more in tune with what they actually want from life.",
    },
  ];

  return (
    <section className="py-24 bg-[hsl(40,30%,97%)]">
      <div className="max-w-3xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Most people live their whole lives without ever listening to themselves.
          </h2>
          <p className="text-lg text-muted-foreground">
            Dream journaling changes that.
          </p>
        </div>

        <div className="space-y-16">
          {blocks.map((block, i) => (
            <div key={i}>
              <p className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-snug">
                {block.bold}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
