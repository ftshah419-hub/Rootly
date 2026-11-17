import React from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { Link } from 'react-router-dom';

export const HowItWorksPage = () => {
  const steps = [
    {
      num: '01',
      title: 'List or Discover Produce',
      desc: 'Snap a picture of your backyard harvest. Harvest AI helps describe it and suggest fair local pricing. Or browse our interactive map to discover gardens within 5km.',
      icon: '📸'
    },
    {
      num: '02',
      title: 'Choose Your Exchange Mode',
      desc: 'Sell for a fair neighborly price, barter directly for produce you need (like tapioca for tomatoes), or offer surplus as a free community gift.',
      icon: '🔄'
    },
    {
      num: '03',
      title: 'Coordinate Safe Local Pickup',
      desc: 'Chat directly with your neighbor. Once the exchange is accepted, agree on a morning or evening pickup slot. Exact location is kept private until confirmed.',
      icon: '📍'
    },
    {
      num: '04',
      title: 'Track Sustainability & Build Trust',
      desc: 'Every exchange prevents food waste and cuts transport emissions. Mark the exchange complete, leave a review, and watch your neighborhood impact grow!',
      icon: '🌱'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-darkbg text-bark dark:text-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sand/60 dark:bg-darkcard border border-sand dark:border-darkborder text-olive-800 dark:text-sand mb-4 inline-block">
            Step-by-Step Guide
          </span>
          <h1 className="font-serif-brand text-4xl sm:text-5xl font-bold text-olive-900 dark:text-sand mb-4">
            How Rootly Connects Neighbors
          </h1>
          <p className="text-base text-earth dark:text-cream/80">
            A single account allows you to buy, sell, barter, and share. No separate grower or buyer tiers.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((s) => (
            <div
              key={s.num}
              className="p-8 rounded-3xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm relative"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{s.icon}</span>
                <span className="font-serif-brand text-3xl font-bold text-sand dark:text-olive-700">
                  {s.num}
                </span>
              </div>
              <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-earth dark:text-cream/70 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="text-center p-10 rounded-3xl bg-sand/40 dark:bg-darkcard/60 border border-sand dark:border-darkborder mb-16">
          <h3 className="font-serif-brand text-2xl font-bold text-olive-900 dark:text-sand mb-3">
            Ready to taste true neighborhood freshness?
          </h3>
          <p className="text-xs sm:text-sm text-earth dark:text-cream/80 max-w-md mx-auto mb-6">
            Join thousands of local home gardeners and food lovers cultivating resilient communities.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream font-medium text-sm transition-all shadow-md"
          >
            Create Your Account Today →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
