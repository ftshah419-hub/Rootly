import React, { useState } from 'react';
import { Sprout, Calendar, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { harvestService } from '../../../services/user/harvestService';

const RegisterCropForm = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [plantedDate, setPlantedDate] = useState('');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [expectedQuantity, setExpectedQuantity] = useState(5);
  const [unit, setUnit] = useState('kg');
  const [allowPrebooking, setAllowPrebooking] = useState(true);
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        cropName,
        variety,
        plantedDate: plantedDate || undefined,
        expectedHarvestDate,
        expectedQuantity: Number(expectedQuantity),
        unit,
        allowPrebooking,
        estimatedPrice: allowPrebooking && estimatedPrice ? Number(estimatedPrice) : undefined,
        notes
      };

      await harvestService.createHarvest(payload);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Failed to register crop:', err);
      setError(err?.response?.data?.message || err.message || t('common.errorSubmitting', 'Failed to log harvest crop.'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl shadow-sm space-y-3">
        <CheckCircle className="w-12 h-12 text-olive dark:text-sage mx-auto animate-bounce" />
        <h4 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
          {t('harvest.registeredSuccess', 'Crop Logged Successfully!')}
        </h4>
        <p className="text-xs text-earth dark:text-sand/80">
          Neighbours can now discover this upcoming harvest on the radar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-sand/40 dark:border-sand/15 pb-4">
        <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
          <Sprout className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
            {t('harvest.logCropTitle', 'Announce Upcoming Garden Harvest')}
          </h3>
          <p className="text-xs text-earth dark:text-sand/70">
            Keep neighbours informed about ripening crops and allow early community pre-booking
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            {t('harvest.cropName', 'Crop / Plant Name')} *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Nendran Bananas, Red Spinach, Tapioca"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            {t('harvest.variety', 'Variety / Heritage Cultivar')}
          </label>
          <input
            type="text"
            placeholder="e.g. Local Heirloom, Malabar Dwarf, Organic Native"
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            {t('harvest.plantedDate', 'Sowing / Planting Date (Optional)')}
          </label>
          <input
            type="date"
            value={plantedDate}
            onChange={(e) => setPlantedDate(e.target.value)}
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            {t('harvest.expectedDate', 'Expected Harvest Date')} *
          </label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={expectedHarvestDate}
            onChange={(e) => setExpectedHarvestDate(e.target.value)}
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            {t('harvest.expectedYield', 'Estimated Yield')} *
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0.5"
              step="0.5"
              required
              value={expectedQuantity}
              onChange={(e) => setExpectedQuantity(e.target.value)}
              className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white"
            >
              <option value="kg">kg</option>
              <option value="bunches">bunches</option>
              <option value="pieces">pieces</option>
              <option value="baskets">baskets</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            {t('harvest.estimatedPriceLabel', 'Estimated Pre-Order Price (₹)')}
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 50 (leave empty for barter/free)"
            value={estimatedPrice}
            onChange={(e) => setEstimatedPrice(e.target.value)}
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          />
        </div>
      </div>

      {/* Prebooking Toggle */}
      <label className="flex items-center gap-3 p-3 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/10 cursor-pointer">
        <input
          type="checkbox"
          checked={allowPrebooking}
          onChange={(e) => setAllowPrebooking(e.target.checked)}
          className="rounded text-olive focus:ring-olive w-4 h-4"
        />
        <div className="text-xs">
          <span className="font-semibold text-bark dark:text-warm-white block">
            {t('harvest.allowPrebooking', 'Enable Community Pre-booking')}
          </span>
          <span className="text-earth dark:text-sand/70">
            Allow neighbours to reserve fresh harvest portions before picking date.
          </span>
        </div>
      </label>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
          {t('harvest.gardenNotes', 'Growing Practices / Natural Care Notes')}
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Grown using homemade Jeevamrutham compost, no chemical sprays, hand-watered."
          className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-3 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-earth dark:text-sand hover:text-bark dark:hover:text-warm-white transition-colors"
          >
            {t('common.cancel', 'Cancel')}
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-olive hover:bg-olive/90 text-warm-white text-sm font-medium rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? t('common.submitting', 'Logging...') : t('harvest.publishCrop', 'Announce Crop Harvest')}
        </button>
      </div>
    </form>
  );
};

export default RegisterCropForm;
