import React, { useState } from 'react';
import { Mic, MicOff, Sparkles, RefreshCw, Volume2, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { aiService } from '../../../services/user/aiService';

const VoiceListingWidget = ({ onParsedListing }) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('ml');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTranscript('');
      setParsed(null);
      // Simulate speech recording window
      setTimeout(() => {
        setIsRecording(false);
        const sampleText = language === 'ml'
          ? "എന്റെ ടെറസിൽ നല്ല നാടൻ മഞ്ഞൾ 3 കിലോ വിളവെടുത്തിട്ടുണ്ട്. കിലോക്ക് 80 രൂപ നിരക്കിലോ നാടൻ മുട്ടയ്ക്ക് പകരമായോ നൽകാം."
          : "Harvested 5 kilograms of fresh organic tapioca from my backyard garden. Available for 40 rupees per kg or barter for bananas.";
        setTranscript(sampleText);
        handleProcessSpeech(sampleText);
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  const handleProcessSpeech = async (speechText) => {
    setLoading(true);
    try {
      const res = await aiService.parseVoiceListing(speechText, language);
      setParsed(res);
      if (onParsedListing) {
        onParsedListing(res);
      }
    } catch (err) {
      console.error('Speech parsing error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-sand/40 dark:border-sand/15 pb-4">
        <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
          <Mic className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
            {t('ai.tool5Title', 'Tool 5: Voice Listing Speech Transcriber & Entity Parser')}
          </h3>
          <p className="text-xs text-earth dark:text-sand/70">
            {t('ai.tool5Subtitle', 'Hands-free voice listing in spoken Malayalam or English with automated parameter parsing')}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-bark dark:text-warm-white">
          Spoken Language:
        </span>
        <div className="flex bg-sand/30 dark:bg-sand/10 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setLanguage('ml')}
            className={`px-3 py-1 rounded-lg transition-all ${
              language === 'ml' ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold' : 'text-earth dark:text-sand'
            }`}
          >
            മലയാളം (Malayalam)
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-lg transition-all ${
              language === 'en' ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold' : 'text-earth dark:text-sand'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Mic Trigger */}
      <div className="text-center py-6 space-y-4 bg-cream/30 dark:bg-bark/20 rounded-2xl border border-dashed border-sand dark:border-sand/20">
        <button
          type="button"
          onClick={toggleRecording}
          className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all shadow-lg ${
            isRecording 
              ? 'bg-red-500 text-warm-white animate-pulse scale-110' 
              : 'bg-olive hover:bg-olive/90 text-warm-white hover:scale-105'
          }`}
        >
          {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        <div>
          <span className="text-xs font-semibold text-bark dark:text-warm-white block">
            {isRecording ? 'Listening... Speak your crop, quantity, and price/barter' : 'Click to Speak Listing'}
          </span>
          <span className="text-[11px] text-earth dark:text-sand/70">
            {language === 'ml' 
              ? 'ഉദാ: "2 കിലോ ചേമ്പ് ഉണ്ട്, കിലോക്ക് 50 രൂപ"'
              : 'e.g. "I have 3 kg organic passion fruit available for barter"'}
          </span>
        </div>
      </div>

      {/* Transcript & Extracted Entities */}
      {transcript && (
        <div className="p-4 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/15 space-y-3">
          <div className="text-xs">
            <span className="font-mono uppercase text-earth/80 dark:text-sand/70 block mb-1">
              Spoken Transcript:
            </span>
            <p className="p-2.5 bg-warm-white dark:bg-darkcard rounded-lg border border-sand/30 text-bark dark:text-warm-white italic">
              "{transcript}"
            </p>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-xs text-olive dark:text-sage pt-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Harvest AI parsing entities (crop, quantity, price)...</span>
            </div>
          ) : parsed ? (
            <div className="space-y-2 pt-2 border-t border-sand/30">
              <span className="text-[11px] font-mono uppercase text-olive dark:text-sage font-bold block">
                Extracted Listing Parameters
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-warm-white dark:bg-darkcard rounded-lg border border-sand/30">
                  <span className="text-[10px] text-earth/60 block">Produce</span>
                  <strong className="text-bark dark:text-warm-white">{parsed.crop || 'Tapioca'}</strong>
                </div>
                <div className="p-2 bg-warm-white dark:bg-darkcard rounded-lg border border-sand/30">
                  <span className="text-[10px] text-earth/60 block">Quantity</span>
                  <strong className="text-bark dark:text-warm-white">{parsed.quantity || '3'} {parsed.unit || 'kg'}</strong>
                </div>
                <div className="p-2 bg-warm-white dark:bg-darkcard rounded-lg border border-sand/30">
                  <span className="text-[10px] text-earth/60 block">Mode</span>
                  <strong className="text-terracotta">{parsed.type || 'SELL'}</strong>
                </div>
                <div className="p-2 bg-warm-white dark:bg-darkcard rounded-lg border border-sand/30">
                  <span className="text-[10px] text-earth/60 block">Price / Trade</span>
                  <strong className="text-olive dark:text-sage">₹{parsed.price || '80'}</strong>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

    </div>
  );
};

export default VoiceListingWidget;
