import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const LucidDreamingSection = () => {
  const callouts = [
    "The most effective lucid dreaming technique is keeping a dream journal",
    "Dream recall improves significantly within the first 2 weeks of journaling",
    "Awareness of dream patterns is the first step to controlling them",
  ];

  return (
    <section className="py-24 bg-[hsl(240,40%,10%)]">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white/60 border border-white/20 rounded-full px-4 py-1.5 mb-8">
          Bonus Benefit
        </span>

        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
          Journal your dreams. Start having lucid ones.
        </h2>

        <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-3xl mx-auto mb-16">
          Lucid dreaming — becoming aware that you're dreaming while it's happening — sounds rare. But it's a learnable skill, and dream journaling is the single most recommended method to get there. When you write your dreams down consistently, your brain starts recognizing dream patterns. Over time that recognition crosses into your sleep itself, and you begin to wake up inside your dreams. DreamWeave users who journal regularly report noticing the early signs within weeks.
        </p>

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
    </section>
  );
};
