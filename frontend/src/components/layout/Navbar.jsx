import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-cream/90 dark:bg-darkbg/90 backdrop-blur-md border-b border-sand dark:border-darkborder transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-cream-card dark:bg-darkcard ring-2 ring-terracotta/40 shadow-sm flex items-center justify-center shrink-0">
            <img
              src="/assets/rootly-emblem.jpg"
              alt="Rootly emblem"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGerBRQfpdBNjv_tvWZBwceuQeC_6xAyO9TfMfQdz1__HEbeofm6RrwCfTApZqY70AUjaw_lb5FWy0Urkd_dKWKRNKn3g-GqDs66i1fIDVSsShIEmC8wkNpQfn_EbBFNCcFZdwCBVNjT7CtJiixTHqpXEj40kHfmH-6vfsy8WL9uCdLRwIKQaPI1qzQ-8QM-dSJwU2Z4-O4I7hpw4KdIeGT010_dDfaW9qAr_GgWsPsWKGeZLQyHAWg';
              }}
            />
          </div>
          <div>
            <span className="font-serif-brand text-xl font-bold tracking-widest text-olive-800 dark:text-sand block leading-tight">
              ROOTLY
            </span>
            <span className="text-[10px] uppercase tracking-widest text-earth dark:text-cream/70 font-medium hidden sm:block">
              Grown Close. Shared Fresh.
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Informational Pages) */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-bark/80 dark:text-cream/80">
          <Link to="/about" className="hover:text-olive-700 dark:hover:text-sand transition">
            About
          </Link>
          <Link to="/how-it-works" className="hover:text-olive-700 dark:hover:text-sand transition">
            How It Works
          </Link>
          <Link to="/help" className="hover:text-olive-700 dark:hover:text-sand transition">
            Help & Support
          </Link>
          <Link to="/contact" className="hover:text-olive-700 dark:hover:text-sand transition">
            Contact
          </Link>
        </nav>

        {/* Right Actions: Lang, Theme, Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="text-xs font-semibold px-2.5 py-1 rounded-full text-olive-700 dark:text-cream bg-white/70 dark:bg-darkcard/80 border border-sand/60 dark:border-darkborder hover:bg-cream dark:hover:bg-darkbg transition flex items-center gap-1.5 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span>
            <span>{language === 'en' ? 'EN / മലയാളം' : 'മലയാളം / EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-full text-olive-700 dark:text-cream bg-white/70 dark:bg-darkcard/80 border border-sand/60 dark:border-darkborder hover:bg-cream dark:hover:bg-darkbg transition flex items-center justify-center shadow-2xs"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-olive-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* User Auth Info */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-olive-50 dark:bg-olive-950/60 text-olive-800 dark:text-sand border border-olive-200 dark:border-olive-800">
                {user?.name?.split(' ')[0]} ({user?.role})
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-terracotta/10 hover:bg-terracotta hover:text-white text-terracotta border border-terracotta/30 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-olive-700 hover:bg-olive-800 text-cream transition shadow-xs"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
