import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { WhyItMatters } from "@/components/WhyItMatters";
import { HowItWorks } from "@/components/HowItWorks";
import { LucidDreamingSection } from "@/components/LucidDreamingSection";
import { CaseStudy } from "@/components/CaseStudy";
import { Testimonials } from "@/components/Testimonials";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard", { replace: true });
      }
    });

    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
       <HowItWorks />
       <LucidDreamingSection />
      <CaseStudy />
      <WhyItMatters />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
