import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, ShieldCheck, Sparkles, Scale, Heart, MessageSquare, 
  Flag, Calendar, Award, ShoppingBag, ArrowLeft, Share2, Check, AlertCircle 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import BuyModal from '../../components/user/modals/BuyModal';
import BarterModal from '../../components/user/modals/BarterModal';
import ClaimFreeModal from '../../components/user/modals/ClaimFreeModal';
import ReportModal from '../../components/user/modals/ReportModal';
import ProduceGrid from '../../components/user/produce/ProduceGrid';
import { useTranslation } from '../../hooks/user/useTranslation';
import { productService } from '../../services/user/productService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    loadProductDetail();
  }, [id]);

  const loadProductDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getProductById(id);
      const item = res?.product || res?.data || res;
      setProduct(item);

      // Load related items in the same category
      if (item?.category) {
        const catRes = await productService.getProducts({ 
          category: typeof item.category === 'object' ? item.category._id || item.category.name : item.category,
          limit: 4 
        }).catch(() => null);
        const related = (catRes?.products || catRes?.data || []).filter(p => (p._id || p.id) !== id);
        setRelatedProducts(related);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(err?.response?.data?.message || 'Produce listing not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleMessageGrower = () => {
    const grower = product.seller || product.user || {};
    if (grower._id || grower.id) {
      navigate(`/messages?recipient=${grower._id || grower.id}&product=${product._id || product.id}`);
    } else {
      navigate('/messages');
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
          <div className="h-6 w-32 bg-sand/30 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-96 bg-sand/20 rounded-3xl" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-10 bg-sand/30 rounded w-3/4" />
              <div className="h-6 bg-sand/20 rounded w-1/3" />
              <div className="h-28 bg-sand/20 rounded" />
              <div className="h-12 bg-sand/30 rounded" />
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error || !product) {
    return (
      <UserLayout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-terracotta mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-bark dark:text-warm-white">
            Produce Listing Unavailable
          </h2>
          <p className="text-sm text-earth dark:text-sand/70">
            {error || 'This listing may have been harvested, claimed, or removed by the grower.'}
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-olive text-warm-white rounded-xl text-xs font-semibold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Explore Produce
          </Link>
        </div>
      </UserLayout>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : ['https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80'];

  const isBarter = product.listingType === 'BARTER' || product.type === 'BARTER';
  const isFree = product.listingType === 'FREE' || product.type === 'FREE';
  const isSell = !isBarter && !isFree;

  const grower = product.seller || product.user || {};
  const growerName = grower.name || grower.gardenName || t('common.anonymousGrower', 'Community Grower');

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-medium text-earth dark:text-sand hover:text-bark dark:hover:text-warm-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl text-xs text-earth dark:text-sand hover:text-bark transition-colors"
          >
            {linkCopied ? <Check className="w-3.5 h-3.5 text-olive" /> : <Share2 className="w-3.5 h-3.5" />}
            {linkCopied ? 'Link Copied!' : 'Share Listing'}
          </button>
        </div>

        {/* Main Grid: Gallery & Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Photos Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-sand/20 aspect-video shadow-lg border border-sand dark:border-sand/20">
              <img
                src={images[activeImageIndex]}
                alt={product.title || product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {isBarter && (
                  <span className="bg-terracotta text-warm-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    Barter Exchange
                  </span>
                )}
                {isFree && (
                  <span className="bg-sage text-bark text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    Free Surplus
                  </span>
                )}
                {isSell && (
                  <span className="bg-olive text-warm-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    For Purchase
                  </span>
                )}
                {(product.isOrganic || product.organic) && (
                  <span className="bg-olive/90 text-warm-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-sand" />
                    Pesticide Free
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-olive shadow-md scale-105' : 'border-sand opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-earth dark:text-sand/70 uppercase">
                <span>{product.category?.name || product.category || 'Produce'}</span>
                <span>•</span>
                <span>Listed recently</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-bark dark:text-warm-white mt-1">
                {product.title || product.name}
              </h1>

              {/* Price / Trade Heading */}
              <div className="mt-3 flex items-baseline gap-2">
                {isSell ? (
                  <>
                    <span className="text-3xl font-serif font-bold text-olive dark:text-sage">
                      ₹{product.price}
                    </span>
                    <span className="text-xs text-earth dark:text-sand/70">
                      per {product.unit || 'kg'}
                    </span>
                  </>
                ) : isBarter ? (
                  <span className="inline-flex items-center gap-1.5 text-base font-semibold text-terracotta bg-terracotta/10 px-3 py-1 rounded-xl">
                    <Scale className="w-4 h-4" />
                    Direct Barter Trade
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-base font-semibold text-sage bg-sage/20 px-3 py-1 rounded-xl">
                    <Heart className="w-4 h-4" />
                    Free Community Sharing
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Available */}
            <div className="p-3.5 bg-cream/40 dark:bg-bark/30 rounded-2xl border border-sand/40 dark:border-sand/15 flex items-center justify-between text-xs">
              <span className="text-earth dark:text-sand/70">Quantity in garden:</span>
              <span className="font-mono font-bold text-bark dark:text-warm-white text-sm">
                {product.quantity || product.availableQuantity || 1} {product.unit || 'kg'} available
              </span>
            </div>

            {/* Grower Story / Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-earth dark:text-sand/70 font-mono">
                Grower Harvest Story
              </h3>
              <p className="text-sm text-bark/90 dark:text-warm-white/90 leading-relaxed font-sans bg-warm-white dark:bg-darkcard p-4 rounded-2xl border border-sand dark:border-sand/20">
                {product.description || 'Harvested fresh from backyard garden. Nurtured with natural sunlight and compost.'}
              </p>

              {/* Desired barter items */}
              {isBarter && product.barterFor && (
                <div className="p-3.5 bg-terracotta/10 rounded-xl border border-terracotta/30 text-xs">
                  <span className="font-semibold text-terracotta block mb-1">
                    Grower's Desired Produce in Exchange:
                  </span>
                  <p className="text-bark dark:text-warm-white font-medium">
                    {Array.isArray(product.barterFor) ? product.barterFor.join(', ') : product.barterFor}
                  </p>
                </div>
              )}
            </div>

            {/* Grower Trust Card */}
            <div className="p-4 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-olive/15 text-olive dark:text-sage font-serif font-bold text-lg flex items-center justify-center border border-olive/20 shrink-0">
                  {growerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-sm text-bark dark:text-warm-white">
                      {growerName}
                    </h4>
                    <ShieldCheck className="w-4 h-4 text-olive" title="Verified Backyard Grower" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-earth dark:text-sand/70 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-terracotta" />
                      {product.location?.address || grower.location?.address || 'Hyperlocal Neighbourhood'}
                    </span>
                  </div>
                </div>
              </div>

              {grower.bio && (
                <p className="text-xs text-earth dark:text-sand/80 italic">
                  "{grower.bio}"
                </p>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                {isSell && (
                  <button
                    onClick={() => setActiveModal('buy')}
                    className="flex-1 py-3 px-6 bg-olive hover:bg-olive/90 text-warm-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Request to Buy Produce
                  </button>
                )}
                {isBarter && (
                  <button
                    onClick={() => setActiveModal('barter')}
                    className="flex-1 py-3 px-6 bg-terracotta hover:bg-terracotta/90 text-warm-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Scale className="w-4 h-4" />
                    Propose Barter Trade
                  </button>
                )}
                {isFree && (
                  <button
                    onClick={() => setActiveModal('claim')}
                    className="flex-1 py-3 px-6 bg-sage hover:bg-sage/90 text-bark font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Heart className="w-4 h-4" />
                    Claim Free Surplus
                  </button>
                )}

                <button
                  onClick={handleMessageGrower}
                  title="Message Grower"
                  className="p-3 border border-sand dark:border-sand/30 hover:bg-sand/30 text-bark dark:text-warm-white rounded-xl transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-olive dark:text-sage" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-earth/70 dark:text-sand/60">
                  Protected by Porch-Box Security Protocol
                </span>
                <button
                  onClick={() => setActiveModal('report')}
                  className="text-earth/60 dark:text-sand/50 hover:text-terracotta flex items-center gap-1 transition-colors"
                >
                  <Flag className="w-3 h-3" />
                  Report Listing
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* RELATED PRODUCE SECTION */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-sand/40 dark:border-sand/15 space-y-6">
            <h3 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
              More Fresh Produce in this Category
            </h3>
            <ProduceGrid
              products={relatedProducts}
              loading={false}
              onSelectProduct={(p) => navigate(`/products/${p._id || p.id}`)}
            />
          </div>
        )}

      </div>

      {/* MODALS */}
      {activeModal === 'buy' && (
        <BuyModal
          product={product}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'barter' && (
        <BarterModal
          product={product}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'claim' && (
        <ClaimFreeModal
          product={product}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'report' && (
        <ReportModal
          product={product}
          isOpen={true}
          onClose={() => setActiveModal(null)}
        />
      )}
    </UserLayout>
  );
};

export default ProductDetailPage;
