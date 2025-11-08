import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md border-b border-border" 
        : "hero-gradient"
    }`}>
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className={`flex items-center gap-3 font-bold text-2xl transition-colors ${
            isScrolled ? "text-foreground" : "text-white"
          }`}>
            <div className="w-10 h-10 gradient-indigo rounded-xl flex items-center justify-center text-xl">
              🌙
            </div>
            DreamWeave.me
          </a>
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <button
                onClick={() => scrollToSection("features")}
                className={`font-medium transition-colors ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-primary" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                Features
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className={`font-medium transition-colors ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-primary" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                How It Works
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("testimonials")}
                className={`font-medium transition-colors ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-primary" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                Testimonials
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("pricing")}
                className={`font-medium transition-colors ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-primary" 
                    : "text-white/90 hover:text-white"
                }`}
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
