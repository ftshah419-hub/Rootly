import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, Search, MapPin, ArrowRight, ShieldCheck, Heart, Sparkles, 
  Scale, Leaf, Calendar, ShoppingBag, Users, Globe2, Compass, CheckCircle2 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import ProduceGrid from '../../components/user/produce/ProduceGrid';
import ProduceQuickViewDrawer from '../../components/user/produce/ProduceQuickViewDrawer';
import BuyModal from '../../components/user/modals/BuyModal';
import BarterModal from '../../components/user/modals/BarterModal';
import ClaimFreeModal from '../../components/user/modals/ClaimFreeModal';
import ReportModal from '../../components/user/modals/ReportModal';
import HarvestTimeline from '../../components/user/harvest/HarvestTimeline';
import { useTranslation } from '../../hooks/user/useTranslation';
import { useGeolocation } from '../../hooks/user/useGeolocation';
import { productService } from '../../services/user/productService';
import { harvestService } from '../../services/user/harvestService';
import { userService } from '../../services/user/userService';

const HomePage = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { location, coordinates } = useGeolocation();

  const [products, setProducts] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [sustainability, setSustainability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'buy', 'barter', 'claim', 'report'

  useEffect(() => {
    loadHomeData();
  }, [coordinates]);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      // Fetch real products from backend
      const prodRes = await productService.getNearbyProducts(
        coordinates ? coordinates[0] : 9.9674,
        coordinates ? coordinates[1] : 76.2999,
        5000
      ).catch(() => productService.getProducts({ limit: 8 }));

      const prodItems = prodRes?.products || prodRes?.data || (Array.isArray(prodRes) ? prodRes : []);
      setProducts(prodItems);

      // Fetch real upcoming harvests from backend
      const harvestRes = await harvestService.getUpcomingHarvests(14).catch(() => []);
      const harvestItems = harvestRes?.harvests || harvestRes?.data || (Array.isArray(harvestRes) ? harvestRes : []);
      setHarvests(harvestItems);

      // Fetch sustainability counters
      const sustRes = await userService.getSustainabilityImpact().catch(() => null);
      setSustainability(sustRes);
    } catch (err) {
      console.warn('Home data loading fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'vegetables', name: 'Fresh Vegetables', icon: '🥕', count: 'Local & Organic' },
    { id: 'fruits', name: 'Backyard Fruits', icon: '🥭', count: 'Tree-Ripened' },
    { id: 'tubers', name: 'Tubers & Roots', icon: '🥔', count: 'Tapioca & Yams' },
    { id: 'greens', name: 'Herbs & Greens', icon: '🌿', count: 'Fresh Picked' },
    { id: 'seeds', name: 'Heirloom Seeds', icon: '🌱', count: 'Native Varieties' },
    { id: 'compost', name: 'Garden Compost', icon: '🍂', count: 'Bio-Organic' }
  ];

  return (
    <UserLayout>
      <div className="space-y-16 pb-16">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 bg-gradient-to-b from-cream/60 via-warm-white to-warm-white dark:from-bark/60 dark:via-darkcard dark:to-darkcard border-b border-sand/40 dark:border-sand/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Hyperlocal Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-olive/10 dark:bg-sage/15 border border-olive/20 text-xs font-medium text-olive dark:text-sage">
                  <Sprout className="w-4 h-4" />
                  <span>{t('home.heroPill', 'Hyperlocal Produce Exchange • 100% Homegrown, 0% Middlemen')}</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-bark dark:text-warm-white tracking-tight leading-[1.15]">
                  {t('home.heroTitle', 'Taste real soil, sunshine, and neighbourly goodwill.')}
                </h1>

                <p className="text-base sm:text-lg text-earth dark:text-sand/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                  {t('home.heroSubtitle', 'Discover organic backyard surplus, trade heirloom vegetables without money, and claim free harvest shares right in your neighbourhood.')}
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <Link
                    to="/explore"
                    className="px-6 py-3.5 bg-olive hover:bg-olive/90 text-warm-white font-medium text-sm rounded-xl shadow-md transition-all flex items-center gap-2 group active:scale-95"
                  >
                    <Search className="w-4 h-4" />
                    <span>{t('home.exploreProduceBtn', 'Explore Nearby Produce')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/create-listing"
                    className="px-6 py-3.5 bg-terracotta hover:bg-terracotta/90 text-warm-white font-medium text-sm rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Sprout className="w-4 h-4" />
                    <span>{t('home.shareProduceBtn', 'Share Garden Surplus')}</span>
                  </Link>

                  <Link
                    to="/map"
                    className="px-4 py-3.5 border border-sand dark:border-sand/30 hover:bg-sand/20 text-bark dark:text-warm-white font-medium text-sm rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-olive dark:text-sage" />
                    <span>{t('home.viewRadar', 'Map Radar')}</span>
                  </Link>
                </div>

                {/* Trust Points */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-earth dark:text-sand/80">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-olive shrink-0" />
                    <span>Zero Commercial Resellers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-terracotta shrink-0" />
                    <span>Fair Non-Cash Barter</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-sage shrink-0" />
                    <span>Zero Food Waste</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual Card / Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-sand dark:border-sand/20 bg-warm-white dark:bg-darkcard p-3">
                  <img
                    src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80"
                    alt="Homegrown harvest"
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-bark/80 backdrop-blur-md border border-warm-white/10 text-warm-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-sage font-bold">
                        Freshly Harvested Today
                      </span>
                      <span className="text-xs font-mono bg-olive px-2 py-0.5 rounded-full">
                        ~1.2 km away
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-warm-white">
                      Panampilly Terrace Greens & Native Bananas
                    </h4>
                    <p className="text-xs text-sand/80">
                      Pesticide-free homegrown produce, ready for porch-box exchange.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FEATURED CATEGORIES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-bark dark:text-warm-white">
                {t('home.browseCategories', 'Browse by Garden Harvest')}
              </h2>
              <p className="text-xs text-earth dark:text-sand/70">
                Fresh categories nurtured in local backyard soil and rooftop terrace containers
              </p>
            </div>
            <Link
              to="/explore"
              className="text-xs text-olive dark:text-sage font-medium hover:underline inline-flex items-center gap-1"
            >
              {t('common.viewAll', 'View All')} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.id}`}
                className="group p-4 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 hover:border-olive dark:hover:border-sage rounded-2xl shadow-sm hover:shadow-md transition-all text-center space-y-2"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-sand/20 dark:bg-sand/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-serif font-bold text-sm text-bark dark:text-warm-white group-hover:text-olive dark:group-hover:text-sage transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-earth dark:text-sand/70 block">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* NEARBY PRODUCE DISCOVERY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-bark dark:text-warm-white">
                  {t('home.nearbyProduceTitle', 'Nearby Homegrown Produce')}
                </h2>
              </div>
              <p className="text-xs text-earth dark:text-sand/70 mt-1">
                Currently available within your community radius. Real live listings from backyard growers.
              </p>
            </div>

            <Link
              to="/explore"
              className="px-4 py-2 bg-cream/70 dark:bg-bark/40 hover:bg-cream border border-sand dark:border-sand/30 rounded-xl text-xs font-semibold text-bark dark:text-warm-white transition-colors self-start sm:self-center"
            >
              {t('home.exploreMore', 'Browse All Listings')} &rarr;
            </Link>
          </div>

          {/* Produce Grid */}
          <ProduceGrid
            products={products}
            loading={loading}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        </section>

        {/* 14-DAY HARVEST RADAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HarvestTimeline
            harvests={harvests}
            onSelectHarvest={(h) => navigate(`/prebooking?harvestId=${h._id || h.id}`)}
          />
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-cream/40 dark:bg-bark/30 border border-sand/40 dark:border-sand/15 rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-olive dark:text-sage font-bold">
              Neighbourhood Exchange Protocol
            </span>
            <h2 className="text-3xl font-serif font-bold text-bark dark:text-warm-white">
              {t('home.howItWorksTitle', 'Simple, Trustworthy & Money-Optional')}
            </h2>
            <p className="text-xs text-earth dark:text-sand/70">
              Three easy steps to connect, trade fresh backyard harvests, and eliminate food waste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold text-base font-serif">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-bark dark:text-warm-white">
                Discover Hyperlocally
              </h3>
              <p className="text-xs text-earth dark:text-sand/80 leading-relaxed">
                Open the interactive map radar to view what is ripening in gardens and rooftop grow bags within a 5 km radius of your home.
              </p>
            </div>

            <div className="p-6 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center font-bold text-base font-serif">
                2
              </div>
              <h3 className="font-serif font-bold text-lg text-bark dark:text-warm-white">
                Swap, Buy or Claim Free
              </h3>
              <p className="text-xs text-earth dark:text-sand/80 leading-relaxed">
                Choose how you want to exchange: barter your own surplus with our parity calculator, buy at fair APMC prices, or claim community surplus.
              </p>
            </div>

            <div className="p-6 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-sage/20 text-olive dark:text-sage flex items-center justify-center font-bold text-base font-serif">
                3
              </div>
              <h3 className="font-serif font-bold text-lg text-bark dark:text-warm-white">
                Contactless Porch Handover
              </h3>
              <p className="text-xs text-earth dark:text-sand/80 leading-relaxed">
                Coordinate a convenient pickup window. Exact house locations stay private until acceptance, verified securely with a 4-digit PIN code.
              </p>
            </div>
          </div>
        </section>

        {/* 7 HARVEST AI TOOLS SPOTLIGHT BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-olive via-olive/90 to-earth rounded-3xl p-8 sm:p-12 text-warm-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-white/10 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-sand" />
                <span>Next-Gen Community Agro Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
                Empowered by 7 Hyperlocal Harvest AI Tools
              </h2>
              <p className="text-sm text-warm-white/80 leading-relaxed font-sans">
                From optical leaf pathology scans and spoken Malayalam voice listings, to fair APMC mandi price balancing and mutual barter matching graphs.
              </p>
              <Link
                to="/ai-studio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-warm-white text-olive hover:bg-cream text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                <span>Enter Harvest AI Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs w-full md:w-auto">
              <div className="p-3 bg-warm-white/10 rounded-xl backdrop-blur-sm border border-warm-white/10">
                <strong className="block text-sand font-mono">Tool 1: Optical Scanner</strong>
                <span className="text-[11px] text-warm-white/80">Ripeness & Quality Grader</span>
              </div>
              <div className="p-3 bg-warm-white/10 rounded-xl backdrop-blur-sm border border-warm-white/10">
                <strong className="block text-sand font-mono">Tool 2: Story Writer</strong>
                <span className="text-[11px] text-warm-white/80">Bilingual English + Malayalam</span>
              </div>
              <div className="p-3 bg-warm-white/10 rounded-xl backdrop-blur-sm border border-warm-white/10">
                <strong className="block text-sand font-mono">Tool 3: APMC Balancer</strong>
                <span className="text-[11px] text-warm-white/80">Fair Mandi Floor Index</span>
              </div>
              <div className="p-3 bg-warm-white/10 rounded-xl backdrop-blur-sm border border-warm-white/10">
                <strong className="block text-sand font-mono">Tool 6: Garden Doctor</strong>
                <span className="text-[11px] text-warm-white/80">Leaf Bio-Remedies</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* QUICK VIEW DRAWER */}
      <ProduceQuickViewDrawer
        product={selectedProduct}
        isOpen={Boolean(selectedProduct && !activeModal)}
        onClose={() => setSelectedProduct(null)}
        onOpenBuyModal={(p) => setActiveModal('buy')}
        onOpenBarterModal={(p) => setActiveModal('barter')}
        onOpenClaimModal={(p) => setActiveModal('claim')}
        onOpenReportModal={(p) => setActiveModal('report')}
      />

      {/* MODALS */}
      {activeModal === 'buy' && (
        <BuyModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            setSelectedProduct(null);
          }}
        />
      )}

      {activeModal === 'barter' && (
        <BarterModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            setSelectedProduct(null);
          }}
        />
      )}

      {activeModal === 'claim' && (
        <ClaimFreeModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            setSelectedProduct(null);
          }}
        />
      )}

      {activeModal === 'report' && (
        <ReportModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setActiveModal(null)}
        />
      )}
    </UserLayout>
  );
};

export default HomePage;
