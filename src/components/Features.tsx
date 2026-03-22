import { BookOpen, Search, TrendingUp, Lightbulb } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Remember Your Dreams",
      description:
        "Most dreams fade within minutes. Capture them instantly so they don't disappear.",
      gradient: "gradient-purple",
    },
    {
      icon: Search,
      title: "Understand the Symbols",
      description:
        "Dreams speak in emotions and symbols. DreamWeave helps you reflect on what they might represent.",
      gradient: "gradient-blue",
    },
    {
      icon: TrendingUp,
      title: "See the Patterns",
      description:
        "Over time recurring themes begin to appear — people, places, emotions, situations. AI helps highlight patterns you might not notice on your own.",
      gradient: "gradient-green",
    },
    {
      icon: Lightbulb,
      title: "Gain Personal Insight",
      description:
        "Every dream becomes a small piece of a bigger picture about your thoughts, emotions, and experiences.",
      gradient: "gradient-orange",
    },
  ];

  return (
    <section id="features" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Your dreams are trying to tell you something
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most people forget 95% of their dreams within 5 minutes of waking up. The ones you remember? Those matter.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-border"
            >
              <div className={`w-14 h-14 ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-md`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
