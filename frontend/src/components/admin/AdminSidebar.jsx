import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';

export const AdminSidebar = ({
  isOpen = false,
  onClose,
  pendingReports = 0,
  pendingVerifications = 0
}) => {
  const { user, logout } = useAuth();
  const { t } = useAdminLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/overview', labelKey: 'navOverview', icon: 'dashboard' },
    { to: '/admin/users', labelKey: 'navUsers', icon: 'groups' },
    { to: '/admin/products', labelKey: 'navProducts', icon: 'agriculture' },
    { to: '/admin/exchanges', labelKey: 'navExchanges', icon: 'sync_alt' },
    { to: '/admin/harvests', labelKey: 'navHarvests', icon: 'calendar_month' },
    {
      to: '/admin/reports',
      labelKey: 'navReports',
      icon: 'gavel',
      badge: pendingReports > 0 ? `${pendingReports} New` : null,
      badgeColor: 'bg-[#C8754D]'
    },
    {
      to: '/admin/verifications',
      labelKey: 'navVerifications',
      icon: 'verified',
      badge: pendingVerifications > 0 ? `${pendingVerifications}` : null,
      badgeColor: 'bg-[#3E5035]'
    },
    { to: '/admin/reviews', labelKey: 'navReviews', icon: 'star' },
    { to: '/admin/sustainability', labelKey: 'navSustainability', icon: 'eco' },
    { to: '/admin/ai-usage', labelKey: 'navAIUsage', icon: 'psychology' },
    { to: '/admin/notifications', labelKey: 'navNotifications', icon: 'notifications' },
    { to: '/admin/audit-logs', labelKey: 'navAuditLogs', icon: 'history_edu' },
    { to: '/admin/settings', labelKey: 'navSettings', icon: 'tune' }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#F7F0E3] dark:bg-[#282B24] border-r border-[#E9D8B9]/80 dark:border-stone-700/80 flex flex-col justify-between py-4 transition-transform duration-300 ease-in-out shadow-sm lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header & Brand */}
          <div className="px-6 pb-4 mb-2 flex items-center justify-between border-b border-[#E9D8B9]/60 dark:border-stone-700/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3E5035] flex items-center justify-center text-[#FFFDF8] shadow-sm">
                <span className="material-symbols-outlined !text-xl">potted_plant</span>
              </div>
              <div>
                <span className="font-serif-brand text-xl font-bold tracking-tight text-[#3E5035] dark:text-[#adc29f] block leading-none">
                  {t('brandName')}
                </span>
                <span className="text-[11px] font-bold text-[#C8754D] dark:text-[#ffa276] uppercase tracking-wider block mt-1">
                  {t('brandSubtitle')}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-[#E9D8B9]/70 dark:bg-stone-800 text-[#795640] dark:text-[#A5AD91] rounded-full">
              v2.4
            </span>
          </div>

          <div className="px-5 mb-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#795640]/70 dark:text-[#A5AD91]/70 px-3">
              {t('navOperations')}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto admin-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#3E5035] text-[#FFFDF8] shadow-sm'
                      : 'text-[#282B24] dark:text-[#F7F0E3] hover:bg-[#E9D8B9]/40 dark:hover:bg-[#33372E]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 truncate">
                      <span
                        className={`material-symbols-outlined !text-lg shrink-0 ${
                          isActive
                            ? 'text-[#FFFDF8]'
                            : 'text-[#795640] dark:text-[#A5AD91] group-hover:text-[#3E5035] dark:group-hover:text-[#adc29f]'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{t(item.labelKey)}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0 shadow-xs ${item.badgeColor || 'bg-[#C8754D]'}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="px-4 pt-3 border-t border-[#E9D8B9]/60 dark:border-stone-700/60">
          <div className="bg-[#FFFDF8] dark:bg-[#33372E] p-3.5 rounded-2xl border border-[#E9D8B9]/70 dark:border-stone-700/60 shadow-xs">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-full bg-[#3E5035]/15 dark:bg-[#adc29f]/20 text-[#3E5035] dark:text-[#adc29f] flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-[#282B24] dark:text-[#F7F0E3] truncate">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[11px] text-[#795640] dark:text-[#A5AD91] truncate">
                  {user?.email || 'admin@rootly.local'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E9D8B9]/40 dark:border-stone-700/40 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-400 hover:underline"
              >
                <span className="material-symbols-outlined !text-sm">logout</span>
                <span>{t('endSession')}</span>
              </button>
              <span className="text-[10px] text-[#795640]/60 dark:text-[#A5AD91]/60">
                {t('secureNode')}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
