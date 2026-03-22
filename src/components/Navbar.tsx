import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";
import dreamweaveLogo from "@/assets/dreamweave-logo.png";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navLinks = [
    { label: "Features", id: "features" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Testimonials", id: "testimonials" },
    { label: "Pricing", id: "pricing" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? "bg-white/95 backdrop-blur-md border-b border-border"
        : "cta-dark-gradient border-b border-white/10"
    }`}>
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className={`flex items-center gap-3 font-bold text-2xl transition-colors ${
            isScrolled ? "text-foreground" : "text-white"
          }`}>
            <img src={dreamweaveLogo} alt="DreamWeave logo" className="w-10 h-10 rounded-xl" />
            DreamWeave
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollToSection(link.id)}
                  className={`font-medium transition-colors ${
                    isScrolled
                      ? "text-muted-foreground hover:text-primary"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <Link to={user ? "/dashboard" : "/auth"}>
                <Button className="gradient-navy text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  {user ? "Dashboard" : "Start Dreaming"}
                </Button>
              </Link>
            </li>
          </ul>

          <button
            className="md:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-white"}`} />
            )}
          </button>
        </div>

        {isMobileOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in-up">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`block w-full text-left font-medium py-2 ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
            <Link to={user ? "/dashboard" : "/auth"} className="block">
              <Button className="w-full gradient-indigo text-white font-semibold">
                {user ? "Dashboard" : "Start Dreaming"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
