export const Features = () => {
  const features = [
    {
      icon: "🌙",
      title: "Intuitive Dream Journaling",
      description:
        "Capture your dreams quickly with voice or text recording. Our clean, distraction-free interface helps you preserve every detail while memories are fresh.",
      gradient: "gradient-purple",
    },
    {
      icon: "🧠",
      title: "Deep Psychological Analysis",
      description:
        "Get comprehensive insights from multiple perspectives including Jungian, Freudian, Gestalt, and cognitive approaches to dream interpretation.",
      gradient: "gradient-blue",
    },
    {
      icon: "📊",
      title: "Pattern Recognition",
      description:
        "Discover recurring themes, emotions, and symbols in your dreams. Track your lucid dreaming progress and understand your subconscious patterns.",
      gradient: "gradient-green",
    },
    {
      icon: "🎯",
      title: "Personalized Recommendations",
      description:
        "Receive actionable insights and reflection questions tailored to your unique dream patterns and psychological themes.",
      gradient: "gradient-orange",
    },
    {
      icon: "🔍",
      title: "Powerful Search & Organization",
      description:
        "Find dreams by content, mood, symbols, or date. Tag and categorize your dreams for easy reference and pattern analysis.",
      gradient: "gradient-pink",
    },
    {
      icon: "✨",
      title: "Symbol Library & Guidance",
      description:
        "Access detailed explanations of dream symbols and their meanings across different psychological traditions and cultural contexts.",
      gradient: "gradient-indigo",
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Everything you need to explore your dreams
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and insights to help you understand the deeper meaning behind your nightly journeys
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`w-16 h-16 ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-md`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
