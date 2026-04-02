import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import dreamweaveLogo from "@/assets/dreamweave-logo.png";
import { useMemo } from "react";

export const Hero = () => {
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
    <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
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

      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center min-h-screen">
          {/* Hero Content */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 text-sm text-white/90">
              <Sparkles className="w-4 h-4" />
              <span>The average person has 4-6 dreams every single night</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Your dreams are
              <br />
              trying to tell you
              <br />
              <span className="text-gradient-highlight">something.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-lg">
              That's over 100,000 dreams in a lifetime — and most people remember almost none of them. But every dream you forget is a window into your emotions, your fears, your desires, and the parts of yourself your waking mind never gets quiet enough to hear. DreamWeave helps you catch them before they disappear — and over time, shows you what they've been trying to tell you all along.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/auth">
                <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                  Start Free — No Card Needed
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button className="bg-white/10 text-white hover:bg-white/20 font-semibold px-8 py-6 text-lg border border-white/20 backdrop-blur-md hover:-translate-y-1 transition-all">
                  <Play className="w-5 h-5 mr-2" />
                  See It In Action
                </Button>
              </a>
            </div>

            <p className="text-white/50 text-sm mt-6">
              Start journaling tonight. Your first insight is free.
            </p>
          </div>

          {/* Phone Mockup */}
          <div className="flex justify-center items-center">
            <div className="w-[300px] h-[600px] bg-white rounded-[30px] shadow-2xl relative overflow-hidden animate-float">
              <div className="w-full h-full bg-gradient-to-b from-slate-50 to-slate-100 rounded-[30px] p-5">
                {/* Screen Header */}
                <div className="flex items-center gap-2 mb-5">
                  <img src={dreamweaveLogo} alt="DreamWeave" className="w-6 h-6 rounded-md" />
                  <span className="font-semibold text-sm text-foreground">DreamWeave</span>
                </div>

                {/* Dream Cards */}
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100">
                    <div className="font-semibold text-sm mb-2 text-foreground">Flying Over the City</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      I was soaring above tall buildings with glass facades...
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>📅 Today</span>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        ✨ Analyzed
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100">
                    <div className="font-semibold text-sm mb-2 text-foreground">Lost in a Forest</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Wandering through dense trees, searching...
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>📅 Yesterday</span>
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        anxious
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100">
                    <div className="font-semibold text-sm mb-2 text-foreground">Meeting an Old Friend</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Unexpected encounter with someone...
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>📅 2 days ago</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        nostalgic
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
};
