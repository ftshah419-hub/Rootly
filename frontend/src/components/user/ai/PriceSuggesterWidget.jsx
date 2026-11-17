import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Sparkles, RefreshCw, Info } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { aiService } from '../../../services/user/aiService';

const PriceSuggesterWidget = ({ onSelectPrice }) => {
  const { t } = useTranslation();
  const [crop, setCrop] = useState('Tapioca');
  const [district, setDistrict] = useState('Ernakulam / Kochi');
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState(null);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await aiService.suggestFairPrice(crop, district);
      setPricing(res);
    } catch (err) {
      console.error('Pricing error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-sand/40 dark:border-sand/15 pb-4">
        <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
          <IndianRupee className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
            {t('ai.tool3Title', 'Tool 3: Fair-Price APMC Mandi Balancer')}
          </h3>
          <p className="text-xs text-earth dark:text-sand/70">
            {t('ai.tool3Subtitle', 'Recommends fair hyperlocal pricing balancing wholesale mandi floors and organic retail')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            Produce Name
          </label>
          <input
            type="text"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="e.g. Tomatoes, Tapioca, Red Spinach"
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            District / Agro-Zone
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          >
            <option value="Ernakulam / Kochi">Ernakulam / Kochi</option>
            <option value="Thiruvananthapuram">Thiruvananthapuram</option>
            <option value="Kozhikode">Kozhikode</option>
            <option value="Thrissur">Thrissur</option>
            <option value="Kottayam">Kottayam</option>
            <option value="Alappuzha">Alappuzha</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        disabled={loading || !crop}
        onClick={handleCalculate}
        className="w-full py-2.5 px-4 bg-olive hover:bg-olive/90 disabled:opacity-50 text-warm-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Scanning Regional Mandi Tickers...
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4 text-sand" />
            Calculate Fair Community Price
          </>
        )}
      </button>

      {pricing && (
        <div className="p-4 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/15 space-y-4 animate-fade-in">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-warm-white dark:bg-darkcard rounded-lg border border-sand/30">
              <span className="text-[10px] uppercase font-mono text-earth dark:text-sand/70 block">Mandi Floor</span>
              <span className="text-sm font-bold text-earth dark:text-sand">₹{pricing.mandiFloor}</span>
              <span className="text-[10px] text-earth/60 block">Wholesale</span>
            </div>

            <div className="p-2.5 bg-olive/10 dark:bg-olive/20 rounded-lg border border-olive/30 ring-1 ring-olive">
              <span className="text-[10px] uppercase font-mono text-olive dark:text-sage font-bold block">Community Fair</span>
              <span className="text-base font-bold font-serif text-olive dark:text-sage">₹{pricing.fairPrice}</span>
              <span className="text-[10px] text-olive/80 dark:text-sage/80 block">Recommended</span>
            </div>

            <div className="p-2.5 bg-warm-white dark:bg-darkcard rounded-lg border border-sand/30">
              <span className="text-[10px] uppercase font-mono text-earth dark:text-sand/70 block">Retail Organic</span>
              <span className="text-sm font-bold text-terracotta">₹{pricing.retailOrganicCeiling}</span>
              <span className="text-[10px] text-earth/60 block">Supermarket</span>
            </div>
          </div>

          <div className="text-xs text-earth dark:text-sand/80 bg-sand/15 dark:bg-sand/5 p-3 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-olive shrink-0 mt-0.5" />
            <div>
              <strong>Win-Win Balance:</strong> At ₹{pricing.fairPrice}/{pricing.unit || 'kg'}, you receive <span className="font-bold text-olive dark:text-sage">~35% more</span> than selling to middlemen, while your neighbour saves <span className="font-bold text-olive dark:text-sage">~40%</span> compared to retail store markup.
            </div>
          </div>

          {onSelectPrice && (
            <button
              onClick={() => onSelectPrice(pricing.fairPrice)}
              className="text-xs text-olive dark:text-sage font-semibold hover:underline block text-right pt-1"
            >
              Use this recommended price (₹{pricing.fairPrice}) in listing &rarr;
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default PriceSuggesterWidget;
