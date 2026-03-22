import dreamweaveLogo from "@/assets/dreamweave-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 text-white mb-4">
              <img src={dreamweaveLogo} alt="DreamWeave" className="w-10 h-10 rounded-xl" />
              <span className="font-bold text-xl">DreamWeave</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Decode your dreams. Discover yourself. AI-powered dream analysis that actually makes sense.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#how-it-works" className="text-sm hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="text-sm hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </div>


          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/contact" className="text-sm hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} DreamWeave.me. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
