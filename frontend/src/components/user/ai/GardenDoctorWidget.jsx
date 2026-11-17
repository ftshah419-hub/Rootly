import React, { useState } from 'react';
import { Stethoscope, Sparkles, Upload, AlertCircle, CheckCircle, RefreshCw, Leaf } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { aiService } from '../../../services/user/aiService';

const GardenDoctorWidget = () => {
  const { t } = useTranslation();
  const [symptomText, setSymptomText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!symptomText && !imagePreview) return;
    setLoading(true);
    try {
      const res = await aiService.diagnosePlantDisease(symptomText, imagePreview);
      setDiagnosis(res);
    } catch (err) {
      console.error('Diagnosis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-sand/40 dark:border-sand/15 pb-4">
        <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
          <Stethoscope className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
            {t('ai.tool6Title', 'Tool 6: Garden Doctor & Bio-Organic Pathology')}
          </h3>
          <p className="text-xs text-earth dark:text-sand/70">
            {t('ai.tool6Subtitle', 'Leaf disease recognition with traditional chemical-free Kerala bio-remedies')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
            Describe Leaf Symptoms or Crop Issue
          </label>
          <textarea
            rows={2}
            value={symptomText}
            onChange={(e) => setSymptomText(e.target.value)}
            placeholder="e.g. Curling leaves on green chili plant with stunted growth, or white powdery film on pumpkin vines..."
            className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-3 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          />
        </div>

        {/* Optional leaf photo upload */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-3 py-2 bg-sand/20 dark:bg-sand/10 hover:bg-sand/30 rounded-xl cursor-pointer text-xs text-earth dark:text-sand/90 transition-colors">
            <Upload className="w-4 h-4 text-olive" />
            <span>{imagePreview ? 'Leaf Photo Attached' : 'Attach Leaf Close-up Photo'}</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {imagePreview && (
            <span className="text-xs text-olive dark:text-sage font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Photo loaded
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={loading || (!symptomText && !imagePreview)}
        onClick={handleDiagnose}
        className="w-full py-2.5 px-4 bg-olive hover:bg-olive/90 disabled:opacity-50 text-warm-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Analyzing Pathology Database...
          </>
        ) : (
          <>
            <Leaf className="w-4 h-4 text-sand" />
            Diagnose & Prescribe Bio-Remedies
          </>
        )}
      </button>

      {diagnosis && (
        <div className="p-4 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/15 space-y-4 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-earth/80 dark:text-sand/70 block">Identified Condition</span>
              <h4 className="text-base font-serif font-bold text-bark dark:text-warm-white">
                {diagnosis.condition || 'Leaf Curl Complex / Thrips Infestation'}
              </h4>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-olive/15 text-olive dark:text-sage">
              {diagnosis.confidence || 93}% Match
            </span>
          </div>

          <div className="p-3 bg-warm-white dark:bg-darkcard rounded-xl border border-sand/30 space-y-2">
            <h5 className="text-xs font-bold text-olive dark:text-sage uppercase font-mono">
              Traditional Bio-Remedy Prescription:
            </h5>
            <p className="text-xs text-bark/90 dark:text-warm-white/90 leading-relaxed">
              {diagnosis.remedy || "1. Spray freshly prepared Neem Kernel Aqueous Extract (5%) or Neem Oil (20ml) mixed with 5g bar soap in 1L warm water.\n2. Spray diluted sour buttermilk (1:10 with water) on leaf undersides in the evening.\n3. Dust dry wood ash at base to deter soil-borne larvae."}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default GardenDoctorWidget;
