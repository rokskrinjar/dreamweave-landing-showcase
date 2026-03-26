import { Moon, BookOpen, Brain, TrendingUp } from "lucide-react";
import rachelPortrait from "@/assets/rachel-portrait.png";

const steps = [
  { icon: Moon, label: "Logged her dream" },
  { icon: BookOpen, label: "AI analyzed it" },
  { icon: Brain, label: "Discovered patterns" },
  { icon: TrendingUp, label: "Gained insight" },
];

export const CaseStudy = () => {
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

        {/* Rachel intro card */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg mb-10 max-w-4xl mx-auto">
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

        {/* Unified frame: steps + video */}
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Step indicators */}
          <div className="flex justify-center gap-4 md:gap-8 py-6 px-6 border-b border-border flex-wrap">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{step.label}</span>
              </div>
            ))}
          </div>

          {/* Video */}
          <video
            controls
            preload="metadata"
            className="w-full"
          >
            <source src="/videos/tutorial.mov" type="video/quicktime" />
            <source src="/videos/tutorial.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};
