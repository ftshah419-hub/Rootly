import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-cream-card dark:bg-darkcard border-t border-sand dark:border-darkborder pt-12 pb-8 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-sand/60 dark:border-darkborder">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden p-0.5 bg-cream dark:bg-darkbg ring-1 ring-terracotta/40">
                <img
                  src="/assets/rootly-emblem.jpg"
                  alt="Rootly"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGerBRQfpdBNjv_tvWZBwceuQeC_6xAyO9TfMfQdz1__HEbeofm6RrwCfTApZqY70AUjaw_lb5FWy0Urkd_dKWKRNKn3g-GqDs66i1fIDVSsShIEmC8wkNpQfn_EbBFNCcFZdwCBVNjT7CtJiixTHqpXEj40kHfmH-6vfsy8WL9uCdLRwIKQaPI1qzQ-8QM-dSJwU2Z4-O4I7hpw4KdIeGT010_dDfaW9qAr_GgWsPsWKGeZLQyHAWg';
                  }}
                />
              </div>
              <span className="font-serif-brand text-xl font-bold tracking-widest text-olive-800 dark:text-sand">
                ROOTLY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-earth dark:text-cream/70 max-w-md leading-relaxed">
              Rootly is a neighbourhood-powered hyper-local produce exchange. We connect home gardens, organic growers, and local households to share heirloom harvests, reduce food waste, and cultivate community resilience.
            </p>
            <p className="font-malayalam text-xs text-olive-800 dark:text-sand font-medium">
              🌱 "തനിമയുള്ള നാടൻ വിളവുകൾ നിങ്ങളുടെ തൊട്ടടുത്ത്"
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-2">
            <h5 className="font-serif-brand font-bold text-sm text-olive-900 dark:text-sand uppercase tracking-wider">
              Explore
            </h5>
            <ul className="space-y-1.5 text-xs text-earth dark:text-cream/70">
              <li><Link to="/about" className="hover:text-terracotta transition">About Rootly</Link></li>
              <li><Link to="/how-it-works" className="hover:text-terracotta transition">How It Works</Link></li>
              <li><Link to="/help" className="hover:text-terracotta transition">Help & FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-terracotta transition">Contact Community Desk</Link></li>
            </ul>
          </div>

          {/* Col 3: Trust & Legal */}
          <div className="space-y-2">
            <h5 className="font-serif-brand font-bold text-sm text-olive-900 dark:text-sand uppercase tracking-wider">
              Community Trust
            </h5>
            <ul className="space-y-1.5 text-xs text-earth dark:text-cream/70">
              <li><Link to="/privacy" className="hover:text-terracotta transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-terracotta transition">Terms & Conditions</Link></li>
              <li><span className="text-olive-700 dark:text-sand font-semibold">🔒 SSL Verified Security</span></li>
              <li><span className="text-olive-700 dark:text-sand font-semibold">🌿 Zero-Mile Food Waste Goal</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-earth/70 dark:text-cream/60 gap-3">
          <p>© {new Date().getFullYear()} Rootly Homegrown Produce Exchange. Built for community resilience.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/help" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
