import React from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

export const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-darkbg text-bark dark:text-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/60 dark:bg-darkcard border border-sand dark:border-darkborder text-xs font-semibold text-olive-800 dark:text-sand mb-4">
            <span>🌱</span> Our Hyperlocal Mission
          </div>
          <h1 className="font-serif-brand text-4xl sm:text-5xl font-bold text-olive-900 dark:text-sand mb-4 leading-tight">
            Rooted in Neighborhoods, Grown with Care.
          </h1>
          <p className="text-base sm:text-lg text-earth dark:text-cream/80 leading-relaxed font-normal">
            Homegrown Produce Exchange was born from a simple belief: the freshest, cleanest, and most nourishing food doesn't travel thousands of kilometers in refrigerated containers. It grows right over the fence.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm">
            <div className="w-12 h-12 rounded-2xl bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-sand flex items-center justify-center text-2xl mb-4">
              🌿
            </div>
            <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
              Zero-Mile Food Network
            </h3>
            <p className="text-xs sm:text-sm text-earth dark:text-cream/70 leading-relaxed">
              Eliminate supply chain food miles, refrigeration emissions, and industrial packaging by exchanging directly within 1 to 5 kilometers of your home.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm">
            <div className="w-12 h-12 rounded-2xl bg-terracotta/20 text-terracotta flex items-center justify-center text-2xl mb-4">
              🔄
            </div>
            <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
              Surplus to Abundance
            </h3>
            <p className="text-xs sm:text-sm text-earth dark:text-cream/70 leading-relaxed">
              When your backyard mango tree or papaya tree yields 20kg of fruit all at once, barter or share the surplus with neighbors rather than letting it spoil.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm">
            <div className="w-12 h-12 rounded-2xl bg-sand/60 text-earth-brown flex items-center justify-center text-2xl mb-4">
              🤝
            </div>
            <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
              Community Trust First
            </h3>
            <p className="text-xs sm:text-sm text-earth dark:text-cream/70 leading-relaxed">
              Every participant operates as both a grower and neighbor. Verified home gardens, transparent reviews, and face-to-face exchanges build lifelong trust.
            </p>
          </div>
        </div>

        {/* Malayalam Cultural Heritage Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-olive-800 text-cream relative overflow-hidden mb-16 shadow-warm-lg">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-200 block mb-2">
              നാട്ടുനന്മയും സ്വാഭാവിക സമൃദ്ധിയും
            </span>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold mb-4">
              Reclaiming the Culture of Sharing ("വിളവ് പങ്കിടൽ")
            </h2>
            <p className="text-sm text-cream/90 leading-relaxed mb-4">
              In traditional Kerala homesteads, extra cheera, tapioca, jackfruit, and coconut were always shared across the fence. Rootly combines that timeless community warmth with modern hyperlocal maps and intelligent harvest assistance.
            </p>
            <p className="font-malayalam text-sand text-sm">
              "നമ്മുടെ സ്വന്തം മണ്ണിൽ വിളഞ്ഞ നാടൻ വിളവുകൾ, നമ്മുടെ അടുത്തുള്ളവർക്കായി."
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
