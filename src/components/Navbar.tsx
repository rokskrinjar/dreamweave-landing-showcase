import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center gap-3 font-bold text-2xl text-foreground">
            <div className="w-10 h-10 gradient-indigo rounded-xl flex items-center justify-center text-xl">
              🌙
            </div>
            DreamWeave.me
          </a>
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <button
                onClick={() => scrollToSection("features")}
                className="text-muted-foreground hover:text-primary font-medium transition-colors"
              >
                Features
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-muted-foreground hover:text-primary font-medium transition-colors"
              >
                How It Works
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-muted-foreground hover:text-primary font-medium transition-colors"
              >
                Testimonials
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-muted-foreground hover:text-primary font-medium transition-colors"
              >
                Pricing
              </button>
            </li>
            <li>
              <Button className="gradient-indigo text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Start Dreaming
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
