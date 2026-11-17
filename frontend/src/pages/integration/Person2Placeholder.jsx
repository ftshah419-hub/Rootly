import React from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * PERSON 2 INTEGRATION ENTRYPOINT
 * 
 * Person 2 owns:
 * - Admin dashboard
 * - Admin analytics & metrics
 * - User moderation (suspend/block/activate)
 * - Product moderation
 * - Report management
 * - Verification management
 * 
 * Replace or connect this page with Person 2's Admin Dashboard.
 */
export const Person2Placeholder = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-darkbg text-bark dark:text-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center text-3xl mx-auto mb-4">
            🛡️
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-3 inline-block">
            Person 2 Integration Boundary
          </span>
          <h1 className="font-serif-brand text-3xl sm:text-4xl font-bold text-olive-900 dark:text-sand mb-4">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-earth dark:text-cream/80 max-w-lg mx-auto mb-6 leading-relaxed">
            Welcome, Administrator {user?.name || 'Stewards'}. The backend admin routes (/api/admin/*), authentication guards, audit logging, and moderation models are active. Person 2 connects the full analytics and moderation UI here.
          </p>

          <div className="inline-block p-4 rounded-2xl bg-sand/30 dark:bg-darkbg border border-sand dark:border-darkborder text-xs text-left text-earth dark:text-cream/70 max-w-md">
            <span className="font-bold text-olive-800 dark:text-sand block mb-1">
              Active Admin Endpoints:
            </span>
            <ul className="list-disc pl-4 space-y-1">
              <li>GET /api/admin/overview (System stats)</li>
              <li>GET /api/admin/reports (Moderation queue)</li>
              <li>Admin authorization verified on backend</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Person2Placeholder;
