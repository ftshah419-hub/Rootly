import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, MapPin, Grid, List, Map as MapIcon, 
  X, RefreshCw, Sprout, ArrowUpDown 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import ProduceGrid from '../../components/user/produce/ProduceGrid';
import ProduceFilterDrawer from '../../components/user/produce/ProduceFilterDrawer';
import ProduceQuickViewDrawer from '../../components/user/produce/ProduceQuickViewDrawer';
import BuyModal from '../../components/user/modals/BuyModal';
import BarterModal from '../../components/user/modals/BarterModal';
import ClaimFreeModal from '../../components/user/modals/ClaimFreeModal';
import ReportModal from '../../components/user/modals/ReportModal';
import { useTranslation } from '../../hooks/user/useTranslation';
import { useGeolocation } from '../../hooks/user/useGeolocation';
import { useDebounce } from '../../hooks/user/useDebounce';
import { productService } from '../../services/user/productService';

const ExplorePage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { coordinates } = useGeolocation();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    radius: 5,
    maxPrice: 500,
    organicOnly: false,
    sortBy: 'newest'
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [debouncedSearch, filters, coordinates]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        q: debouncedSearch || undefined,
        category: filters.category || undefined,
        type: filters.type || undefined,
        isOrganic: filters.organicOnly || undefined,
        maxPrice: filters.maxPrice || undefined,
        sort: filters.sortBy || 'newest',
        lat: coordinates ? coordinates[0] : undefined,
        lng: coordinates ? coordinates[1] : undefined,
        radius: filters.radius * 1000
      };

      const res = await productService.getProducts(params);
      const items = res?.products || res?.data || (Array.isArray(res) ? res : []);
      setProducts(items);
    } catch (err) {
      console.warn('Failed to load explore products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const exchangeTypes = [
    { id: '', label: 'All Modes' },
    { id: 'SELL', label: 'Buy' },
    { id: 'BARTER', label: 'Barter Trade' },
    { id: 'FREE', label: 'Free Surplus' }
  ];

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/40 dark:border-sand/15 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-bark dark:text-warm-white">
              {t('explore.title', 'Explore Nearby Produce')}
            </h1>
            <p className="text-xs text-earth dark:text-sand/70 mt-1">
              {t('explore.subtitle', 'Browse pesticide-free crops, backyard harvests, and surplus within community reach')}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('explore.searchPlaceholder', 'Search bananas, tomatoes, honey...')}
              className="w-full text-xs bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl pl-9 pr-8 py-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive shadow-sm"
            />
            <Search className="w-4 h-4 text-earth/60 dark:text-sand/60 absolute left-3 top-3" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 p-0.5 rounded-full text-earth hover:bg-sand/30"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters and Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Exchange Type Pills */}
          <div className="flex bg-sand/30 dark:bg-sand/10 p-1 rounded-xl text-xs font-medium overflow-x-auto no-scrollbar">
            {exchangeTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFilters(prev => ({ ...prev, type: type.id }))}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  filters.type === type.id
                    ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold'
                    : 'text-earth dark:text-sand hover:text-bark dark:hover:text-warm-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs text-earth dark:text-sand">
              <ArrowUpDown className="w-3.5 h-3.5 text-olive shrink-0" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-2.5 py-1.5 text-xs text-bark dark:text-warm-white focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="nearest">Nearest (~km)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Filter Drawer Trigger */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 hover:border-olive rounded-xl text-xs font-medium text-bark dark:text-warm-white shadow-sm transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta" />
              <span>{t('explore.filters', 'Filters')}</span>
              {(filters.category || filters.organicOnly || filters.radius !== 5) && (
                <span className="w-2 h-2 rounded-full bg-terracotta" />
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Tag Pills */}
        {(filters.category || filters.organicOnly || filters.type) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-earth/70 dark:text-sand/60">Active:</span>
            {filters.type && (
              <span className="px-2.5 py-1 rounded-full bg-olive/10 text-olive dark:text-sage font-medium flex items-center gap-1">
                Type: {filters.type}
                <button onClick={() => setFilters(prev => ({ ...prev, type: '' }))}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filters.category && (
              <span className="px-2.5 py-1 rounded-full bg-terracotta/10 text-terracotta font-medium flex items-center gap-1">
                Category: {filters.category}
                <button onClick={() => setFilters(prev => ({ ...prev, category: '' }))}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filters.organicOnly && (
              <span className="px-2.5 py-1 rounded-full bg-sage/20 text-bark font-medium flex items-center gap-1">
                Organic Only
                <button onClick={() => setFilters(prev => ({ ...prev, organicOnly: false }))}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={() => setFilters({
                category: '',
                type: '',
                radius: 5,
                maxPrice: 500,
                organicOnly: false,
                sortBy: 'newest'
              })}
              className="text-earth dark:text-sand/80 hover:underline text-xs"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Stream */}
        <ProduceGrid
          products={products}
          loading={loading}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

      </div>

      {/* FILTER DRAWER */}
      <ProduceFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(newF) => setFilters(newF)}
      />

      {/* QUICK VIEW DRAWER */}
      <ProduceQuickViewDrawer
        product={selectedProduct}
        isOpen={Boolean(selectedProduct && !activeModal)}
        onClose={() => setSelectedProduct(null)}
        onOpenBuyModal={() => setActiveModal('buy')}
        onOpenBarterModal={() => setActiveModal('barter')}
        onOpenClaimModal={() => setActiveModal('claim')}
        onOpenReportModal={() => setActiveModal('report')}
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

export default ExplorePage;
