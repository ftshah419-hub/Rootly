import React, { useState } from 'react';
import { Compass, Sun, CloudRain, Wind, Sprout, Sparkles, BookOpen } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const PlantingGuide = () => {
  const { t } = useTranslation();
  const [activeSeason, setActiveSeason] = useState('monsoon');

  const seasons = [
    {
      id: 'monsoon',
      name: 'South-West Monsoon (Kharif / Edavappathi)',
      months: 'June - August',
      icon: CloudRain,
      crops: [
        { name: 'Tapioca (Maracheeni)', tip: 'Plant stem cuttings with 2-3 nodes in elevated mounds to prevent waterlogging.' },
        { name: 'Red Amaranth (Cheera)', tip: 'Broadcast seeds mixed with sand in raised beds; harvest in 25-30 days.' },
        { name: 'Cowpea (Achinga Payar)', tip: 'Trellis along boundary fences; excellent companion for fixing nitrogen.' },
        { name: 'Ginger & Turmeric', tip: 'Ideal time for planting rhizomes; mulch heavily with dry leaves to retain organic matter.' }
      ]
    },
    {
      id: 'winter',
      name: 'Post-Monsoon (Rabi / Thulam)',
      months: 'September - December',
      icon: Wind,
      crops: [
        { name: 'Backyard Tomatoes', tip: 'Transplant 25-day old seedlings; mulch with straw to prevent soil-splash blight.' },
        { name: 'Green Chilies (Kanthari & Round)', tip: 'Prune terminal shoots for bushy growth and continuous fruit set.' },
        { name: 'Brinjal (Eggplant)', tip: 'Apply neem cake and wood ash at base to deter stem borers.' },
        { name: 'Cabbage & Cauliflower in Grow Bags', tip: 'Acclimatized varieties thrive on rooftop terraces during cooler nights.' }
      ]
    },
    {
      id: 'summer',
      name: 'Summer (Puncha / Meenam)',
      months: 'January - May',
      icon: Sun,
      crops: [
        { name: 'Snake Gourd & Bitter Gourd', tip: 'Soak seeds overnight; provide sturdy pandal trellis for dangling fruits.' },
        { name: 'Okra (Ladyfinger / Venda)', tip: 'Thrives in direct heat; spray diluted sour buttermilk to deter powdery mildew.' },
        { name: 'Country Spinach & Ceylon Spinach', tip: 'Perennial heat-hardy greens that yield delicious leaves throughout dry spells.' },
        { name: 'Lemongrass & Mint', tip: 'Ideal companion plants near compost pits or water drainage channels.' }
      ]
    }
  ];

  const currentSeasonData = seasons.find(s => s.id === activeSeason) || seasons[0];

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand/40 dark:border-sand/15 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
              {t('harvest.guideTitle', 'Kerala Agro Planting Almanac')}
            </h3>
            <p className="text-xs text-earth dark:text-sand/70">
              Seasonal sowing advice and native companion planting techniques
            </p>
          </div>
        </div>

        {/* Season selector */}
        <div className="flex bg-sand/30 dark:bg-sand/10 p-1 rounded-xl text-xs font-medium">
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeSeason === s.id
                  ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold'
                  : 'text-earth dark:text-sand'
              }`}
            >
              <s.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Season info banner */}
      <div className="p-4 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/10 flex items-center justify-between">
        <div>
          <h4 className="font-serif font-bold text-base text-bark dark:text-warm-white">
            {currentSeasonData.name}
          </h4>
          <span className="text-xs text-earth dark:text-sand/70">
            Window: <strong className="text-olive dark:text-sage">{currentSeasonData.months}</strong>
          </span>
        </div>
        <currentSeasonData.icon className="w-8 h-8 text-olive/30 dark:text-sage/30" />
      </div>

      {/* Crops grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentSeasonData.crops.map((c, idx) => (
          <div 
            key={idx}
            className="p-4 bg-warm-white dark:bg-darkcard/80 border border-sand/40 dark:border-sand/15 rounded-xl space-y-2 hover:border-olive transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-olive dark:text-sage" />
              <h5 className="font-semibold text-sm text-bark dark:text-warm-white">
                {c.name}
              </h5>
            </div>
            <p className="text-xs text-earth dark:text-sand/80 leading-relaxed">
              {c.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Companion Planting Secret */}
      <div className="p-3.5 bg-sage/10 dark:bg-sage/15 rounded-xl border border-sage/30 flex items-start gap-2.5 text-xs text-earth dark:text-sand/90">
        <Sparkles className="w-4 h-4 text-olive dark:text-sage shrink-0 mt-0.5" />
        <div>
          <strong className="text-bark dark:text-warm-white font-semibold">
            Traditional Biodiversity Secret:
          </strong>{' '}
          Interplanting African Marigolds (Chendumalli) alongside chillies and tomatoes naturally discourages root-knot nematodes and attracts pollinating native bees to terrace gardens.
        </div>
      </div>

    </div>
  );
};

export default PlantingGuide;
