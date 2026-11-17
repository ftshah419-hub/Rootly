import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-darkbg text-bark dark:text-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sand/60 dark:bg-darkcard border border-sand dark:border-darkborder text-olive-800 dark:text-sand mb-4 inline-block">
            Get in Touch
          </span>
          <h1 className="font-serif-brand text-4xl font-bold text-olive-900 dark:text-sand mb-3">
            Contact Rootly Community Desk
          </h1>
          <p className="text-sm text-earth dark:text-cream/80">
            Reach out for community partnerships, neighborhood pilot projects, or support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Info Card */}
          <div className="md:col-span-1 space-y-6 p-6 rounded-3xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm">
            <div>
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider block mb-1">
                Community Hub
              </span>
              <p className="text-xs text-earth dark:text-cream/80">
                Aluva & Greater Kochi Neighborhoods<br />Kerala, India
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider block mb-1">
                Direct Email
              </span>
              <p className="text-xs font-mono text-olive-800 dark:text-sand">
                community@rootly.local
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider block mb-1">
                Operating Hours
              </span>
              <p className="text-xs text-earth dark:text-cream/80">
                Mon - Sat: 8:00 AM - 6:00 PM IST
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <span className="text-4xl">🌱</span>
                <h3 className="font-serif-brand text-2xl font-bold text-olive-800 dark:text-sand">
                  Thank You, Neighbor!
                </h3>
                <p className="text-xs sm:text-sm text-earth dark:text-cream/70 max-w-sm mx-auto">
                  Your message has been received by our community stewards. We will respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-terracotta hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-bark dark:text-cream mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Maya Krishnan"
                      className="block w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-darkbg/90 border border-sand dark:border-darkborder focus:ring-2 focus:ring-olive-700 text-bark dark:text-cream"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-bark dark:text-cream mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="maya@community.eco"
                      className="block w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-darkbg/90 border border-sand dark:border-darkborder focus:ring-2 focus:ring-olive-700 text-bark dark:text-cream"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-cream mb-1">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="block w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-darkbg/90 border border-sand dark:border-darkborder focus:ring-2 focus:ring-olive-700 text-bark dark:text-cream"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Garden Verification Help">Garden Verification Help</option>
                    <option value="Report an Issue">Report an Issue or Dispute</option>
                    <option value="Partnership / Community Hub">Partnership / Community Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-cream mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our community assist you?"
                    className="block w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-darkbg/90 border border-sand dark:border-darkborder focus:ring-2 focus:ring-olive-700 text-bark dark:text-cream"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream font-medium text-xs sm:text-sm transition shadow-sm"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
