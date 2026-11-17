import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scale, ArrowRightLeft, Sparkles, Plus, ShieldCheck, Heart, 
  RefreshCw, Info, HelpCircle, BookOpen 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import BarterDeckCard from '../../components/user/barter/BarterDeckCard';
import ParityCalculatorWidget from '../../components/user/barter/ParityCalculatorWidget';
import ProduceGrid from '../../components/user/produce/ProduceGrid';
import ProduceQuickViewDrawer from '../../components/user/produce/ProduceQuickViewDrawer';
import BarterModal from '../../components/user/modals/BarterModal';
import { useTranslation } from '../../hooks/user/useTranslation';
import { barterService } from '../../services/user/barterService';
import { exchangeService } from '../../services/user/exchangeService';
import { productService } from '../../services/user/productService';

const BarterExchangePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeExchanges, setActiveExchanges] = useState([]);
  const [barterProducts, setBarterProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBarterModalOpen, setIsBarterModalOpen] = useState(false);

  useEffect(() => {
    loadBarterBoard();
  }, []);

  const loadBarterBoard = async () => {
    setLoading(true);
    try {
      // 1. Fetch trade proposals
      const exRes = await exchangeService.getExchangeRequests({ type: 'BARTER' }).catch(() => []);
      const exList = exRes?.requests || exRes?.data || (Array.isArray(exRes) ? exRes : []);
      setActiveExchanges(exList);

      // 2. Fetch available barter produce
      const prodRes = await productService.getProducts({ type: 'BARTER', limit: 8 }).catch(() => []);
      const prodList = prodRes?.products || prodRes?.data || (Array.isArray(prodRes) ? prodRes : []);
      setBarterProducts(prodList);
    } catch (err) {
      console.warn('Barter board fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTrade = async (exchange) => {
    try {
      await exchangeService.updateExchangeStatus(exchange._id || exchange.id, 'ACCEPTED');
      loadBarterBoard();
    } catch (err) {
      alert('Failed to accept barter trade.');
    }
  };

  const handleRejectTrade = async (exchange) => {
    try {
      await exchangeService.updateExchangeStatus(exchange._id || exchange.id, 'REJECTED');
      loadBarterBoard();
    } catch (err) {
      alert('Failed to decline barter trade.');
    }
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-terracotta via-terracotta/90 to-earth rounded-3xl p-8 sm:p-12 text-warm-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-white/10 text-xs font-mono font-semibold">
              <Scale className="w-3.5 h-3.5 text-sand" />
              <span>Direct Money-Optional Economy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              {t('barter.title', 'Hyperlocal Produce Barter Exchange')}
            </h1>
            <p className="text-xs sm:text-sm text-warm-white/80 leading-relaxed font-sans">
              Trade surplus garden crops directly with neighbours. No currency, no middleman commissions — simply fair reciprocal harvest sharing.
            </p>
          </div>

          <Link
            to="/create-listing"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-warm-white text-terracotta hover:bg-cream text-xs font-bold rounded-xl shadow-lg transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>List Crop for Barter</span>
          </Link>
        </div>

        {/* 2-Column: Active Negotiations & Parity Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Trades Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-sand/40 dark:border-sand/15 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-terracotta" />
                <h2 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
                  Active Trade Negotiations
                </h2>
              </div>
              <span className="text-xs font-mono text-earth dark:text-sand/70">
                {activeExchanges.length} Proposals
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(n => (
                  <div key={n} className="h-32 bg-sand/20 dark:bg-sand/10 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : activeExchanges.length === 0 ? (
              <div className="p-8 text-center bg-cream/30 dark:bg-bark/20 rounded-2xl border border-dashed border-sand dark:border-sand/20 space-y-2">
                <Scale className="w-10 h-10 text-terracotta/40 mx-auto" />
                <h4 className="text-sm font-serif font-semibold text-bark dark:text-warm-white">
                  No Active Barter Proposals Pending
                </h4>
                <p className="text-xs text-earth dark:text-sand/70 max-w-sm mx-auto">
                  Browse the barter produce below and propose a swap with crops from your own garden plot.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeExchanges.map((ex) => (
                  <BarterDeckCard
                    key={ex._id || ex.id}
                    exchange={ex}
                    onAccept={handleAcceptTrade}
                    onReject={handleRejectTrade}
                    onChat={(trade) => {
                      const other = trade.requester || trade.seller || {};
                      navigate(`/messages?recipient=${other._id || other.id}&product=${trade.product?._id || trade.product}`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Parity Calculator Widget Column */}
          <div className="lg:col-span-5 space-y-6">
            <ParityCalculatorWidget />

            {/* 4 Golden Rules Covenant */}
            <div className="p-5 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-bark dark:text-warm-white">
                <BookOpen className="w-4 h-4 text-olive" />
                <span>The 4 Golden Rules of Hyperlocal Barter</span>
              </div>
              <ul className="space-y-2 text-earth dark:text-sand/80 leading-relaxed list-disc pl-4">
                <li><strong>Freshness Equality:</strong> Trade produce picked within 24-48 hours.</li>
                <li><strong>Neighbourly Flexibility:</strong> Respect harvest effort over strict rupee equivalency.</li>
                <li><strong>Honest Portions:</strong> Confirm weight or count honestly before porch drop.</li>
                <li><strong>Clean Containers:</strong> Use reusable cloth bags or return wicker baskets promptly.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Community Produce Available for Barter */}
        <div className="space-y-6 pt-6 border-t border-sand/40 dark:border-sand/15">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-bark dark:text-warm-white">
                Available Crops for Trade
              </h2>
              <p className="text-xs text-earth dark:text-sand/70">
                Backyard produce listed specifically for non-cash barter
              </p>
            </div>
            <Link
              to="/explore?type=BARTER"
              className="text-xs text-olive dark:text-sage font-medium hover:underline"
            >
              Browse All Barter Listings &rarr;
            </Link>
          </div>

          <ProduceGrid
            products={barterProducts}
            loading={loading}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        </div>

      </div>

      {/* QUICK VIEW DRAWER */}
      <ProduceQuickViewDrawer
        product={selectedProduct}
        isOpen={Boolean(selectedProduct && !isBarterModalOpen)}
        onClose={() => setSelectedProduct(null)}
        onOpenBarterModal={(p) => setIsBarterModalOpen(true)}
      />

      {/* BARTER MODAL */}
      {isBarterModalOpen && (
        <BarterModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setIsBarterModalOpen(false)}
          onSuccess={() => {
            setIsBarterModalOpen(false);
            setSelectedProduct(null);
            loadBarterBoard();
          }}
        />
      )}
    </UserLayout>
  );
};

export default BarterExchangePage;
