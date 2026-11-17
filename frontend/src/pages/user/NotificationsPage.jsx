import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Check, CheckCheck, Clock, Sprout, ShoppingBag, 
  Scale, Calendar, ShieldCheck, Heart 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import { useTranslation } from '../../hooks/user/useTranslation';
import { notificationService } from '../../services/user/notificationService';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      const list = res?.notifications || res?.data || (Array.isArray(res) ? res : []);
      setNotifications(list);
    } catch (err) {
      console.warn('Notifications fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => (n._id || n.id) === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = notifications.filter(n => filter === 'unread' ? !n.read : true);

  const getIcon = (type) => {
    switch (type) {
      case 'EXCHANGE_REQUEST':
      case 'BUY':
        return <ShoppingBag className="w-4 h-4 text-olive" />;
      case 'BARTER':
      case 'BARTER_MATCH':
        return <Scale className="w-4 h-4 text-terracotta" />;
      case 'FREE':
        return <Heart className="w-4 h-4 text-sage" />;
      case 'PICKUP':
      case 'PIN':
        return <Calendar className="w-4 h-4 text-olive" />;
      default:
        return <Sprout className="w-4 h-4 text-olive" />;
    }
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/40 dark:border-sand/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-bark dark:text-warm-white">
                {t('notifications.title', 'Activity & Community Notifications')}
              </h1>
              <p className="text-xs text-earth dark:text-sand/70">
                Track exchange requests, barter matches, and porch pickup confirmations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {/* Filter buttons */}
            <div className="flex bg-sand/30 dark:bg-sand/10 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'all'
                    ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold'
                    : 'text-earth dark:text-sand'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'unread'
                    ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold'
                    : 'text-earth dark:text-sand'
                }`}
              >
                Unread
              </button>
            </div>

            <button
              onClick={handleMarkAllRead}
              className="text-xs text-olive dark:text-sage font-medium hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-20 bg-sand/20 dark:bg-sand/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-cream/30 dark:bg-bark/20 rounded-3xl border border-dashed border-sand dark:border-sand/20 space-y-2">
            <Bell className="w-10 h-10 text-olive/40 mx-auto" />
            <h4 className="text-sm font-serif font-bold text-bark dark:text-warm-white">
              No Notifications Found
            </h4>
            <p className="text-xs text-earth dark:text-sand/70">
              You are completely caught up with your neighbourhood exchange network!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-sand/30 dark:divide-sand/10 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl overflow-hidden shadow-sm">
            {filtered.map((n) => {
              const isUnread = !n.read && !n.isRead;

              return (
                <div
                  key={n._id || n.id}
                  onClick={() => {
                    handleMarkAsRead(n._id || n.id);
                    if (n.link) navigate(n.link);
                    else navigate('/workspace');
                  }}
                  className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                    isUnread
                      ? 'bg-olive/5 dark:bg-olive/10 border-l-4 border-olive'
                      : 'hover:bg-cream/30 dark:hover:bg-bark/20'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-sand/30 dark:bg-sand/15 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm ${isUnread ? 'font-bold text-bark dark:text-warm-white' : 'font-medium text-bark/90 dark:text-warm-white/90'}`}>
                        {n.title || 'Exchange Update'}
                      </h4>
                      <span className="text-[10px] text-earth/70 dark:text-sand/60">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </span>
                    </div>

                    <p className="text-xs text-earth dark:text-sand/80 leading-relaxed">
                      {n.message || n.content || 'Your neighbourhood produce activity has a new update.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </UserLayout>
  );
};

export default NotificationsPage;
