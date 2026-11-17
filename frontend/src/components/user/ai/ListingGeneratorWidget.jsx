import React, { useState } from 'react';
import { Sparkles, Languages, Copy, Check, RefreshCw, Feather } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { aiService } from '../../../services/user/aiService';

const ListingGeneratorWidget = ({ onApplyToForm }) => {
  const { t } = useTranslation();
  const [cropName, setCropName] = useState('');
  const [method, setMethod] = useState('Terrace organic garden, zero chemical pesticides');
  const [targetLang, setTargetLang] = useState('both');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!cropName) return;
    setLoading(true);
    try {
      const res = await aiService.generateListingCopy(cropName, method, targetLang);
      setOutput(res);
    } catch (err) {
      console.error('Copy gen error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-sand/40 dark:border-sand/15 pb-4">
        <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
          <Feather className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
            {t('ai.tool2Title', 'Tool 2: Bilingual Produce Story & Listing Generator')}
          </h3>
          <p className="text-xs text-earth dark:text-sand/70">
            {t('ai.tool2Subtitle', 'Generates authentic, rustic community storytelling in English & Malayalam')}
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
            placeholder="e.g. Backyard Tapioca, Nendran Bananas, Bird's Eye Chili"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            Target Language
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="both">Both (English + മലയാളം)</option>
            <option value="en">English Only</option>
            <option value="ml">മലയാളം Only</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
          Growing Details / Compost Style
        </label>
        <input
          type="text"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          placeholder="e.g. Fed with kitchen compost and vermicompost, heirloom seeds"
          className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
        />
      </div>

      <button
        type="button"
        disabled={!cropName || loading}
        onClick={handleGenerate}
        className="w-full py-2.5 px-4 bg-terracotta hover:bg-terracotta/90 disabled:opacity-50 text-warm-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Crafting Story...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-sand" />
            Generate Rustic Listing Story
          </>
        )}
      </button>

      {output && (
        <div className="p-4 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/15 space-y-4 animate-fade-in">
          {output.english && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-earth dark:text-sand/80 uppercase font-mono">
                  English Community Narrative
                </span>
                <button
                  onClick={() => handleCopy(output.english)}
                  className="text-xs text-olive dark:text-sage flex items-center gap-1 hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-olive" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <p className="text-sm text-bark dark:text-warm-white bg-warm-white dark:bg-darkcard p-3 rounded-lg border border-sand/30 leading-relaxed font-sans">
                {output.english}
              </p>
            </div>
          )}

          {output.malayalam && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-earth dark:text-sand/80 uppercase font-mono">
                  മലയാളം വിവരണം (Malayalam Narrative)
                </span>
                <button
                  onClick={() => handleCopy(output.malayalam)}
                  className="text-xs text-olive dark:text-sage flex items-center gap-1 hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-olive" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <p className="text-sm text-bark dark:text-warm-white bg-warm-white dark:bg-darkcard p-3 rounded-lg border border-sand/30 leading-relaxed font-malayalam">
                {output.malayalam}
              </p>
            </div>
          )}

          {onApplyToForm && (
            <button
              onClick={() => onApplyToForm(output)}
              className="text-xs text-terracotta font-semibold hover:underline block text-right pt-1"
            >
              Insert directly into current listing draft &rarr;
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default ListingGeneratorWidget;
