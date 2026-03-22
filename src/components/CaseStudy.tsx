import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Moon, Sparkles, Brain, TrendingUp, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import rachelPortrait from "@/assets/rachel-portrait.png";

const slideLabels = ["Meet Rachel", "Her Dreams", "Dream Analysis", "Patterns"];

export const CaseStudy = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            See It in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow Rachel's journey from restless nights to real self-understanding.
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {slideLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-all ${
                selectedIndex === i
                  ? "gradient-navy text-white shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden rounded-2xl">
            <div className="flex">
              {/* Slide 1 — Meet Rachel */}
              <div className="min-w-0 shrink-0 grow-0 basis-full px-2">
                <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                        <img
                          src={rachelPortrait}
                          alt="Rachel — a DreamWeave user"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                        <Moon className="w-4 h-4" />
                        Meet Rachel
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        "I just want to stop feeling like I'm always behind."
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Rachel is a busy mom and professional in her mid-30s. Her days run on schedules, school pickups, and emails. She looks put-together — but underneath, she's quietly overwhelmed. Her dreams kept echoing the same feeling: running late, losing control, never catching up. She started DreamWeave to finally understand why.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 2 — Her Dreams */}
              <div className="min-w-0 shrink-0 grow-0 basis-full px-2">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-lg">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 gradient-navy rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Rachel's Dream Journal</h3>
                      <p className="text-sm text-muted-foreground">Her first week on DreamWeave</p>
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                    <img
                      src="/images/rachels-dreams.png"
                      alt="Rachel's dream journal showing multiple entries with mood tags"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Slide 3 — Analyzed Dream */}
              <div className="min-w-0 shrink-0 grow-0 basis-full px-2">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-lg">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">AI Dream Analysis</h3>
                      <p className="text-sm text-muted-foreground">"Planting Seeds" — decoded by DreamWeave</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                      <img
                        src="/images/analyzed-dream-1.png"
                        alt="Dream analysis showing summary and key symbols"
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                      <img
                        src="/images/analyzed-dream-2.png"
                        alt="Dream analysis showing themes and emotions detected"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 4 — Patterns */}
              <div className="min-w-0 shrink-0 grow-0 basis-full px-2">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-lg">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 gradient-green rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Patterns Revealed</h3>
                      <p className="text-sm text-muted-foreground">The "aha" moment — recurring themes across Rachel's dreams</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                      <img
                        src="/images/patterns-1.png"
                        alt="Recurring dream patterns and themes analysis"
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                      <img
                        src="/images/patterns-2.png"
                        alt="Actionable suggestions based on dream patterns"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card shadow-lg border-border z-10"
            disabled={!canScrollPrev}
            onClick={() => emblaApi?.scrollPrev()}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card shadow-lg border-border z-10"
            disabled={!canScrollNext}
            onClick={() => emblaApi?.scrollNext()}
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {slideLabels.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                selectedIndex === i
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
