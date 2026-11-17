import React, { useState, useEffect } from 'react';
import { X, Scale, RefreshCw, AlertCircle, CheckCircle, Plus, Sparkles } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { exchangeService } from '../../../services/user/exchangeService';
import { productService } from '../../../services/user/productService';
import { barterService } from '../../../services/user/barterService';

const BarterModal = ({ product, isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [myListings, setMyListings] = useState([]);
  const [selectedMyProduct, setSelectedMyProduct] = useState('');
  const [customProduceName, setCustomProduceName] = useState('');
  const [customProduceQty, setCustomProduceQty] = useState(1);
  const [customProduceUnit, setCustomProduceUnit] = useState('kg');
  const [requestedQty, setRequestedQty] = useState(1);
  const [proposalNotes, setProposalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingListings, setFetchingListings] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [parityResult, setParityResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadMyGardenListings();
    }
  }, [isOpen]);

  const loadMyGardenListings = async () => {
    setFetchingListings(true);
    try {
      const res = await productService.getMyProducts();
      const items = res?.products || res?.data || (Array.isArray(res) ? res : []);
      setMyListings(items);
      if (items.length > 0) {
        setSelectedMyProduct(items[0]._id || items[0].id);
      }
    } catch (err) {
      console.warn('Could not fetch user garden listings:', err);
      // Fallback allows manual entry
    } finally {
      setFetchingListings(false);
    }
  };

  // Parity calculation check
  useEffect(() => {
    if (!product) return;
    const itemToTrade = selectedMyProduct 
      ? myListings.find(i => (i._id || i.id) === selectedMyProduct)?.title || 'Custom Crop'
      : customProduceName;

    if (itemToTrade) {
      const parity = barterService.calculateParityRatio(
        itemToTrade,
        product.title || product.name,
        selectedMyProduct ? 1 : Number(customProduceQty) || 1,
        Number(requestedQty) || 1
      );
      setParityResult(parity);
    } else {
      setParityResult(null);
    }
  }, [selectedMyProduct, customProduceName, customProduceQty, requestedQty, product, myListings]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        productId: product._id || product.id,
        quantity: Number(requestedQty),
        type: 'BARTER',
        notes: proposalNotes,
        offeredProductId: selectedMyProduct || undefined,
        offeredItemDetails: !selectedMyProduct ? {
          name: customProduceName,
          quantity: Number(customProduceQty),
          unit: customProduceUnit
        } : undefined
      };

      await exchangeService.createExchangeRequest(payload);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to submit barter proposal:', err);
      setError(err?.response?.data?.message || err.message || t('common.errorSubmitting', 'Failed to propose barter. Please try again.'));
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

      <div className="relative bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand dark:border-sand/20 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 dark:bg-terracotta/20 text-terracotta flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
                {t('barter.proposeTrade', 'Propose Barter Exchange')}
              </h3>
              <p className="text-xs text-earth dark:text-sand/70">
                Trading for: <span className="font-semibold">{product.title || product.name}</span>
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
            <CheckCircle className="w-12 h-12 text-terracotta mx-auto animate-bounce" />
            <h4 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
              {t('barter.proposalSentSuccess', 'Trade Proposal Sent!')}
            </h4>
            <p className="text-sm text-earth dark:text-sand/80 max-w-xs mx-auto">
              {t('barter.proposalSentDesc', 'The grower will review your offered produce and respond with acceptance or a counter-offer.')}
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

            {/* What you are asking for */}
            <div className="p-3 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/10">
              <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-2">
                {t('barter.requestedProduceQty', 'How much do you need?')} ({product.unit || 'kg'})
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={requestedQty}
                  onChange={(e) => setRequestedQty(Math.max(0.5, Number(e.target.value) || 1))}
                  className="w-24 text-center font-mono font-bold bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-lg py-1.5 text-bark dark:text-warm-white"
                />
                <span className="text-sm text-earth dark:text-sand/80">
                  of {product.title || product.name}
                </span>
              </div>
              {product.barterFor && (
                <div className="mt-2 text-xs text-terracotta font-medium">
                  {t('barter.desiredByGrower', 'Grower wants')}: {Array.isArray(product.barterFor) ? product.barterFor.join(', ') : product.barterFor}
                </div>
              )}
            </div>

            {/* What you are offering */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-bark dark:text-warm-white">
                  {t('barter.offeredCropTitle', 'What will you offer in exchange?')}
                </label>
                {myListings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedMyProduct(selectedMyProduct ? '' : myListings[0]?._id)}
                    className="text-xs text-olive dark:text-sage font-medium hover:underline"
                  >
                    {selectedMyProduct ? t('barter.typeCustom', 'Offer unlisted crop') : t('barter.pickMyListings', 'Pick from my garden')}
                  </button>
                )}
              </div>

              {selectedMyProduct ? (
                <div>
                  <select
                    value={selectedMyProduct}
                    onChange={(e) => setSelectedMyProduct(e.target.value)}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
                  >
                    {myListings.map((item) => (
                      <option key={item._id || item.id} value={item._id || item.id}>
                        {item.title || item.name} ({item.quantity} {item.unit || 'kg'} available)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    required={!selectedMyProduct}
                    placeholder={t('barter.customNamePlaceholder', 'Crop name (e.g. Country Eggs, Backyard Ginger, Lemongrass)')}
                    value={customProduceName}
                    onChange={(e) => setCustomProduceName(e.target.value)}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={customProduceQty}
                      onChange={(e) => setCustomProduceQty(Math.max(0.5, Number(e.target.value) || 1))}
                      placeholder="Qty"
                      className="text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
                    />
                    <select
                      value={customProduceUnit}
                      onChange={(e) => setCustomProduceUnit(e.target.value)}
                      className="text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
                    >
                      <option value="kg">kg</option>
                      <option value="g">grams</option>
                      <option value="bunches">bunches</option>
                      <option value="pieces">pieces</option>
                      <option value="basket">basket</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Smart Parity Insight */}
            {parityResult && (
              <div className="p-3 bg-terracotta/10 dark:bg-terracotta/15 rounded-xl border border-terracotta/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-terracotta">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('barter.fairParityIndex', 'Community Parity Score')}: {parityResult.ratio}</span>
                </div>
                <p className="text-bark/80 dark:text-warm-white/80">
                  {parityResult.fairness}
                </p>
              </div>
            )}

            {/* Proposal Notes */}
            <div>
              <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                {t('barter.exchangeNotes', 'Trade message / Pickup suggestion')}
              </label>
              <textarea
                rows={2}
                value={proposalNotes}
                onChange={(e) => setProposalNotes(e.target.value)}
                placeholder={t('barter.notesPlaceholder', 'e.g. Freshly picked this morning! Available for porch swap tomorrow evening.')}
                className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-3 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
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
                className="px-6 py-2.5 bg-terracotta hover:bg-terracotta/90 text-warm-white text-sm font-medium rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? t('common.submitting', 'Submitting...') : t('barter.sendProposal', 'Dispatch Trade Proposal')}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default BarterModal;
