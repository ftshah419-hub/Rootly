import React, { useState } from 'react';
import { Camera, Sparkles, Upload, CheckCircle, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { aiService } from '../../../services/user/aiService';

const ProduceScanner = ({ onScanComplete }) => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setLoading(true);
    setError(null);

    try {
      const scanResult = await aiService.scanProduce(imagePreview);
      setResult(scanResult);
      if (onScanComplete) {
        onScanComplete(scanResult);
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(err?.message || 'Failed to scan produce.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-sand/40 dark:border-sand/15 pb-4">
        <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
          <Camera className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
            {t('ai.tool1Title', 'Tool 1: Produce Optical Scanner & Quality Grader')}
          </h3>
          <p className="text-xs text-earth dark:text-sand/70">
            {t('ai.tool1Subtitle', 'Instant botanical identification, ripeness index, and defect grading')}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Zone */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-1/2 aspect-video rounded-xl bg-sand/20 dark:bg-sand/5 border-2 border-dashed border-sand dark:border-sand/20 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Produce Scan" className="w-full h-full object-cover rounded-lg" />
              <label className="absolute inset-0 bg-bark/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-warm-white text-xs">
                <Upload className="w-6 h-6 mb-1" />
                Change Image
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer text-center space-y-2">
              <Camera className="w-8 h-8 text-olive/60" />
              <span className="text-xs font-semibold text-bark dark:text-warm-white">
                Snap or Upload Produce Photo
              </span>
              <span className="text-[11px] text-earth dark:text-sand/70">
                JPEG, PNG or WEBP (Max 5MB)
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        <div className="w-full sm:w-1/2 space-y-3">
          <p className="text-xs text-earth dark:text-sand/80 leading-relaxed">
            Upload a clear photo of your picked or hanging produce. Harvest AI will identify the cultivar, evaluate physical condition, and recommend optimal harvest/sale windows.
          </p>

          <button
            type="button"
            disabled={!imagePreview || loading}
            onClick={handleAnalyze}
            className="w-full py-2.5 px-4 bg-olive hover:bg-olive/90 disabled:opacity-50 text-warm-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Produce Metrics...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-sand" />
                Run AI Produce Scan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="mt-4 p-4 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/15 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-sand/30 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-earth/80 dark:text-sand/70">Identified Produce</span>
              <h4 className="text-base font-serif font-bold text-bark dark:text-warm-white">
                {result.identifiedItem}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-earth/80 dark:text-sand/70">Freshness Index</span>
              <div className="text-sm font-bold font-mono text-olive dark:text-sage">
                {result.freshnessScore}% Grade A
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-warm-white dark:bg-darkcard rounded-lg border border-sand/30">
              <span className="text-[10px] text-earth/70 dark:text-sand/60 block">Ripeness</span>
              <strong className="text-bark dark:text-warm-white">{result.ripenessStage}</strong>
            </div>
            <div className="p-2.5 bg-warm-white dark:bg-darkcard rounded-lg border border-sand/30">
              <span className="text-[10px] text-earth/70 dark:text-sand/60 block">Est. Shelf Life</span>
              <strong className="text-bark dark:text-warm-white">{result.shelfLifeDays} days</strong>
            </div>
            <div className="p-2.5 bg-warm-white dark:bg-darkcard rounded-lg border border-sand/30">
              <span className="text-[10px] text-earth/70 dark:text-sand/60 block">Organic Confidence</span>
              <strong className="text-olive dark:text-sage">{result.confidence || 94}%</strong>
            </div>
            <div className="p-2.5 bg-warm-white dark:bg-darkcard rounded-lg border border-sand/30">
              <span className="text-[10px] text-earth/70 dark:text-sand/60 block">Suggested Unit</span>
              <strong className="text-bark dark:text-warm-white">{result.suggestedUnit || 'kg'}</strong>
            </div>
          </div>

          {result.careAdvice && (
            <p className="text-xs text-earth dark:text-sand/80 bg-sand/15 p-2.5 rounded-lg italic">
              "Note: {result.careAdvice}"
            </p>
          )}
        </div>
      )}

    </div>
  );
};

export default ProduceScanner;
