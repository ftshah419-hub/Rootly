import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, MapPin, ShieldCheck, Sparkles, Scale, Heart, MessageSquare, 
  ExternalLink, Flag, Calendar, Award, AlertCircle, ShoppingBag, ArrowRight
} from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const ProduceQuickViewDrawer = ({ 
  product, 
  isOpen, 
  onClose,
  onOpenBuyModal,
  onOpenBarterModal,
  onOpenClaimModal,
  onOpenReportModal
}) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !product) return null;

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
  const growerInitial = growerName.charAt(0).toUpperCase();

  const handleMessageGrower = () => {
    onClose();
    if (grower._id || grower.id) {
      navigate(`/messages?recipient=${grower._id || grower.id}&product=${product._id || product.id}`);
    } else {
      navigate('/messages');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bark/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div className="w-screen max-w-md pointer-events-auto bg-warm-white dark:bg-darkcard border-l border-sand dark:border-sand/20 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-sand dark:border-sand/20 flex items-center justify-between bg-cream/50 dark:bg-bark/40">
            <span className="text-xs uppercase tracking-widest font-mono text-earth dark:text-sand/70">
              {t('produce.quickView', 'Hyperlocal Produce View')}
            </span>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full text-earth dark:text-sand hover:bg-sand/30 dark:hover:bg-sand/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-sand/20 aspect-video shadow-inner">
              <img 
                src={images[activeImageIndex]} 
                alt={product.title || product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {isBarter && (
                  <span className="bg-terracotta text-warm-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                    {t('common.barter', 'Barter')}
                  </span>
                )}
                {isFree && (
                  <span className="bg-sage text-bark text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {t('common.free', 'Free Surplus')}
                  </span>
                )}
                {isSell && (
                  <span className="bg-olive text-warm-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {t('common.buy', 'For Purchase')}
                  </span>
                )}
                {(product.isOrganic || product.organic) && (
                  <span className="bg-olive/90 text-warm-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-sand" />
                    {t('produce.pesticideFree', 'Pesticide Free')}
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        activeImageIndex === idx ? 'bg-warm-white w-6' : 'bg-warm-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Produce Header */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-serif font-bold text-bark dark:text-warm-white">
                  {product.title || product.name}
                </h2>
                <div className="text-right">
                  {isSell ? (
                    <div>
                      <span className="text-2xl font-bold font-serif text-olive dark:text-sage">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-earth dark:text-sand/70 block">
                        per {product.unit || 'kg'}
                      </span>
                    </div>
                  ) : isBarter ? (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-lg">
                      <Scale className="w-4 h-4" />
                      {t('barter.directTrade', 'Trade Only')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-sage bg-sage/20 px-2.5 py-1 rounded-lg">
                      <Heart className="w-4 h-4" />
                      {t('common.free', 'Free')}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity badge */}
              <div className="mt-2 flex items-center gap-2 text-sm text-earth dark:text-sand/80">
                <span className="font-medium text-bark dark:text-warm-white">
                  {t('produce.availableQuantity', 'Available')}:
                </span>
                <span>{product.quantity || product.availableQuantity || 1} {product.unit || 'kg'}</span>
                {product.status && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded bg-sand/30 dark:bg-sand/10 text-earth dark:text-sand uppercase font-mono">
                    {product.status}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-cream/40 dark:bg-bark/30 p-4 rounded-xl border border-sand/30 dark:border-sand/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-earth dark:text-sand/70 mb-1.5 font-mono">
                {t('produce.harvestNotes', 'Grower Notes & Harvest Story')}
              </h4>
              <p className="text-sm text-bark/90 dark:text-warm-white/90 leading-relaxed">
                {product.description || t('produce.noDescription', 'Fresh produce harvested with care in local backyard garden.')}
              </p>

              {/* Barter Preferences if Barter */}
              {isBarter && product.barterFor && (
                <div className="mt-3 pt-3 border-t border-sand/30 dark:border-sand/10">
                  <span className="text-xs font-semibold text-terracotta uppercase tracking-wide block mb-1">
                    {t('barter.desiredProduce', 'Desired in Exchange')}:
                  </span>
                  <p className="text-sm text-bark dark:text-warm-white font-medium">
                    {Array.isArray(product.barterFor) ? product.barterFor.join(', ') : product.barterFor}
                  </p>
                </div>
              )}
            </div>

            {/* Grower Snapshot */}
            <div className="border border-sand dark:border-sand/20 rounded-xl p-4 bg-warm-white dark:bg-darkcard/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-olive/10 dark:bg-sage/20 text-olive dark:text-sage font-serif font-bold text-lg flex items-center justify-center border border-olive/20">
                  {growerInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-bark dark:text-warm-white truncate">
                      {growerName}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-olive shrink-0" title="Verified Local Grower" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-earth dark:text-sand/70 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3.5 h-3.5 text-terracotta" />
                      {product.location?.address || grower.location?.address || t('common.nearbyLocality', 'Local Area')}
                    </span>
                    {product.distance !== undefined && (
                      <span className="font-mono text-olive dark:text-sage font-semibold">
                        ~{typeof product.distance === 'number' ? product.distance.toFixed(1) : product.distance} km
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {grower.bio && (
                <p className="mt-2.5 text-xs text-earth dark:text-sand/80 line-clamp-2">
                  "{grower.bio}"
                </p>
              )}
            </div>

            {/* Hyperlocal Pickup Safety Alert */}
            <div className="p-3 bg-sand/20 dark:bg-sand/5 rounded-xl border border-sand/40 dark:border-sand/10 text-xs text-earth dark:text-sand/80 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-olive shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-bark dark:text-warm-white">
                  {t('produce.porchBoxTitle', 'Secure Porch-Box Protocol')}:
                </strong>{' '}
                {t('produce.porchBoxDesc', 'Exact house coordinates and contact details are held securely until the exchange is confirmed by both community members.')}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-sand dark:border-sand/20 bg-cream/70 dark:bg-bark/60 space-y-2">
            <div className="flex gap-2">
              {isSell && (
                <button
                  onClick={() => { onClose(); onOpenBuyModal?.(product); }}
                  className="flex-1 bg-olive hover:bg-olive/90 text-warm-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {t('produce.buyNow', 'Request to Buy')}
                </button>
              )}
              {isBarter && (
                <button
                  onClick={() => { onClose(); onOpenBarterModal?.(product); }}
                  className="flex-1 bg-terracotta hover:bg-terracotta/90 text-warm-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Scale className="w-4 h-4" />
                  {t('produce.proposeTrade', 'Propose Trade')}
                </button>
              )}
              {isFree && (
                <button
                  onClick={() => { onClose(); onOpenClaimModal?.(product); }}
                  className="flex-1 bg-sage hover:bg-sage/90 text-bark font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Heart className="w-4 h-4" />
                  {t('produce.claimSurplus', 'Claim Free')}
                </button>
              )}

              <button
                onClick={handleMessageGrower}
                title={t('produce.messageGrower', 'Message Grower')}
                className="p-2.5 border border-sand dark:border-sand/30 hover:bg-sand/30 dark:hover:bg-sand/10 text-bark dark:text-warm-white rounded-xl transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-olive dark:text-sage" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <Link
                to={`/products/${product._id || product.id}`}
                onClick={onClose}
                className="text-olive dark:text-sage font-medium hover:underline inline-flex items-center gap-1"
              >
                {t('produce.viewFullPage', 'Full details & heritage notes')}
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              
              <button
                onClick={() => { onClose(); onOpenReportModal?.(product); }}
                className="text-earth/70 dark:text-sand/50 hover:text-terracotta flex items-center gap-1 transition-colors"
              >
                <Flag className="w-3 h-3" />
                {t('produce.reportListing', 'Report')}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProduceQuickViewDrawer;
