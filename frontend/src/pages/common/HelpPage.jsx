import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { Link } from 'react-router-dom';

export const HelpPage = () => {
  const faqs = [
    {
      q: 'Do I need a commercial vendor license to exchange produce on Rootly?',
      a: 'No! Rootly is strictly designed for non-commercial backyard gardeners, hobbyist home growers, and urban households sharing surplus produce from their residential premises.'
    },
    {
      q: 'How does barter matching work?',
      a: 'You list what produce you have available and what items you would love in return. Rootly calculates compatibility scores based on category reciprocity and walking/cycling distance (< 5km).'
    },
    {
      q: 'Is my exact home address visible to everyone on the map?',
      a: 'Never. Public map pins show an approximate neighborhood radius (approx. 500m jitter). Your exact pickup address is only revealed to your confirmed exchange partner once you accept a scheduled exchange.'
    },
    {
      q: 'What is the role of Harvest AI?',
      a: 'Harvest AI assists with produce recognition, listing descriptions, planting schedules, and fair price suggestions. All AI outputs are purely advisory and never substitute for your own judgment.'
    },
    {
      q: 'Are produce items guaranteed to be certified organic?',
      a: 'Growers can declare their natural growing practices (e.g. cow dung compost, neem spray), but Rootly does not claim or certify items as government-certified organic based on photos or user declarations.'
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-darkbg text-bark dark:text-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sand/60 dark:bg-darkcard border border-sand dark:border-darkborder text-olive-800 dark:text-sand mb-4 inline-block">
            Community Knowledge Base
          </span>
          <h1 className="font-serif-brand text-4xl font-bold text-olive-900 dark:text-sand mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-earth dark:text-cream/80">
            Have questions about local exchange, barter ethics, or privacy? Find quick answers below.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-sand dark:border-darkborder bg-cream-card dark:bg-darkcard overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif-brand text-lg font-bold text-olive-800 dark:text-sand hover:text-olive-900 transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl shrink-0 text-earth dark:text-sage">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-earth dark:text-cream/70 leading-relaxed border-t border-sand/40 dark:border-darkborder pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still need help */}
        <div className="p-8 rounded-3xl bg-sand/30 dark:bg-darkcard/50 border border-sand dark:border-darkborder text-center">
          <h4 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
            Still need assistance from our community team?
          </h4>
          <p className="text-xs sm:text-sm text-earth dark:text-cream/70 mb-4 max-w-sm mx-auto">
            Our neighborhood support stewards are here to help resolve any account or community dispute.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream text-xs font-semibold transition shadow-xs"
          >
            Contact Support Desk →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpPage;
