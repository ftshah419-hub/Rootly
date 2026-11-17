import React from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-darkbg text-bark dark:text-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sand/60 dark:bg-darkcard border border-sand dark:border-darkborder text-olive-800 dark:text-sand mb-3 inline-block">
            Data Protection & Privacy
          </span>
          <h1 className="font-serif-brand text-4xl font-bold text-olive-900 dark:text-sand mb-2">
            Rootly Privacy Policy
          </h1>
          <p className="text-xs text-earth dark:text-cream/70">
            Last updated: November 2026 • Hyperlocal Community Privacy Standard
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm space-y-6 text-xs sm:text-sm text-earth dark:text-cream/80 leading-relaxed">
          <section>
            <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
              1. Hyperlocal Coordinate Obfuscation (Your Home Address is Private)
            </h3>
            <p>
              Your security and privacy are paramount. On public maps and explore listings, Rootly never displays your exact residential coordinates. Coordinates are automatically jittered to an approximate neighborhood zone (typically 500m radius). Your exact pickup address is only revealed to your confirmed exchange partner once you accept an exchange request.
            </p>
          </section>

          <section>
            <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
              2. Information We Collect
            </h3>
            <p>
              We collect your name, email, optional phone number for harvest coordination, garden profile preferences, and produce photos. We do not sell your personal data, run third-party advertising trackers, or share your contact info with commercial telemarketers.
            </p>
          </section>

          <section>
            <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
              3. AI Usage & Image Processing
            </h3>
            <p>
              Harvest AI features process uploaded produce photographs solely to recognize crops, assess approximate ripeness, and generate draft descriptions. Harvest AI does not store facial recognition or private biometric data.
            </p>
          </section>

          <section>
            <h3 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-2">
              4. Session Security & Refresh Token Rotation
            </h3>
            <p>
              Passwords are cryptographically hashed using industry-standard bcrypt algorithms. Refresh tokens are hashed and stored securely with automatic rotation upon every refresh request.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
