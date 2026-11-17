import React from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { Link } from 'react-router-dom';

/**
 * PERSON 1 INTEGRATION ENTRYPOINT
 * 
 * Person 1 owns:
 * - Home page
 * - User dashboard
 * - Explore page & products
 * - Product details & barter workflows
 * - User profile & garden management
 * 
 * Replace or connect this page with Person 1's Home / Marketplace view.
 */
export const Person1Placeholder = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-darkbg text-bark dark:text-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm text-center">
          <div className="w-16 h-16 rounded-full bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-sand flex items-center justify-center text-3xl mx-auto mb-4">
            🌱
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-olive-50 dark:bg-olive-950/60 text-olive-800 dark:text-sand border border-olive-200 dark:border-olive-800 mb-3 inline-block">
            Person 1 Integration Boundary
          </span>
          <h1 className="font-serif-brand text-3xl sm:text-4xl font-bold text-olive-900 dark:text-sand mb-4">
            Welcome to Rootly Produce Exchange
          </h1>
          <p className="text-sm text-earth dark:text-cream/80 max-w-lg mx-auto mb-8 leading-relaxed">
            The backend MVC core, 26 Mongoose database models, JWT authentication, and shared Leaflet map foundation are ready and connected. Person 1 connects the user marketplace here.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream font-medium text-xs sm:text-sm transition shadow-sm"
            >
              Test Login & Registration →
            </Link>
            <Link
              to="/how-it-works"
              className="px-6 py-2.5 rounded-xl border border-sand dark:border-darkborder bg-cream dark:bg-darkbg text-bark dark:text-cream text-xs sm:text-sm font-medium hover:bg-cream-hover transition"
            >
              View How It Works
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Person1Placeholder;
