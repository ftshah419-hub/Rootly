import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';
import adminService from '../../services/admin/adminService.js';
import '../../styles/admin/admin.css';

export const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [pendingReports, setPendingReports] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);

  // Poll or fetch telemetry badge counters
  useEffect(() => {
    let isMounted = true;

    const fetchBadgeData = async () => {
      try {
        const [overviewRes, notifRes] = await Promise.allSettled([
          adminService.getOverview(),
          adminService.getNotifications({ limit: 5 })
        ]);

        if (isMounted) {
          if (overviewRes.status === 'fulfilled' && overviewRes.value?.metrics?.moderation) {
            setPendingReports(overviewRes.value.metrics.moderation.pendingReports || 0);
            setPendingVerifications(overviewRes.value.metrics.moderation.pendingVerifications || 0);
          }
          if (notifRes.status === 'fulfilled' && notifRes.value) {
            setUnreadNotifications(notifRes.value.unreadCount || 0);
            setRecentNotifications(notifRes.value.notifications || []);
          }
        }
      } catch (err) {
        console.warn('Telemetry badge sync notice:', err.message);
      }
    };

    fetchBadgeData();
    const interval = setInterval(fetchBadgeData, 60000); // sync every 1 min
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F0E3] dark:bg-[#282B24] text-[#282B24] dark:text-[#F7F0E3] flex antialiased transition-colors duration-200">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        pendingReports={pendingReports}
        pendingVerifications={pendingVerifications}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          unreadNotifications={unreadNotifications}
          recentNotifications={recentNotifications}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
