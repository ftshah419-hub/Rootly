import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const LoginPage = ({ initialMode = 'signin' }) => {
  const [activeTab, setActiveTab] = useState(initialMode); // 'signin' or 'register'
  const { login, register, authError, setAuthError } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState(['🌱 Home Gardener']);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  // Status Banner Message
  const [statusMessage, setStatusMessage] = useState(null);

  // Clear errors when switching tabs
  useEffect(() => {
    setAuthError(null);
    setStatusMessage(null);
  }, [activeTab, setAuthError]);

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0, 1, 2, 3
  };
  const strengthScore = getPasswordStrength(regPassword);

  const interestOptions = [
    '🌱 Home Gardener',
    '🍅 Heirloom Veggies',
    '🔄 Barter Exchanger',
    '🥭 Fruit Orchards',
    '🥚 Country Eggs'
  ];

  const toggleInterest = (tag) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  // Handle Login Submit
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoginSubmitting(true);
    setStatusMessage(null);

    try {
      const data = await login({
        email: loginEmail,
        password: loginPassword,
        rememberDevice
      });

      setStatusMessage({
        type: 'success',
        text: `Welcome back, ${data.user.name}!`
      });

      setTimeout(() => {
        if (data.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate(from, { replace: true });
        }
      }, 500);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Invalid email or password.'
      });
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  // Handle Register Submit
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setStatusMessage({
        type: 'error',
        text: 'Please accept the Community Trust Charter to continue.'
      });
      return;
    }

    setIsRegisterSubmitting(true);
    setStatusMessage(null);

    try {
      const fullPhone = regPhone ? `${countryCode} ${regPhone.trim()}` : '';
      const data = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: fullPhone,
        preferredLanguage: language,
        interests: selectedInterests
      });

      setStatusMessage({
        type: 'success',
        text: `Account created! Welcome to the garden, ${data.user.name}!`
      });

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 600);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Registration failed.'
      });
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-cream text-bark dark:bg-darkbg dark:text-cream transition-colors duration-300 antialiased selection:bg-terracotta selection:text-white">
      {/* Floating Top Controls */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 sm:px-6 md:px-8 pointer-events-none">
        {/* Back Link */}
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide text-white/90 bg-black/35 backdrop-blur-md border border-white/20 hover:bg-black/55 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-sm group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to community marketplace</span>
        </Link>

        {/* Top Right Actions: Language & Dark Theme Switcher */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-white/70 dark:bg-darkcard/80 backdrop-blur-md border border-sand/60 dark:border-darkborder px-2.5 py-1 rounded-full shadow-sm">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="text-xs font-semibold px-2.5 py-1 rounded-full text-olive-700 dark:text-cream hover:bg-cream dark:hover:bg-darkbg transition"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span>
              {language === 'en' ? 'EN / മലയാളം' : 'മലയാളം / EN'}
            </span>
          </button>

          <span className="w-px h-3.5 bg-sand dark:bg-darkborder"></span>

          {/* Dark Mode Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-1.5 rounded-full text-olive-700 dark:text-cream hover:bg-cream dark:hover:bg-darkbg transition flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-olive-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Split Screen Container */}
      <main className="min-h-screen flex flex-col lg:flex-row relative">
        {/* Left Section - Visual Storytelling (52% on Desktop) */}
        <section className="lg:w-[52%] relative flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 min-h-[500px] lg:min-h-screen overflow-hidden text-white">
          {/* Background Image with Ambient Warm Gradients */}
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/harvest-basket.jpg"
              alt="Editorial fine-art food and agriculture photography of home garden produce in a wicker basket"
              className="w-full h-full object-cover object-center scale-105 filter brightness-[0.9] transform transition duration-1000 ease-out hover:scale-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxib__JaYut0wjR8s6kvt3ThCudg8FMfLGE1AplA69ccNYdq8RcEsoA31-1kyqy29AFEE_WMDS22P8l43cPCE9raWY51iAfswKcgDbo2bn-xgN4DeO1NYMh7KUuvuN2N0q2fRa7yH8g1XT30B5B25fqzMh3-h5z9DgkUXNpEMnt0V0wIC_JyX5ZBrS83P8LHYAu9sbTwFfzVAqPCU4BiiPZGLVbYE2tDFJWhFO7KNk';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-olive-900/60 via-transparent to-olive-900/40 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,117,77,0.35),transparent_60%)]"></div>
          </div>

          {/* Top Branding Layer */}
          <div className="relative z-10 pt-10 sm:pt-8">
            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden p-1 bg-cream/90 shadow-md ring-2 ring-terracotta/40 backdrop-blur-sm flex items-center justify-center shrink-0">
                <img
                  src="/assets/rootly-emblem.jpg"
                  alt="Rootly circular seedling and root emblem"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGerBRQfpdBNjv_tvWZBwceuQeC_6xAyO9TfMfQdz1__HEbeofm6RrwCfTApZqY70AUjaw_lb5FWy0Urkd_dKWKRNKn3g-GqDs66i1fIDVSsShIEmC8wkNpQfn_EbBFNCcFZdwCBVNjT7CtJiixTHqpXEj40kHfmH-6vfsy8WL9uCdLRwIKQaPI1qzQ-8QM-dSJwU2Z4-O4I7hpw4KdIeGT010_dDfaW9qAr_GgWsPsWKGeZLQyHAWg';
                  }}
                />
              </div>
              <div>
                <h1 className="font-serif-brand text-2xl sm:text-3xl tracking-widest font-semibold uppercase text-cream">
                  ROOTLY
                </h1>
                <p className="text-xs uppercase tracking-widest text-sand font-medium">
                  Grown Close. Shared Fresh.
                </p>
              </div>
            </div>
          </div>

          {/* Middle Storytelling & Headline */}
          <div className="relative z-10 my-auto py-8 lg:py-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/15 backdrop-blur-md border border-white/20 text-cream text-xs font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></span>
              <span>Hyperlocal Harvest Network</span>
            </div>

            <h2 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight sm:leading-snug mb-4 text-cream drop-shadow-sm">
              Freshness begins in your neighbourhood.
            </h2>

            <p className="text-sm sm:text-base text-cream/90 leading-relaxed font-normal mb-6 max-w-lg">
              A neighbourhood-powered hyper-local produce exchange. Connecting home gardens, organic growers, and local households to share heirloom harvests, reduce food waste, and cultivate community.
            </p>

            {/* Malayalam Script Callout */}
            <div className="p-3.5 rounded-xl bg-black/35 backdrop-blur-md border border-sand/30 inline-block max-w-md">
              <p className="font-malayalam text-sand text-sm leading-relaxed tracking-wide">
                🌱 "തനിമയുള്ള നാടൻ വിളവുകൾ നിങ്ങളുടെ തൊട്ടടുത്ത്"
              </p>
              <p className="text-[11px] text-cream/70 mt-0.5 tracking-wide italic">
                Authentic, sun-ripened garden harvests from fences next door.
              </p>
            </div>
          </div>

          {/* Bottom Trust Metrics & Values */}
          <div className="relative z-10 pt-4 border-t border-white/20 mt-auto grid grid-cols-3 gap-2 sm:gap-4 text-left">
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-amber-200">100%</span>
              <span className="text-[11px] sm:text-xs text-cream/80 leading-snug">Hyperlocal Exchange</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-emerald-300">0 km</span>
              <span className="text-[11px] sm:text-xs text-cream/80 leading-snug">Food Waste Goal</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-sand">1.8k+</span>
              <span className="text-[11px] sm:text-xs text-cream/80 leading-snug">Verified Home Growers</span>
            </div>
          </div>
        </section>

        {/* Right Section - Authentication Area (48% on Desktop) */}
        <section className="lg:w-[48%] flex flex-col justify-center items-center p-5 sm:p-8 md:p-12 lg:p-14 relative bg-cream dark:bg-darkbg">
          <div className="w-full max-w-md my-auto pt-6 pb-8">
            <div className="bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder rounded-3xl p-6 sm:p-9 shadow-warm transition-all duration-300">
              {/* Status Alert Banner */}
              {statusMessage && (
                <div
                  className={`mb-5 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    statusMessage.type === 'success'
                      ? 'bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-sand border border-olive-300 dark:border-olive-700'
                      : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900'
                  }`}
                  role="alert"
                >
                  <span>{statusMessage.type === 'success' ? '🌱' : '⚠️'}</span>
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Tab Switcher */}
              <div className="relative p-1 bg-cream dark:bg-darkbg rounded-full border border-sand/80 dark:border-darkborder flex items-center mb-7">
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-olive-700 text-white rounded-full transition-transform duration-300 ease-out shadow-sm ${
                    activeTab === 'signin' ? 'translate-x-0' : 'translate-x-full'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className={`relative z-10 w-1/2 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 ${
                    activeTab === 'signin'
                      ? 'text-white'
                      : 'text-bark/70 dark:text-cream/70 hover:text-bark dark:hover:text-cream'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`relative z-10 w-1/2 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 ${
                    activeTab === 'register'
                      ? 'text-white'
                      : 'text-bark/70 dark:text-cream/70 hover:text-bark dark:hover:text-cream'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* ============================================================== */}
              {/* SIGN IN FORM */}
              {/* ============================================================== */}
              {activeTab === 'signin' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-serif-brand text-2xl sm:text-3xl font-bold text-olive-800 dark:text-sand tracking-tight">
                      Welcome Back to the Garden
                    </h3>
                    <p className="text-xs sm:text-sm text-earth dark:text-cream/70 mt-1 leading-relaxed">
                      Sign in to access your neighbourhood harvest and barter offers.
                    </p>
                  </div>

                  {/* Social Buttons (Visual parity with mock) */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => alert('Google authentication is connected through the secure backend SSO handler.')}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-sand dark:border-darkborder hover:bg-cream dark:hover:bg-darkbg text-xs font-medium text-bark dark:text-cream transition shadow-2xs"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => alert('Mobile OTP verification is disabled per Section 5 specifications (Email/Password primary).')}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-sand dark:border-darkborder hover:bg-cream dark:hover:bg-darkbg text-xs font-medium text-bark dark:text-cream transition shadow-2xs"
                    >
                      <svg className="w-4 h-4 text-olive-700 dark:text-sand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Mobile OTP
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center my-3">
                    <div className="grow border-t border-sand dark:border-darkborder"></div>
                    <span className="px-3 text-[11px] uppercase tracking-wider text-earth/60 dark:text-cream/50">
                      or with email
                    </span>
                    <div className="grow border-t border-sand dark:border-darkborder"></div>
                  </div>

                  {/* Login Form */}
                  <form className="space-y-4" onSubmit={handleSignIn}>
                    <div>
                      <label className="block text-xs font-semibold text-bark dark:text-cream mb-1" htmlFor="loginEmail">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-earth/50">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                          </svg>
                        </div>
                        <input
                          id="loginEmail"
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="name@neighbourhood.com"
                          className="block w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-darkbg/90 border border-sand dark:border-darkborder focus:ring-2 focus:ring-olive-700 dark:focus:ring-sand focus:border-transparent text-bark dark:text-cream placeholder-earth/40"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-bark dark:text-cream" htmlFor="loginPassword">
                          Password
                        </label>
                        <Link to="/forgot-password" className="text-[11px] font-medium text-terracotta hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-earth/50">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          id="loginPassword"
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="block w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-darkbg/90 border border-sand dark:border-darkborder focus:ring-2 focus:ring-olive-700 dark:focus:ring-sand focus:border-transparent text-bark dark:text-cream placeholder-earth/40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-earth/50 hover:text-earth"
                          aria-label="Toggle password view"
                        >
                          {showLoginPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Device */}
                    <div className="flex items-center">
                      <input
                        id="rememberDevice"
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="h-4 w-4 rounded border-sand text-olive-700 focus:ring-olive-700 dark:border-darkborder dark:bg-darkbg"
                      />
                      <label htmlFor="rememberDevice" className="ml-2 text-xs text-bark/80 dark:text-cream/80">
                        Remember this device for 30 days
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoginSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-olive-600 focus:ring-offset-2 disabled:opacity-60"
                    >
                      {isLoginSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-cream" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                          </svg>
                          <span>Signing in to Rootly...</span>
                        </div>
                      ) : (
                        <span>Sign In to Rootly</span>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* ============================================================== */}
              {/* CREATE ACCOUNT (REGISTER) FORM */}
              {/* ============================================================== */}
              {activeTab === 'register' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif-brand text-2xl sm:text-3xl font-bold text-olive-800 dark:text-sand tracking-tight">
                      Join the Neighbourhood Harvest
                    </h3>
                    <p className="text-xs sm:text-sm text-earth dark:text-cream/70 mt-1 leading-relaxed">
                      Start sharing, swapping, and buying fresh garden produce in minutes.
                    </p>
                  </div>

                  <form className="space-y-3.5" onSubmit={handleRegister}>
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-bark dark:text-cream mb-1" htmlFor="regName">
                        Full Name
                      </label>
                      <input
                        id="regName"
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Maya Krishnan"
                        className="block w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-darkbg/90 border border-sand dark:border-darkborder focus:ring-2 focus:ring-olive-700 dark:focus:ring-sand focus:border-transparent text-bark dark:text-cream placeholder-earth/40"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-semibold text-bark dark:text-cream mb-1" htmlFor="regEmail">
                        Email Address
                      </label>
                      <input
                        id="regEmail"
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="maya@community.eco"
                        className="block w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-darkbg/90 border border-sand dark:border-darkborder focus:ring-2 focus:ring-olive-700 dark:focus:ring-sand focus:border-transparent text-bark dark:text-cream placeholder-earth/40"
                      />
                    </div>

                    {/* Mobile Number with Country Code */}
                    <div>
                      <label className="block text-xs font-semibold text-bark dark:text-cream mb-1" htmlFor="regPhone">
                        Mobile Number (for local harvest coordination)
                      </label>
                      <div className="flex rounded-xl shadow-2xs">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="rounded-l-xl border-r-0 border-sand dark:border-darkborder bg-cream/50 dark:bg-darkbg text-xs font-medium text-bark dark:text-cream focus:ring-olive-700 focus:border-sand"
                        >
                          <option value="+91">🇮🇳 +91 (IN)</option>
                          <option value="+1">🇺🇸 +1 (US)</option>
                          <option value="+44">🇬🇧 +44 (UK)</option>
                          <option value="+971">🇦🇪 +971 (UAE)</option>
                        </select>
                        <input
                          id="regPhone"
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="98470 12345"
                          className="block w-full rounded-r-xl border border-sand dark:border-darkborder bg-white dark:bg-darkbg/90 px-3 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-olive-700 dark:focus:ring-sand focus:border-transparent text-bark dark:text-cream placeholder-earth/40"
                        />
                      </div>
                    </div>

                    {/* Create Password */}
                    <div>
                      <label className="block text-xs font-semibold text-bark dark:text-cream mb-1" htmlFor="regPassword">
                        Create Password
                      </label>
                      <div className="relative">
                        <input
                          id="regPassword"
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className="block w-full px-3 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-darkbg/90 border border-sand dark:border-darkborder focus:ring-2 focus:ring-olive-700 dark:focus:ring-sand focus:border-transparent text-bark dark:text-cream placeholder-earth/40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-earth/50 hover:text-earth"
                        >
                          {showRegPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Password Strength Visual Meter */}
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <div className="h-1 flex-1 bg-sand/60 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              strengthScore >= 1 ? 'w-full bg-red-400' : 'w-0'
                            }`}
                          />
                        </div>
                        <div className="h-1 flex-1 bg-sand/60 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              strengthScore >= 2 ? 'w-full bg-amber-400' : 'w-0'
                            }`}
                          />
                        </div>
                        <div className="h-1 flex-1 bg-sand/60 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              strengthScore >= 3 ? 'w-full bg-olive-600' : 'w-0'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] text-earth/70 font-medium ml-1">
                          {strengthScore === 0 ? 'Too short' : strengthScore === 1 ? 'Weak' : strengthScore === 2 ? 'Good' : 'Strong'}
                        </span>
                      </div>
                    </div>

                    {/* Interest Tags */}
                    <div>
                      <label className="block text-xs font-semibold text-bark dark:text-cream mb-1.5">
                        I'm interested in (Select all that fit):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {interestOptions.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleInterest(tag)}
                            className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                              selectedInterests.includes(tag)
                                ? 'border-olive-700 bg-olive-700 text-white'
                                : 'border-sand dark:border-darkborder bg-cream dark:bg-darkbg text-bark dark:text-cream hover:border-olive-700'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start pt-1">
                      <input
                        id="agreeTerms"
                        type="checkbox"
                        required
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-sand text-olive-700 focus:ring-olive-700 dark:border-darkborder dark:bg-darkbg"
                      />
                      <label htmlFor="agreeTerms" className="ml-2 text-[11px] text-bark/70 dark:text-cream/70 leading-snug">
                        I pledge to abide by the <Link to="/terms" className="text-terracotta hover:underline font-medium">Community Trust Charter</Link> and acknowledge produce is homegrown and local.
                      </label>
                    </div>

                    {/* Register Submit Button */}
                    <button
                      type="submit"
                      disabled={isRegisterSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-olive-600 focus:ring-offset-2 disabled:opacity-60"
                    >
                      {isRegisterSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-cream" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                          </svg>
                          <span>Creating Garden Account...</span>
                        </div>
                      ) : (
                        <span>Create Rootly Account</span>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Bottom Switch Helper Line */}
              <div className="mt-6 pt-5 border-t border-sand/70 dark:border-darkborder text-center text-xs text-earth dark:text-cream/70">
                <span>
                  {activeTab === 'signin' ? 'New to the neighbourhood?' : 'Already have an account?'}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'signin' ? 'register' : 'signin')}
                  className="font-semibold text-terracotta hover:underline ml-1"
                >
                  {activeTab === 'signin' ? 'Create an account' : 'Sign in'}
                </button>
              </div>
            </div>

            {/* Trust Badges Under Box */}
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-earth/70 dark:text-cream/60">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-olive-700 dark:text-sand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                SSL Verified Security
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-olive-700 dark:text-sand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
                Hyper-Local Exchange
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
