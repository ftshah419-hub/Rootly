import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useTheme } from '../../../context/ThemeContext.jsx';
import { useTranslation } from '../../../hooks/user/useTranslation.js';
import { notificationService } from '../../../services/user/notificationService.js';

export const UserNavbar = ({ onOpenSearch }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language, toggleLanguage } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch unread notifications count if logged in
  useEffect(() => {
    if (!isAuthenticated) return;
    let isSubscribed = true;

    notificationService.getNotifications().then((list) => {
      if (isSubscribed && Array.isArray(list)) {
        const unread = list.filter((n) => !n.isRead).length;
        setUnreadNotificationsCount(unread);
      }
    }).catch(() => {});

    return () => {
      isSubscribed = false;
    };
  }, [isAuthenticated]);

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: t('nav.home', 'Home') },
    { path: '/explore', label: t('nav.explore', 'Explore Produce') },
    { path: '/buy-sell', label: t('nav.buySell', 'Buy & Sell') },
    { path: '/barter', label: t('nav.barter', 'Barter') },
    { path: '/harvest-planner', label: t('nav.harvestPlanner', 'Harvest Planner') },
    { path: '/harvest-ai', label: t('nav.harvestAI', 'Harvest AI'), isAi: true }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-cream/90 dark:bg-darkbg/90 backdrop-blur-xl border-b border-sand dark:border-darkborder shadow-xs transition-colors duration-300">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-cream-card dark:bg-darkcard ring-2 ring-terracotta/40 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/assets/rootly-emblem.jpg"
                alt="Rootly Emblem"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGerBRQfpdBNjv_tvWZBwceuQeC_6xAyO9TfMfQdz1__HEbeofm6RrwCfTApZqY70AUjaw_lb5FWy0Urkd_dKWKRNKn3g-GqDs66i1fIDVSsShIEmC8wkNpQfn_EbBFNCcFZdwCBVNjT7CtJiixTHqpXEj40kHfmH-6vfsy8WL9uCdLRwIKQaPI1qzQ-8QM-dSJwU2Z4-O4I7hpw4KdIeGT010_dDfaW9qAr_GgWsPsWKGeZLQyHAWg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-brand text-2xl font-bold tracking-tight text-olive-800 dark:text-sand leading-none">
                ROOTLY
              </span>
              <span className="text-[10px] tracking-wider uppercase text-terracotta font-bold leading-tight mt-0.5">
                {t('tagline', 'Grown Close. Shared Fresh.')}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 bg-cream-card/60 dark:bg-darkcard/50 px-2 py-1.5 rounded-2xl border border-sand/40 dark:border-darkborder/50">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-1.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 ${
                  active
                    ? 'bg-olive-700 text-cream font-semibold shadow-xs'
                    : 'text-bark/80 dark:text-cream/80 hover:text-olive-700 dark:hover:text-sand hover:bg-cream dark:hover:bg-darkbg'
                }`}
              >
                <span>{item.label}</span>
                {item.isAi && (
                  <span className="px-1.5 py-0.2 rounded-full bg-terracotta/20 text-terracotta dark:bg-terracotta/30 dark:text-terracotta-light text-[10px] font-bold tracking-wider uppercase">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Hyperlocal Radius Pill */}
          <Link
            to="/explore"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder text-xs text-earth dark:text-cream/70 hover:border-olive-700 transition-colors shadow-2xs"
            title="Scan radius: 3 km"
          >
            <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></span>
            <span className="truncate max-w-[170px]">{t('nav.locationPill', 'Kochi Circle • within 3 km')}</span>
          </Link>

          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch || (() => navigate('/explore'))}
            aria-label="Search produce"
            className="p-2 rounded-full hover:bg-cream dark:hover:bg-darkcard text-bark/80 dark:text-cream/80 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Notifications Bell */}
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="p-2 rounded-full hover:bg-cream dark:hover:bg-darkcard text-bark/80 dark:text-cream/80 transition-colors relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-terracotta ring-2 ring-cream dark:ring-darkbg"></span>
            )}
          </Link>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder text-xs font-semibold text-olive-800 dark:text-sand hover:bg-cream dark:hover:bg-darkbg transition shadow-2xs"
          >
            <span className={language === 'en' ? 'text-olive-800 font-bold' : 'text-earth/60 font-normal'}>EN</span>
            <span className="opacity-40">/</span>
            <span className={language === 'ml' ? 'text-olive-800 font-bold font-malayalam' : 'text-earth/60 font-normal font-malayalam'}>മലയാളം</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full hover:bg-cream dark:hover:bg-darkcard text-bark/80 dark:text-cream/80 transition-colors"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-olive-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* User Profile / Auth Area */}
          {isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 pl-2 focus:outline-none"
              >
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-bark dark:text-cream leading-tight">
                    {user?.name || 'Urban Grower'}
                  </span>
                  <span className="text-[10px] text-terracotta font-medium leading-none">
                    {user?.profile?.gardenName || 'Home Grower'}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-olive-700/60 shadow-xs bg-olive-100 flex items-center justify-center font-bold text-olive-800 text-sm">
                  {user?.profile?.avatar ? (
                    <img src={user.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(user?.name || 'U')[0].toUpperCase()}</span>
                  )}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-sand/60 dark:border-darkborder">
                    <p className="text-xs font-bold text-olive-800 dark:text-sand">{user?.name}</p>
                    <p className="text-[11px] text-earth dark:text-cream/70 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1 text-xs font-medium text-bark dark:text-cream">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-cream dark:hover:bg-darkbg transition"
                    >
                      <span className="text-base">📊</span>
                      <span>{t('nav.dashboard', 'My Dashboard')}</span>
                    </Link>
                    <Link
                      to="/buy-sell"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-cream dark:hover:bg-darkbg transition"
                    >
                      <span className="text-base">🌱</span>
                      <span>{t('nav.buySell', 'My Garden Listings')}</span>
                    </Link>
                    <Link
                      to="/messages"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-cream dark:hover:bg-darkbg transition"
                    >
                      <span className="text-base">💬</span>
                      <span>{t('nav.messages', 'Messages & Offers')}</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-cream dark:hover:bg-darkbg transition"
                    >
                      <span className="text-base">🏡</span>
                      <span>{t('nav.profile', 'Garden Profile')}</span>
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-sand/60 dark:border-darkborder">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-terracotta hover:bg-terracotta/10 transition"
                    >
                      <span>🚪</span>
                      <span>{t('nav.signOut', 'Sign Out')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <span>{t('nav.signIn', 'Sign In')}</span>
            </Link>
          )}

          {/* Mobile Drawer Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            aria-label="Open mobile menu"
            className="xl:hidden p-2 rounded-xl text-bark/80 dark:text-cream/80 hover:bg-cream dark:hover:bg-darkcard transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileDrawerOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isMobileDrawerOpen && (
        <div className="xl:hidden border-t border-sand dark:border-darkborder bg-cream-card dark:bg-darkcard px-4 pt-3 pb-6 flex flex-col gap-2 shadow-warm">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileDrawerOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                  isActive(item.path)
                    ? 'bg-olive-700 text-cream font-bold'
                    : 'text-bark dark:text-cream hover:bg-cream dark:hover:bg-darkbg'
                }`}
              >
                <span>{item.label}</span>
                {item.isAi && (
                  <span className="px-2 py-0.5 rounded-full bg-terracotta/20 text-terracotta text-[10px] font-bold uppercase">
                    AI
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-sand/60 dark:border-darkborder flex items-center justify-between">
            <span className="text-xs font-medium text-earth dark:text-cream/70">Language / ഭാഷ</span>
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-xs font-bold text-olive-800 dark:text-sand px-3 py-1 rounded-full bg-cream dark:bg-darkbg border border-sand dark:border-darkborder"
            >
              {language === 'en' ? 'മലയാളം' : 'English'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
