import React, { useState } from 'react';
import { LineChart, Sparkles, TrendingUp, CloudRain, Sun, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { aiService } from '../../../services/user/aiService';

const YieldPredictorWidget = () => {
  const { t } = useTranslation();
  const [crop, setCrop] = useState('Tapioca');
  const [scale, setScale] = useState('10 Grow Bags (Terrace)');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await aiService.predictHarvestYield(crop, scale);
      setPrediction(res);
    } catch (err) {
      console.error('Yield prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-sand/40 dark:border-sand/15 pb-4">
        <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
          <LineChart className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
            {t('ai.tool7Title', 'Tool 7: Microclimate Yield Predictor & Monsoon Bell Curve')}
          </h3>
          <p className="text-xs text-earth dark:text-sand/70">
            {t('ai.tool7Subtitle', 'Statistical harvest forecast based on regional precipitation patterns and terrace soil volume')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            Crop
          </label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          >
            <option value="Tapioca">Tapioca (Maracheeni)</option>
            <option value="Nendran Bananas">Nendran Bananas</option>
            <option value="Red Amaranth Spinach">Red Amaranth Spinach</option>
            <option value="Green Chilies">Green Chilies</option>
            <option value="Snake Gourd">Snake Gourd (Padavalanga)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            Plot Size / Setup
          </label>
          <select
            value={scale}
            onChange={(e) => setScale(e.target.value)}
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          >
            <option value="5-10 Grow Bags">5-10 Grow Bags (Rooftop)</option>
            <option value="20 Grow Bags">20 Grow Bags (Terrace Garden)</option>
            <option value="1 Cent Backyard Plot">1 Cent Backyard Plot (~435 sq ft)</option>
            <option value="3 Cents Homestead">3 Cents Homestead Plot</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handlePredict}
        className="w-full py-2.5 px-4 bg-olive hover:bg-olive/90 disabled:opacity-50 text-warm-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Computing Regional Rainfall & Yield Curve...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-sand" />
            Generate Yield Probability Forecast
          </>
        )}
      </button>

      {prediction && (
        <div className="p-4 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/15 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-sand/30 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-earth/80 dark:text-sand/70">Estimated Harvest Weight</span>
              <div className="text-xl font-serif font-bold text-olive dark:text-sage">
                {prediction.expectedRange || '18 - 25 kg'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-earth/80 dark:text-sand/70">Peak Maturity Window</span>
              <div className="text-xs font-semibold text-bark dark:text-warm-white">
                {prediction.maturityWindow || 'Days 160 to 180 from planting'}
              </div>
            </div>
          </div>

          {/* SVG Probability Bell Curve */}
          <div className="p-3 bg-warm-white dark:bg-darkcard rounded-xl border border-sand/30 space-y-2">
            <span className="text-[10px] font-mono uppercase text-earth/80 dark:text-sand/70 block">
              Yield Probability Distribution Curve
            </span>
            <div className="w-full h-24 flex items-center justify-center">
              <svg viewBox="0 0 300 80" className="w-full h-full stroke-olive fill-olive/15">
                <path
                  d="M 10 70 Q 75 70 120 40 T 150 15 T 180 40 Q 225 70 290 70 Z"
                  strokeWidth="2.5"
                />
                <circle cx="150" cy="15" r="4" className="fill-olive stroke-warm-white" strokeWidth="2" />
                <text x="150" y="32" textAnchor="middle" className="text-[9px] font-mono fill-earth">
                  Peak Flavor (Day 170)
                </text>
              </svg>
            </div>
          </div>

          <p className="text-xs text-earth dark:text-sand/80">
            {prediction.notes || "High rainfall during initial vegetative stage followed by dry sunny weeks during root bulking optimizes carbohydrate density."}
          </p>
        </div>
      )}

    </div>
  );
};

export default YieldPredictorWidget;
