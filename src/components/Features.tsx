import { PenLine, Brain, TrendingUp, Lightbulb } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: PenLine,
      title: "Capture Before It Fades",
      description:
        "You just woke up. That dream is slipping away. Open the app, type it out in 60 seconds, and it's saved forever. Tag your mood, add details later — the important thing is you don't lose it.",
      gradient: "gradient-purple",
    },
    {
      icon: Brain,
      title: "AI That Actually Gets It",
      description:
        "Not generic horoscope nonsense. Our AI draws from Jungian, Freudian, and cognitive psychology to give you real insights about what your subconscious is processing. It's like a therapist who never sleeps.",
      gradient: "gradient-blue",
    },
    {
      icon: TrendingUp,
      title: "See the Patterns You Miss",
      description:
        "After a week of logging, the magic starts. Recurring symbols. Emotional cycles. Stress triggers showing up as nightmares. The AI connects dots you'd never notice on your own.",
      gradient: "gradient-green",
    },
    {
      icon: Lightbulb,
      title: "Suggestions That Hit Home",
      description:
        "Every analysis ends with actionable takeaways. 'You've dreamed about water 4 times this week — here's what that likely means for your waking life.' Specific. Personal. Useful.",
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
