import React, { useState } from 'react';
import { X, Heart, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { exchangeService } from '../../../services/user/exchangeService';

const ClaimFreeModal = ({ product, isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const maxQty = product.quantity || product.availableQuantity || 5;
  const unit = product.unit || 'kg';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        productId: product._id || product.id,
        quantity: Number(quantity),
        type: 'FREE',
        notes: note
      };

      await exchangeService.createExchangeRequest(payload);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to claim free produce:', err);
      setError(err?.response?.data?.message || err.message || t('common.errorSubmitting', 'Failed to submit claim. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-bark/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl max-w-md w-full p-6 shadow-2xl z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand dark:border-sand/20 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sage/20 text-olive dark:text-sage flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
                {t('produce.claimFreeTitle', 'Claim Free Garden Surplus')}
              </h3>
              <p className="text-xs text-earth dark:text-sand/70">
                {product.title || product.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-earth dark:text-sand hover:bg-sand/30 dark:hover:bg-sand/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-olive dark:text-sage mx-auto animate-bounce" />
            <h4 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
              {t('produce.claimSuccess', 'Surplus Claim Submitted!')}
            </h4>
            <p className="text-sm text-earth dark:text-sand/80 max-w-xs mx-auto">
              {t('produce.claimSuccessDesc', 'The grower has received your note. Once accepted, coordinate your zero-waste porch pickup.')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quantity */}
            <div className="p-4 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/10">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-bark dark:text-warm-white block">
                    {t('produce.quantityNeeded', 'Portion to Claim')}
                  </label>
                  <span className="text-xs text-earth dark:text-sand/70">
                    Max {maxQty} {unit} available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={maxQty}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-20 text-center font-mono font-bold bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-lg py-1.5 text-bark dark:text-warm-white"
                  />
                  <span className="text-sm font-medium text-bark dark:text-warm-white">{unit}</span>
                </div>
              </div>
            </div>

            {/* Community Ethos Note */}
            <div className="p-3 bg-sage/10 dark:bg-sage/15 rounded-xl border border-sage/30 text-xs text-earth dark:text-sand/90 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-olive dark:text-sage shrink-0 mt-0.5" />
              <span>
                {t('produce.fairSharePledge', 'Community Pledge: Free produce is shared by neighbours to prevent food waste. Please take only what your household can consume fresh.')}
              </span>
            </div>

            {/* Message to Grower */}
            <div>
              <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                {t('produce.gratitudeNote', 'Gratitude note / Pickup availability')}
              </label>
              <textarea
                rows={2}
                required
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('produce.freeNotePlaceholder', 'e.g. Thank you for sharing! I can cycle over around 5 PM to pick it up.')}
                className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-3 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-earth dark:text-sand hover:text-bark dark:hover:text-warm-white transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-sage hover:bg-sage/90 text-bark text-sm font-semibold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? t('common.submitting', 'Claiming...') : t('produce.confirmClaim', 'Claim Free Surplus')}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ClaimFreeModal;
