import React, { useState, useEffect } from 'react';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';

export const NotificationsPage = () => {
  const { t } = useAdminLanguage();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all', 'unread'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      setError(err.message || 'Failed to retrieve notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await adminService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      alert(err.message || 'Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await adminService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      alert(err.message || 'Failed to mark all as read');
    }
  };

  const filteredNotifs = notifications.filter((n) =>
    filter === 'unread' ? !n.isRead : true
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8754D] dark:text-[#ffa276] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C8754D]"></span>
            <span>Alerts & Telemetry Dispatch</span>
          </div>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
            {t('navNotifications')}
          </h1>
          <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
            System dispatch alerts, trade milestones, and urgent moderation notifications.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3E5035] text-[#FFFDF8] text-xs font-semibold shadow-xs hover:bg-[#283920] transition-colors"
          >
            <span className="material-symbols-outlined !text-base">done_all</span>
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9D8B9]/60 dark:border-stone-700/60 pb-3">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-[#3E5035] text-[#FFFDF8]'
              : 'text-[#795640] dark:text-[#A5AD91] hover:bg-[#E9D8B9]/50'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'unread'
              ? 'bg-[#3E5035] text-[#FFFDF8]'
              : 'text-[#795640] dark:text-[#A5AD91] hover:bg-[#E9D8B9]/50'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchNotifications} />
      ) : filteredNotifs.length === 0 ? (
        <EmptyState
          icon="notifications_off"
          title="Notification Tray Clean"
          description="There are currently no administrative notifications matching this filter."
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-2xl border transition-all ${
                !n.isRead
                  ? 'bg-[#FFFDF8] dark:bg-[#33372E] border-[#3E5035]/40 rustic-shadow-2'
                  : 'bg-stone-50/70 dark:bg-stone-800/30 border-[#E9D8B9]/40 dark:border-stone-700/40 opacity-80'
              } flex items-start justify-between gap-4`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    !n.isRead
                      ? 'bg-[#3E5035]/15 text-[#3E5035] dark:bg-[#adc29f]/20 dark:text-[#adc29f]'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                  }`}
                >
                  <span className="material-symbols-outlined !text-lg">
                    {n.type === 'EXCHANGE_REQUEST'
                      ? 'sync_alt'
                      : n.type === 'HARVEST_ALERT'
                      ? 'calendar_month'
                      : 'info'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#282B24] dark:text-[#F7F0E3]">
                    {n.title}
                  </h4>
                  <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-[#795640]/70 dark:text-[#A5AD91]/70 mt-1 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(n._id)}
                  className="px-2.5 py-1 rounded-lg border border-[#E9D8B9] dark:border-stone-700 text-[11px] font-semibold text-[#3E5035] dark:text-[#adc29f] hover:bg-[#3E5035]/10 shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
