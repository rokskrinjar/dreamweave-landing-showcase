export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 text-white mb-4">
              <div className="w-10 h-10 gradient-indigo rounded-xl flex items-center justify-center text-xl">
                🌙
              </div>
              <span className="font-bold text-xl">DreamWeave.me</span>
            </div>
            <p className="text-sm leading-relaxed">
              Unlock the wisdom in your dreams with comprehensive psychological insights and intuitive journaling tools.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Dream Analysis
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Symbol Library
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Dream Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Research
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-sm text-slate-400">
            © 2025 DreamWeave.me. All rights reserved. Made with 🌙 for dreamers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};
