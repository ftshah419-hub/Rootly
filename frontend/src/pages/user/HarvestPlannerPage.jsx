import React, { useState, useEffect } from 'react';
import { 
  Calendar, Sprout, Plus, Clock, Trash2, Edit, 
  ShieldCheck, RefreshCw, Sun, CloudRain, Sparkles 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import HarvestTimeline from '../../components/user/harvest/HarvestTimeline';
import RegisterCropForm from '../../components/user/harvest/RegisterCropForm';
import PlantingGuide from '../../components/user/harvest/PlantingGuide';
import { useTranslation } from '../../hooks/user/useTranslation';
import { harvestService } from '../../services/user/harvestService';

const HarvestPlannerPage = () => {
  const { t } = useTranslation();
  const [upcomingHarvests, setUpcomingHarvests] = useState([]);
  const [myHarvests, setMyHarvests] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHarvests();
  }, []);

  const loadHarvests = async () => {
    setLoading(true);
    try {
      const allHarvests = await harvestService.getUpcomingHarvests(30).catch(() => []);
      setUpcomingHarvests(allHarvests?.harvests || allHarvests?.data || (Array.isArray(allHarvests) ? allHarvests : []));

      const mine = await harvestService.getMyHarvests().catch(() => []);
      setMyHarvests(mine?.harvests || mine?.data || (Array.isArray(mine) ? mine : []));
    } catch (err) {
      console.warn('Harvest planner error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHarvest = async (id) => {
    if (!window.confirm('Delete this crop announcement?')) return;
    try {
      await harvestService.deleteHarvest(id);
      loadHarvests();
    } catch (err) {
      alert('Failed to delete harvest.');
    }
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/40 dark:border-sand/15 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-olive dark:text-sage font-bold">
                Agro Calendar & Prebooking Hub
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-bark dark:text-warm-white mt-1">
              {t('harvest.plannerTitle', 'Harvest Planner & Crop Radar')}
            </h1>
            <p className="text-xs text-earth dark:text-sand/70">
              Log ripening crops, track community harvesting cycles, and enable neighbours to pre-book fresh portions
            </p>
          </div>

          <button
            onClick={() => setShowRegisterForm(!showRegisterForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-olive hover:bg-olive/90 text-warm-white text-xs font-semibold rounded-xl shadow-md transition-all self-start sm:self-center active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{showRegisterForm ? 'Close Crop Form' : 'Log Upcoming Crop'}</span>
          </button>
        </div>

        {/* Register Crop Form Drawer */}
        {showRegisterForm && (
          <div className="animate-fade-in">
            <RegisterCropForm
              onSuccess={() => {
                setShowRegisterForm(false);
                loadHarvests();
              }}
              onCancel={() => setShowRegisterForm(false)}
            />
          </div>
        )}

        {/* 14-Day Hyperlocal Harvest Radar */}
        <HarvestTimeline
          harvests={upcomingHarvests}
          onSelectHarvest={(h) => window.location.href = `/prebooking?harvestId=${h._id || h.id}`}
        />

        {/* My Registered Crops Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-sand/40 dark:border-sand/15 pb-3">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-olive" />
              <h2 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
                My Announced Garden Crops ({myHarvests.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(n => (
                <div key={n} className="h-16 bg-sand/20 dark:bg-sand/10 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : myHarvests.length === 0 ? (
            <div className="p-8 text-center bg-cream/30 dark:bg-bark/20 rounded-2xl border border-dashed border-sand dark:border-sand/20 space-y-2">
              <Sprout className="w-8 h-8 text-olive/40 mx-auto" />
              <p className="text-xs text-earth dark:text-sand/70">
                You haven't announced any upcoming harvests yet. Click "Log Upcoming Crop" above to let neighbours reserve in advance!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-sand/30 dark:divide-sand/10 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl overflow-hidden shadow-sm">
              {myHarvests.map((h) => (
                <div key={h._id || h.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-bark dark:text-warm-white">
                        {h.cropName || h.name}
                      </h4>
                      <span className="text-xs text-earth dark:text-sand/70">
                        ({h.variety || 'Native'})
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-earth dark:text-sand/80">
                      <span>Harvest: <strong className="text-bark dark:text-warm-white">{new Date(h.expectedHarvestDate || h.harvestDate).toLocaleDateString()}</strong></span>
                      <span>•</span>
                      <span>Est. Yield: <strong className="text-olive dark:text-sage">{h.expectedQuantity || h.quantity} {h.unit || 'kg'}</strong></span>
                      {h.allowPrebooking && (
                        <>
                          <span>•</span>
                          <span className="text-terracotta font-semibold">Pre-booking Active</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteHarvest(h._id || h.id)}
                    className="p-2 text-earth hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kerala Seasonal Planting Guide & Agro Almanac */}
        <PlantingGuide />

      </div>
    </UserLayout>
  );
};

export default HarvestPlannerPage;
