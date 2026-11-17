import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Bookmark, Calendar, Sprout, ShieldCheck, CheckCircle2, 
  AlertCircle, X, Clock, ArrowRight, User 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import PrebookingPipelineCard from '../../components/user/harvest/PrebookingPipelineCard';
import { useTranslation } from '../../hooks/user/useTranslation';
import { prebookingService } from '../../services/user/prebookingService';
import { harvestService } from '../../services/user/harvestService';

const PrebookingPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const targetHarvestId = searchParams.get('harvestId');

  const [prebookableHarvests, setPrebookableHarvests] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'myBookings'
  
  // Prebooking Modal
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [bookedQuantity, setBookedQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    loadPrebookings();
  }, []);

  const loadPrebookings = async () => {
    setLoading(true);
    try {
      const allHarvests = await harvestService.getUpcomingHarvests(30).catch(() => []);
      const items = (allHarvests?.harvests || allHarvests?.data || (Array.isArray(allHarvests) ? allHarvests : []))
        .filter(h => h.allowPrebooking);
      setPrebookableHarvests(items);

      if (targetHarvestId) {
        const found = items.find(h => (h._id || h.id) === targetHarvestId);
        if (found) setSelectedHarvest(found);
      }

      const bookingsRes = await prebookingService.getMyPrebookings().catch(() => []);
      setMyBookings(bookingsRes?.prebookings || bookingsRes?.data || (Array.isArray(bookingsRes) ? bookingsRes : []));
    } catch (err) {
      console.warn('Prebooking fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrebookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHarvest) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      await prebookingService.createPrebooking({
        harvestId: selectedHarvest._id || selectedHarvest.id,
        quantity: Number(bookedQuantity),
        notes
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSelectedHarvest(null);
        setSubmitSuccess(false);
        loadPrebookings();
      }, 1500);
    } catch (err) {
      console.error('Prebook submit error:', err);
      setSubmitError(err?.response?.data?.message || err.message || 'Failed to submit prebooking.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this pre-booking reservation?')) return;
    try {
      await prebookingService.cancelPrebooking(bookingId);
      loadPrebookings();
    } catch (err) {
      alert('Failed to cancel prebooking.');
    }
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/40 dark:border-sand/15 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-olive dark:text-sage font-bold">
                Harvest Pre-Allocation
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-bark dark:text-warm-white mt-1">
              {t('prebooking.title', 'Pre-Book Upcoming Garden Harvests')}
            </h1>
            <p className="text-xs text-earth dark:text-sand/70">
              Reserve portions of ripening crops before they are picked. Support growers with early demand certainty.
            </p>
          </div>

          <div className="flex bg-sand/30 dark:bg-sand/10 p-1 rounded-xl text-xs font-medium self-start sm:self-center">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'browse'
                  ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold'
                  : 'text-earth dark:text-sand'
              }`}
            >
              Available Crops ({prebookableHarvests.length})
            </button>
            <button
              onClick={() => setActiveTab('myBookings')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'myBookings'
                  ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold'
                  : 'text-earth dark:text-sand'
              }`}
            >
              My Reserved Bookings ({myBookings.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Available Crops Grid */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-64 bg-sand/20 dark:bg-sand/10 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : prebookableHarvests.length === 0 ? (
              <div className="p-12 text-center bg-cream/30 dark:bg-bark/20 rounded-3xl border border-dashed border-sand dark:border-sand/20 space-y-3">
                <Bookmark className="w-12 h-12 text-olive/40 mx-auto" />
                <h4 className="text-base font-serif font-bold text-bark dark:text-warm-white">
                  No Harvests Open for Pre-Booking Right Now
                </h4>
                <p className="text-xs text-earth dark:text-sand/70 max-w-sm mx-auto">
                  Growers list upcoming crops as planting cycles mature. Check back or visit the Harvest Radar to explore ripening dates!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {prebookableHarvests.map((h) => (
                  <PrebookingPipelineCard
                    key={h._id || h.id}
                    harvest={h}
                    onPrebook={(item) => setSelectedHarvest(item)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Reserved Bookings */}
        {activeTab === 'myBookings' && (
          <div className="space-y-4">
            {myBookings.length === 0 ? (
              <div className="p-12 text-center bg-cream/30 dark:bg-bark/20 rounded-3xl border border-dashed border-sand dark:border-sand/20 space-y-2">
                <Bookmark className="w-10 h-10 text-olive/40 mx-auto" />
                <h4 className="text-sm font-serif font-bold text-bark dark:text-warm-white">
                  You Have No Active Pre-Bookings
                </h4>
                <p className="text-xs text-earth dark:text-sand/70">
                  Browse available ripening crops to reserve your portion before harvest.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-sand/30 dark:divide-sand/10 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl overflow-hidden shadow-sm">
                {myBookings.map((b) => {
                  const harvest = b.harvest || {};
                  return (
                    <div key={b._id || b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-bark dark:text-warm-white">
                            {harvest.cropName || harvest.name || 'Upcoming Harvest'}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-olive/15 text-olive font-bold">
                            {b.status || 'CONFIRMED'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-earth dark:text-sand/80">
                          <span>Reserved: <strong className="text-bark dark:text-warm-white">{b.quantity} {harvest.unit || 'kg'}</strong></span>
                          <span>•</span>
                          <span>Est. Picking: {new Date(harvest.expectedHarvestDate || b.expectedDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCancelBooking(b._id || b.id)}
                        className="px-3 py-1.5 border border-sand dark:border-sand/30 hover:bg-red-50 hover:border-red-200 text-xs font-medium text-earth hover:text-red-600 rounded-xl transition-colors self-end sm:self-center"
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* PREBOOK MODAL */}
      {selectedHarvest && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-bark/60 backdrop-blur-sm" onClick={() => setSelectedHarvest(null)} />
          <div className="relative bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
            
            <div className="flex items-center justify-between border-b border-sand/40 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-bark dark:text-warm-white">
                  Reserve Harvest Portion
                </h3>
                <p className="text-xs text-earth dark:text-sand/70">
                  {selectedHarvest.cropName || selectedHarvest.name} ({selectedHarvest.variety || 'Native'})
                </p>
              </div>
              <button onClick={() => setSelectedHarvest(null)} className="p-1 rounded-full text-earth">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-olive dark:text-sage mx-auto animate-bounce" />
                <h4 className="font-serif font-bold text-base text-bark dark:text-warm-white">
                  Portion Reserved!
                </h4>
                <p className="text-xs text-earth dark:text-sand/80">
                  The grower has been notified. You will be alerted when harvest begins!
                </p>
              </div>
            ) : (
              <form onSubmit={handlePrebookSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1">
                    Portion to Pre-Book ({selectedHarvest.unit || 'kg'})
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    required
                    value={bookedQuantity}
                    onChange={(e) => setBookedQuantity(Math.max(0.5, Number(e.target.value) || 1))}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1">
                    Message to Grower (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Excited for this harvest! Can pick up within hours of cutting."
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                  />
                </div>

                <div className="p-3 bg-olive/10 rounded-xl text-xs text-earth dark:text-sand/80 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                  <span>
                    No advance payment required. Pre-booking establishes community harvest allocation.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHarvest(null)}
                    className="px-4 py-2 text-xs text-earth dark:text-sand"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-olive hover:bg-olive/90 text-warm-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                  >
                    {submitting ? 'Reserving...' : 'Confirm Reservation'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </UserLayout>
  );
};

export default PrebookingPage;
