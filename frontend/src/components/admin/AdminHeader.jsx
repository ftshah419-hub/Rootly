import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';

export const AdminHeader = ({
  onToggleSidebar,
  unreadNotifications = 0,
  recentNotifications = []
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useAdminLanguage();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFDF8]/90 dark:bg-[#282B24]/90 backdrop-blur-md border-b border-[#E9D8B9]/80 dark:border-stone-700/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Node info */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
          className="lg:hidden p-2 rounded-xl text-[#282B24] dark:text-[#F7F0E3] hover:bg-[#F7F0E3] dark:hover:bg-[#33372E] transition-colors"
        >
          <span className="material-symbols-outlined !text-2xl">menu</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-[#282B24] dark:text-[#F7F0E3]">
            Central Agronomy Authority
          </span>
          <span className="text-[#795640]/50 dark:text-[#A5AD91]/50">•</span>
          <span className="text-[#795640] dark:text-[#A5AD91]">
            Kochi Node #04 APMC Live
          </span>
        </div>
      </div>

      {/* Right: Quick actions, notifications, language, theme, avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label="Toggle language"
          className="px-2.5 py-1.5 rounded-xl border border-[#E9D8B9] dark:border-stone-700 bg-[#F7F0E3]/70 dark:bg-[#33372E] text-xs font-bold text-[#3E5035] dark:text-[#adc29f] hover:bg-[#E9D8B9] dark:hover:bg-stone-700 transition-colors"
        >
          {language === 'en' ? 'മലയാളം' : 'English'}
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={t('toggleTheme')}
          className="p-2 rounded-xl border border-[#E9D8B9] dark:border-stone-700 bg-[#F7F0E3]/70 dark:bg-[#33372E] text-[#282B24] dark:text-[#F7F0E3] hover:bg-[#E9D8B9] dark:hover:bg-stone-700 transition-colors"
        >
          <span className="material-symbols-outlined !text-xl leading-none">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            aria-label="Admin Notifications"
            className="relative p-2 rounded-xl border border-[#E9D8B9] dark:border-stone-700 bg-[#F7F0E3]/70 dark:bg-[#33372E] text-[#282B24] dark:text-[#F7F0E3] hover:bg-[#E9D8B9] dark:hover:bg-stone-700 transition-colors"
          >
            <span className="material-symbols-outlined !text-xl leading-none">
              notifications
            </span>
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-stone-900">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9] dark:border-stone-700 rustic-shadow-3 p-4 z-50 animate-fade-in"
              role="menu"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E9D8B9]/60 dark:border-stone-700/60 mb-2">
                <h4 className="font-serif-brand text-base font-bold text-[#282B24] dark:text-[#F7F0E3]">
                  {t('navNotifications')}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigate('/admin/notifications');
                  }}
                  className="text-xs font-semibold text-[#3E5035] dark:text-[#adc29f] hover:underline"
                >
                  {t('viewDetails')}
                </button>
              </div>

              {recentNotifications.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#795640] dark:text-[#A5AD91]">
                  {t('noDataFound')}
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto admin-scrollbar">
                  {recentNotifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif._id}
                      className="p-2.5 rounded-xl bg-[#F7F0E3]/50 dark:bg-[#282B24]/40 hover:bg-[#F7F0E3] dark:hover:bg-[#282B24] transition-colors cursor-pointer text-xs"
                      onClick={() => {
                        setIsNotifOpen(false);
                        navigate('/admin/notifications');
                      }}
                    >
                      <div className="font-semibold text-[#282B24] dark:text-[#F7F0E3] truncate">
                        {notif.title}
                      </div>
                      <div className="text-[11px] text-[#795640] dark:text-[#A5AD91] line-clamp-2 mt-0.5">
                        {notif.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Avatar Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E9D8B9]/60 dark:border-stone-700/60">
          <div className="w-8 h-8 rounded-full bg-[#3E5035] text-[#FFFDF8] font-bold flex items-center justify-center text-xs shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <span className="hidden md:inline text-xs font-bold text-[#282B24] dark:text-[#F7F0E3] max-w-[120px] truncate">
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
