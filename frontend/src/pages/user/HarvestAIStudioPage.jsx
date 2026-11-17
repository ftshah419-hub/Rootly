import React, { useState } from 'react';
import { 
  Sparkles, Camera, Feather, IndianRupee, Network, 
  Mic, Stethoscope, LineChart, Bot, Sprout, ArrowRight 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import ProduceScanner from '../../components/user/ai/ProduceScanner';
import ListingGeneratorWidget from '../../components/user/ai/ListingGeneratorWidget';
import PriceSuggesterWidget from '../../components/user/ai/PriceSuggesterWidget';
import BarterMatcherWidget from '../../components/user/ai/BarterMatcherWidget';
import VoiceListingWidget from '../../components/user/ai/VoiceListingWidget';
import GardenDoctorWidget from '../../components/user/ai/GardenDoctorWidget';
import YieldPredictorWidget from '../../components/user/ai/YieldPredictorWidget';
import HarvestBuddyChat from '../../components/user/ai/HarvestBuddyChat';
import { useTranslation } from '../../hooks/user/useTranslation';

const HarvestAIStudioPage = () => {
  const { t } = useTranslation();
  const [activeTool, setActiveTool] = useState('scanner'); // 'scanner', 'story', 'pricing', 'barter', 'voice', 'doctor', 'yield', 'buddy'

  const tools = [
    { id: 'scanner', label: '1. Optical Scanner', icon: Camera, desc: 'Freshness & Cultivar Detection' },
    { id: 'story', label: '2. Story Writer', icon: Feather, desc: 'Bilingual English + Malayalam' },
    { id: 'pricing', label: '3. Mandi Balancer', icon: IndianRupee, desc: 'Fair APMC Pricing' },
    { id: 'barter', label: '4. Barter Graph', icon: Network, desc: 'Mutual Surplus Matcher' },
    { id: 'voice', label: '5. Voice Transcriber', icon: Mic, desc: 'Hands-Free Spoken Listing' },
    { id: 'doctor', label: '6. Garden Doctor', icon: Stethoscope, desc: 'Pathology & Bio-Remedies' },
    { id: 'yield', label: '7. Yield Predictor', icon: LineChart, desc: 'Monsoon Bell Curve' },
    { id: 'buddy', label: 'Harvest Buddy AI', icon: Bot, desc: 'Conversational Agro Guide' }
  ];

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-olive via-olive/95 to-earth rounded-3xl p-8 sm:p-10 text-warm-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-white/10 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sand" />
              <span>Hyperlocal Agro Intelligence Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              Harvest AI Studio
            </h1>
            <p className="text-xs sm:text-sm text-warm-white/80 leading-relaxed font-sans">
              7 specialized agro tools engineered to support backyard gardens, optimize fair produce trades, and diagnose plant diseases with biological remedies.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-warm-white/15 px-4 py-2 rounded-2xl border border-warm-white/10 shrink-0">
            <Sprout className="w-4 h-4 text-sand" />
            <span>Rootly AI Engine v2.4</span>
          </div>
        </div>

        {/* 2-Column Grid: Tools Navigation + Active Tool Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tool Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-earth/80 dark:text-sand/70 font-mono mb-2 px-1">
              Select AI Capability
            </h3>
            <div className="space-y-1.5">
              {tools.map((tl) => {
                const Icon = tl.icon;
                const isActive = activeTool === tl.id;
                return (
                  <button
                    key={tl.id}
                    onClick={() => setActiveTool(tl.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      isActive
                        ? 'bg-olive text-warm-white border-olive shadow-md'
                        : 'bg-warm-white dark:bg-darkcard border-sand dark:border-sand/20 hover:border-olive/50 text-bark dark:text-warm-white'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-warm-white/20 text-warm-white' : 'bg-sand/20 dark:bg-sand/10 text-olive dark:text-sage'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs tracking-tight">
                        {tl.label}
                      </div>
                      <div className={`text-[11px] truncate ${isActive ? 'text-warm-white/80' : 'text-earth dark:text-sand/70'}`}>
                        {tl.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tool Interactive Stage */}
          <div className="lg:col-span-8">
            {activeTool === 'scanner' && <ProduceScanner />}
            {activeTool === 'story' && <ListingGeneratorWidget />}
            {activeTool === 'pricing' && <PriceSuggesterWidget />}
            {activeTool === 'barter' && <BarterMatcherWidget />}
            {activeTool === 'voice' && <VoiceListingWidget />}
            {activeTool === 'doctor' && <GardenDoctorWidget />}
            {activeTool === 'yield' && <YieldPredictorWidget />}
            {activeTool === 'buddy' && <HarvestBuddyChat />}
          </div>

        </div>

      </div>
    </UserLayout>
  );
};

export default HarvestAIStudioPage;
