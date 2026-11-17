import React, { useState } from 'react';
import { X, ShoppingBag, Calendar, Clock, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { exchangeService } from '../../../services/user/exchangeService';

const BuyModal = ({ product, isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('morning');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const maxQty = product.quantity || product.availableQuantity || 10;
  const unit = product.unit || 'kg';
  const unitPrice = Number(product.price) || 0;
  const totalPrice = (unitPrice * Number(quantity)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        productId: product._id || product.id,
        quantity: Number(quantity),
        type: 'BUY',
        notes: note,
        preferredSchedule: {
          date: pickupDate,
          timeSlot: pickupTimeSlot
        }
      };

      await exchangeService.createExchangeRequest(payload);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to submit purchase request:', err);
      setError(err?.response?.data?.message || err.message || t('common.errorSubmitting', 'Failed to place purchase request. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-bark/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand dark:border-sand/20 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-olive/10 dark:bg-olive/20 text-olive dark:text-sage flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
                {t('produce.buyNow', 'Request to Buy Produce')}
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
              {t('produce.requestSentSuccess', 'Purchase Request Dispatched!')}
            </h4>
            <p className="text-sm text-earth dark:text-sand/80 max-w-xs mx-auto">
              {t('produce.requestSentDesc', 'The grower has been notified. Check your Activity workspace once they accept.')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quantity Selector & Price Summary */}
            <div className="bg-cream/40 dark:bg-bark/30 p-4 rounded-xl border border-sand/40 dark:border-sand/10 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-bark dark:text-warm-white">
                  {t('produce.quantityToBuy', 'Quantity')} ({unit})
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-sand/30 dark:bg-sand/20 hover:bg-sand/50 text-bark dark:text-warm-white font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={maxQty}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-16 text-center font-mono font-bold bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-lg py-1 text-bark dark:text-warm-white"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                    className="w-8 h-8 rounded-lg bg-sand/30 dark:bg-sand/20 hover:bg-sand/50 text-bark dark:text-warm-white font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-earth dark:text-sand/70 pt-2 border-t border-sand/30 dark:border-sand/10">
                <span>{t('produce.unitPrice', 'Unit Price')}: ₹{unitPrice} / {unit}</span>
                <span className="text-sm font-bold text-olive dark:text-sage font-serif">
                  {t('common.total', 'Estimated Total')}: ₹{totalPrice}
                </span>
              </div>
            </div>

            {/* Preferred Pickup Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-terracotta" />
                  {t('produce.preferredDate', 'Preferred Pickup Date')}
                </label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-olive" />
                  {t('produce.timeSlot', 'Preferred Window')}
                </label>
                <select
                  value={pickupTimeSlot}
                  onChange={(e) => setPickupTimeSlot(e.target.value)}
                  className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                >
                  <option value="morning">Morning (8:00 AM - 11:00 AM)</option>
                  <option value="afternoon">Afternoon (1:00 PM - 4:00 PM)</option>
                  <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Note to Grower */}
            <div>
              <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                {t('produce.noteToGrower', 'Note to Grower (Optional)')}
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('produce.notePlaceholder', 'e.g. Bringing my own cloth bag; please let me know if porch pickup is okay.')}
                className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-3 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
              />
            </div>

            {/* Trust disclaimer */}
            <div className="flex items-start gap-2 p-3 bg-sand/20 dark:bg-sand/10 rounded-xl text-xs text-earth dark:text-sand/80">
              <ShieldCheck className="w-4 h-4 text-olive shrink-0 mt-0.5" />
              <span>
                {t('produce.paymentNote', 'Direct neighbourhood exchange: Payments or cash-on-pickup are completed directly with the grower during porch pickup or handover.')}
              </span>
            </div>

            {/* Submit */}
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
                className="px-6 py-2.5 bg-olive hover:bg-olive/90 text-warm-white text-sm font-medium rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? t('common.submitting', 'Submitting...') : t('produce.confirmBuy', 'Confirm Purchase Request')}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default BuyModal;
