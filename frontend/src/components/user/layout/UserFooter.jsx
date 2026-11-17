import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/user/useTranslation.js';

export const UserFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-cream-card dark:bg-darkcard border-t border-sand dark:border-darkborder pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-sand/60 dark:border-darkborder">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-3 pr-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-cream dark:bg-darkbg ring-2 ring-terracotta/40 shadow-sm shrink-0">
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
              <span className="font-serif-brand text-2xl font-bold tracking-tight text-olive-800 dark:text-sand">
                ROOTLY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-earth dark:text-cream/70 max-w-md leading-relaxed">
              Neighbourhood-powered produce exchange connecting home gardens to cultivate community resilience, celebrate local food, and eliminate produce waste.
            </p>
            <div className="mt-2 p-3 rounded-xl bg-cream dark:bg-darkbg border border-sand/70 dark:border-darkborder max-w-sm">
              <p className="font-malayalam text-xs text-olive-800 dark:text-sand font-semibold leading-snug">
                "തനിമയുള്ള നാടൻ വിളവുകൾ നമ്മുടെ തൊട്ടടുത്ത്"
              </p>
              <span className="text-[10px] text-terracotta block mt-0.5 font-medium uppercase tracking-wider">
                Malayalam Community Motto
              </span>
            </div>
          </div>

          {/* Col 2: Marketplace */}
          <div className="flex flex-col gap-2">
            <h4 className="font-serif-brand font-bold text-sm text-olive-900 dark:text-sand uppercase tracking-wider mb-1">
              Marketplace
            </h4>
            <ul className="flex flex-col gap-1.5 text-xs text-earth dark:text-cream/70">
              <li>
                <Link to="/explore" className="hover:text-terracotta transition">
                  {t('nav.explore', 'Explore Produce')}
                </Link>
              </li>
              <li>
                <Link to="/buy-sell" className="hover:text-terracotta transition">
                  {t('nav.buySell', 'Buy & Sell Workspace')}
                </Link>
              </li>
              <li>
                <Link to="/barter" className="hover:text-terracotta transition">
                  {t('nav.barter', 'Barter Exchange')}
                </Link>
              </li>
              <li>
                <Link to="/harvest-planner" className="hover:text-terracotta transition">
                  {t('nav.harvestPlanner', 'Upcoming Harvests')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Intelligence & Community */}
          <div className="flex flex-col gap-2">
            <h4 className="font-serif-brand font-bold text-sm text-olive-900 dark:text-sand uppercase tracking-wider mb-1">
              Intelligence
            </h4>
            <ul className="flex flex-col gap-1.5 text-xs text-earth dark:text-cream/70">
              <li>
                <Link to="/harvest-ai" className="hover:text-terracotta transition flex items-center gap-1">
                  <span>Harvest AI Studio</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-terracotta/20 text-terracotta text-[9px] font-bold">AI</span>
                </Link>
              </li>
              <li>
                <Link to="/harvest-planner" className="hover:text-terracotta transition">
                  Seasonal Crop Calendar
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-terracotta transition">
                  Barter Guidelines
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-terracotta transition">
                  Local Growers Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Trust */}
          <div className="flex flex-col gap-2">
            <h4 className="font-serif-brand font-bold text-sm text-olive-900 dark:text-sand uppercase tracking-wider mb-1">
              Trust & Legal
            </h4>
            <ul className="flex flex-col gap-1.5 text-xs text-earth dark:text-cream/70">
              <li>
                <Link to="/about" className="hover:text-terracotta transition">
                  About Rootly
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-terracotta transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-terracotta transition">
                  Help & Support Desk
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-terracotta transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-terracotta transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-terracotta transition">
                  Terms of Exchange
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Hyperlocal Impact Strip */}
        <div className="pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-olive-800 dark:text-sand">
            <span className="flex items-center gap-1.5">
              <span>🌱</span> 100% Hyperlocal
            </span>
            <span className="flex items-center gap-1.5">
              <span>♻️</span> 0 Food Waste Goal
            </span>
            <span className="flex items-center gap-1.5">
              <span>🚶</span> Near-Zero Food Miles
            </span>
          </div>

          <p className="text-[11px] text-earth/60 dark:text-cream/50 text-center md:text-right">
            © {new Date().getFullYear()} ROOTLY Hyperlocal Produce Exchange. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
