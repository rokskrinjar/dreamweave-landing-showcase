import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section id="pricing" className="py-24 cta-dark-gradient text-center">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Ready to unlock your dream wisdom?
        </h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Start your journey of self-discovery today. Join thousands of dreamers who have found deeper meaning in their nightly adventures.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            <span className="mr-2">🚀</span>
            Start Free Trial
          </Button>
          <Button className="bg-white/10 text-white hover:bg-white/20 font-semibold px-8 py-6 text-lg border border-white/20 backdrop-blur-md hover:-translate-y-1 transition-all">
            <span className="mr-2">📱</span>
            Download App
          </Button>
        </div>
      </div>
    </section>
  );
};
