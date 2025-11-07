import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center min-h-screen">
          {/* Hero Content */}
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Unlock the <span className="text-gradient-highlight">wisdom</span> in your dreams
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              DreamWeave.me combines intuitive journaling with deep psychological insights to help you understand your subconscious mind and discover patterns in your dream world.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                <span className="mr-2">🚀</span>
                Start Your Journey
              </Button>
              <Button className="bg-white/10 text-white hover:bg-white/20 font-semibold px-8 py-6 text-lg border border-white/20 backdrop-blur-md hover:-translate-y-1 transition-all">
                <span className="mr-2">▶️</span>
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex justify-center items-center">
            <div className="w-[300px] h-[600px] bg-white rounded-[30px] shadow-2xl relative overflow-hidden animate-float transform perspective-1000 rotate-y-[-5deg] rotate-x-[5deg]">
              <div className="w-full h-full bg-gradient-to-b from-slate-50 to-slate-100 rounded-[30px] p-5">
                {/* Screen Header */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 gradient-indigo rounded-md flex items-center justify-center text-xs">
                    🌙
                  </div>
                  <span className="font-semibold text-sm">DreamWeave.me</span>
                </div>

                {/* Dream Cards */}
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="font-semibold text-sm mb-2">Flying Over the City</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      I was soaring above tall buildings with glass facades...
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>📅 Oct 29</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                        euphoric
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="font-semibold text-sm mb-2">Lost in a Forest</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Wandering through dense trees, searching...
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>📅 Oct 28</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                        anxious
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="font-semibold text-sm mb-2">Meeting an Old Friend</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Unexpected encounter with someone...
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>📅 Oct 27</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
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
    </section>
  );
};
