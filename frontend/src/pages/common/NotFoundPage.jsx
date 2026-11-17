import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-darkbg text-bark dark:text-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <span className="text-5xl mb-4">🌱</span>
        <h1 className="font-serif-brand text-4xl font-bold text-olive-800 dark:text-sand mb-2">
          404 — Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-earth dark:text-cream/70 mb-6 leading-relaxed">
          Looks like this garden path leads nowhere. The page you are looking for may have been moved or does not exist.
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

export default NotFoundPage;
