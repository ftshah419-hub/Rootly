import React, { useState } from 'react';
import { Network, Sparkles, RefreshCw, ArrowRightLeft, User, MapPin } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { aiService } from '../../../services/user/aiService';

const BarterMatcherWidget = ({ onSelectMatch }) => {
  const { t } = useTranslation();
  const [myCrop, setMyCrop] = useState('Tapioca');
  const [wantedCrop, setWantedCrop] = useState('Country Eggs');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(null);

  const handleMatch = async () => {
    setLoading(true);
    try {
      const res = await aiService.findBarterMatches(myCrop, wantedCrop);
      setMatches(res || []);
    } catch (err) {
      console.error('Match engine error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-sand/40 dark:border-sand/15 pb-4">
        <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
          <Network className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
            {t('ai.tool4Title', 'Tool 4: Surplus Pairing & Barter Matching Node Graph')}
          </h3>
          <p className="text-xs text-earth dark:text-sand/70">
            {t('ai.tool4Subtitle', 'Calculates mutual coincidence of wants within 5km garden plots')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            Your Surplus Crop
          </label>
          <input
            type="text"
            value={myCrop}
            onChange={(e) => setMyCrop(e.target.value)}
            placeholder="e.g. Tapioca, Guavas"
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            Desired Produce
          </label>
          <input
            type="text"
            value={wantedCrop}
            onChange={(e) => setWantedCrop(e.target.value)}
            placeholder="e.g. Country Eggs, Bananas"
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={loading || !myCrop}
        onClick={handleMatch}
        className="w-full py-2.5 px-4 bg-terracotta hover:bg-terracotta/90 disabled:opacity-50 text-warm-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Traversing Hyperlocal Barter Graph...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-sand" />
            Find Mutual Barter Pairings
          </>
        )}
      </button>

      {matches && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono uppercase text-earth dark:text-sand/70 block">
            Pairing Results ({matches.length} matches within radius)
          </span>

          {matches.length === 0 ? (
            <p className="text-xs text-earth dark:text-sand/70 p-4 text-center bg-sand/15 rounded-xl">
              No direct reciprocal matches found right now. Announcing your trade on the Barter board will notify neighbours when someone seeks {myCrop}.
            </p>
          ) : (
            matches.map((m, idx) => (
              <div 
                key={idx}
                className="p-3.5 bg-cream/40 dark:bg-bark/30 border border-sand/40 dark:border-sand/15 rounded-xl flex items-center justify-between gap-3 hover:border-terracotta transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-bark dark:text-warm-white">
                      {m.neighbourName || 'Local Grower'}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-terracotta/15 text-terracotta font-bold">
                      {m.matchScore || 92}% Mutual Fit
                    </span>
                  </div>
                  <div className="text-xs text-earth dark:text-sand/80 flex items-center gap-2">
                    <span>Has: <strong className="text-bark dark:text-warm-white">{m.offeredByNeighbour || wantedCrop}</strong></span>
                    <span>•</span>
                    <span>Wants: <strong className="text-bark dark:text-warm-white">{m.desiredByNeighbour || myCrop}</strong></span>
                  </div>
                  <div className="text-[11px] text-earth/70 dark:text-sand/60 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-terracotta" />
                    <span>~{m.distanceKm || '1.8'} km away ({m.locality || 'Neighbourhood'})</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectMatch?.(m)}
                  className="px-3 py-1.5 bg-terracotta hover:bg-terracotta/90 text-warm-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0"
                >
                  Initiate Swap
                </button>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default BarterMatcherWidget;
