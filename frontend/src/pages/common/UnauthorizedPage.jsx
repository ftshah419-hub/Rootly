import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-darkbg text-bark dark:text-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center text-3xl mb-4">
          🔒
        </div>
        <h1 className="font-serif-brand text-3xl font-bold text-olive-800 dark:text-sand mb-2">
          Access Denied
        </h1>
        <p className="text-xs sm:text-sm text-earth dark:text-cream/70 mb-6 leading-relaxed">
          You do not have the required permissions or administrator privileges to view this page.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream text-xs font-semibold transition shadow-xs"
        >
          Return to Marketplace Home
        </Link>
      </main>

      <Footer />
    </div>
  );
};

export default UnauthorizedPage;
