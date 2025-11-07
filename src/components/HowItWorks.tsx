export const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Record Your Dream",
      description:
        "Wake up and immediately capture your dream using voice recording or text input. Our prompts help you remember important details.",
    },
    {
      number: "2",
      title: "Get Deep Analysis",
      description:
        "Receive comprehensive psychological insights from multiple perspectives, including symbol meanings and emotional patterns.",
    },
    {
      number: "3",
      title: "Discover Patterns",
      description:
        "Track trends over time, understand your subconscious mind, and use personalized recommendations for self-discovery.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            How DreamWeave.me Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your dreams into meaningful insights in just three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 gradient-indigo text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-6">
                {step.number}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
