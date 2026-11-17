import React from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

export const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-darkbg text-bark dark:text-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sand/60 dark:bg-darkcard border border-sand dark:border-darkborder text-olive-800 dark:text-sand mb-3 inline-block">
            Community Guidelines & Trust Charter
          </span>
          <h1 className="font-serif-brand text-4xl font-bold text-olive-900 dark:text-sand mb-2">
            Terms of Service & Trust Charter
          </h1>
          <p className="text-xs text-earth dark:text-cream/70">
            Last updated: November 2026 • Governs all exchanges on Rootly
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm space-y-6 text-xs sm:text-sm text-earth dark:text-cream/80 leading-relaxed">
          <section>
            <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
              1. The Homegrown Pledge
            </h3>
            <p>
              By registering on Rootly, all users pledge that produce listed on the platform is cultivated in residential gardens, terraces, homesteads, or small community plots. Commercial resale of wholesale market produce is strictly prohibited and subject to immediate account termination.
            </p>
          </section>

          <section>
            <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
              2. Advisory Nature of AI Suggestions
            </h3>
            <p>
              Harvest AI recommendations regarding harvest dates, produce recognition, and price guidelines are strictly advisory. Users must verify all produce in person upon exchange. Rootly does not verify organic or pesticide-free certification based solely on photographs.
            </p>
          </section>

          <section>
            <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
              3. Barter & Monetary Exchange Etiquette
            </h3>
            <p>
              Members agree to honor agreed pickup time windows, communicate respectfully, and inspect barter goods fairly. Repeated unannounced cancellations may result in account review or suspension by community moderators.
            </p>
          </section>

          <section>
            <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
              4. Community Reviews & Trust
            </h3>
            <p>
              Reviews may only be left by verified participants after a completed exchange. Defamatory, fraudulent, or retaliatory reviews are prohibited and subject to administrative removal.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
