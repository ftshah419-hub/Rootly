import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (password.length < 8) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await resetPassword(token, password, confirmPassword);
      setStatusMessage({
        type: 'success',
        text: res.message || 'Password updated successfully! Redirecting to sign in...'
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to reset password. Link may be expired.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-darkbg text-bark dark:text-cream flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-full overflow-hidden p-1 bg-cream-card ring-2 ring-terracotta/40 shadow-sm mx-auto flex items-center justify-center">
              <img
                src="/assets/rootly-emblem.jpg"
                alt="Rootly"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGerBRQfpdBNjv_tvWZBwceuQeC_6xAyO9TfMfQdz1__HEbeofm6RrwCfTApZqY70AUjaw_lb5FWy0Urkd_dKWKRNKn3g-GqDs66i1fIDVSsShIEmC8wkNpQfn_EbBFNCcFZdwCBVNjT7CtJiixTHqpXEj40kHfmH-6vfsy8WL9uCdLRwIKQaPI1qzQ-8QM-dSJwU2Z4-O4I7hpw4KdIeGT010_dDfaW9qAr_GgWsPsWKGeZLQyHAWg';
                }}
              />
            </div>
          </Link>
          <h2 className="font-serif-brand text-3xl font-bold text-olive-800 dark:text-sand mt-3">
            Choose New Password
          </h2>
          <p className="text-xs sm:text-sm text-earth dark:text-cream/70 mt-1">
            Create a secure, memorable password for your Rootly account.
          </p>
        </div>

        <div className="bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder rounded-3xl p-6 sm:p-8 shadow-warm">
          {statusMessage && (
            <div
              className={`mb-5 p-3 rounded-xl text-xs font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-sand border border-olive-300 dark:border-olive-700'
                  : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {!token ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-500 font-medium mb-3">
                No reset token found in URL.
              </p>
              <Link to="/forgot-password" className="text-xs font-semibold text-terracotta hover:underline">
                Request a new password reset link →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-bark dark:text-cream mb-1" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="block w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-darkbg/90 border border-sand dark:border-darkborder focus:ring-2 focus:ring-olive-700 dark:focus:ring-sand focus:border-transparent text-bark dark:text-cream placeholder-earth/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-bark dark:text-cream mb-1" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="block w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-darkbg/90 border border-sand dark:border-darkborder focus:ring-2 focus:ring-olive-700 dark:focus:ring-sand focus:border-transparent text-bark dark:text-cream placeholder-earth/40"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {isSubmitting ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-sand/70 dark:border-darkborder text-center text-xs text-earth dark:text-cream/70">
            <Link to="/login" className="font-semibold text-terracotta hover:underline">
              ← Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
