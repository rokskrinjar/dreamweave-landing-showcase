import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useMemo } from "react";

export const LucidDreamingSection = () => {
  const callouts = [
    "The most effective lucid dreaming technique is keeping a dream journal",
    "Dream recall improves significantly within the first 2 weeks of journaling",
    "Awareness of dream patterns is the first step to controlling them",
  ];

  const bullets = [
    "Dream journaling is the most widely recommended method for achieving lucid dreams",
    "Writing dreams down trains your brain to recognize when you're dreaming",
    "Most people notice improved dream recall within the first two weeks",
    "Pattern awareness is the first step to consciously controlling your dreams",
  ];

  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        delay: `${Math.random() * 6}s`,
        duration: `${Math.random() * 3 + 3}s`,
      })),
    []
  );

  return (
    <section className="py-24 bg-[hsl(240,40%,10%)] relative overflow-hidden">
      {/* Twinkling stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white/60 border border-white/20 rounded-full px-4 py-1.5 mb-8">
          Bonus Benefit
        </span>

        <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(167,139,250,0.4)]">
          Lucid Dreaming
        </h2>

        <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto mb-12">
          Your dream journal is the key to waking up inside your dreams.
        </p>

        <div className="text-left max-w-2xl mx-auto mb-16 space-y-4">
          {bullets.map((bullet, i) => (
            <div key={i} className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                {bullet}
              </p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {callouts.map((text, i) => (
            <div key={i} className="border-t border-white/20 pt-6">
              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>

        <Link to="/auth">
          <Button className="bg-white text-[hsl(240,40%,10%)] hover:bg-white/90 font-semibold px-8 py-6 text-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
            Start Your Dream Journal Tonight
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
};
