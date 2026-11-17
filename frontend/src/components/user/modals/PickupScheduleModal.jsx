import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, KeyRound, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { pickupService } from '../../../services/user/pickupService';

const PickupScheduleModal = ({ exchange, existingSchedule, isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [scheduledDate, setScheduledDate] = useState(
    existingSchedule?.date ? new Date(existingSchedule.date).toISOString().split('T')[0] : ''
  );
  const [timeWindow, setTimeWindow] = useState(existingSchedule?.timeWindow || '17:00 - 18:30');
  const [pickupType, setPickupType] = useState(existingSchedule?.type || 'PORCH_BOX');
  const [specialInstructions, setSpecialInstructions] = useState(existingSchedule?.notes || '');
  const [pinInput, setPinInput] = useState('');
  const [mode, setMode] = useState(existingSchedule ? 'confirm' : 'schedule'); // 'schedule' or 'confirm'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !exchange) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'confirm' && pinInput) {
        // Verifying 4-digit PIN for handover
        await pickupService.verifyPin(existingSchedule?._id || existingSchedule?.id, pinInput);
        setSuccess(true);
      } else {
        // Creating or proposing pickup schedule
        const payload = {
          exchangeId: exchange._id || exchange.id,
          date: scheduledDate,
          timeWindow,
          type: pickupType,
          notes: specialInstructions
        };

        await pickupService.createSchedule(payload);
        setSuccess(true);
      }

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
      }, 1800);
    } catch (err) {
      console.error('Pickup schedule error:', err);
      setError(err?.response?.data?.message || err.message || t('common.errorSubmitting', 'Failed to update pickup schedule.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-bark/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl max-w-md w-full p-6 shadow-2xl z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand dark:border-sand/20 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-olive/10 text-olive dark:text-sage flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
                {mode === 'confirm' ? t('pickup.verifyTitle', 'Complete Pickup Handover') : t('pickup.scheduleTitle', 'Schedule Porch Pickup')}
              </h3>
              <p className="text-xs text-earth dark:text-sand/70">
                {exchange.product?.title || exchange.product?.name || 'Produce Exchange'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-earth dark:text-sand hover:bg-sand/30 dark:hover:bg-sand/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-olive dark:text-sage mx-auto animate-bounce" />
            <h4 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
              {mode === 'confirm' ? t('pickup.verifiedSuccess', 'Handover Confirmed!') : t('pickup.scheduledSuccess', 'Pickup Window Set!')}
            </h4>
            <p className="text-sm text-earth dark:text-sand/80 max-w-xs mx-auto">
              {t('pickup.scheduledDesc', 'Both parties will see the updated schedule and secure 4-digit code in their workspace.')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Toggle Mode if existingSchedule exists */}
            {existingSchedule && (
              <div className="flex bg-sand/30 dark:bg-sand/10 p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setMode('schedule')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    mode === 'schedule' ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm' : 'text-earth dark:text-sand'
                  }`}
                >
                  {t('pickup.reschedule', 'Update Timing')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('confirm')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    mode === 'confirm' ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm' : 'text-earth dark:text-sand'
                  }`}
                >
                  {t('pickup.enterPin', 'Verify PIN')}
                </button>
              </div>
            )}

            {mode === 'confirm' ? (
              /* PIN Verification Form */
              <div className="space-y-4 py-2">
                <div className="p-4 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 text-center space-y-2">
                  <KeyRound className="w-8 h-8 text-olive dark:text-sage mx-auto" />
                  <h4 className="text-sm font-semibold text-bark dark:text-warm-white">
                    {t('pickup.enterPinHeading', 'Enter 4-Digit Pickup PIN')}
                  </h4>
                  <p className="text-xs text-earth dark:text-sand/70">
                    Ask the collector or check your notification for the one-time secure exchange code.
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="e.g. 4821"
                    className="w-36 mx-auto text-center font-mono text-2xl tracking-widest font-bold bg-warm-white dark:bg-darkcard border-2 border-olive rounded-xl p-2 text-bark dark:text-warm-white focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              /* Scheduling Form */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-olive" />
                    {t('pickup.date', 'Pickup Date')}
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-terracotta" />
                    {t('pickup.window', 'Pickup Window')}
                  </label>
                  <select
                    value={timeWindow}
                    onChange={(e) => setTimeWindow(e.target.value)}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                  >
                    <option value="07:30 - 09:00">Early Morning (7:30 AM - 9:00 AM)</option>
                    <option value="09:00 - 11:30">Morning (9:00 AM - 11:30 AM)</option>
                    <option value="16:30 - 18:30">Evening Porch Window (4:30 PM - 6:30 PM)</option>
                    <option value="18:30 - 20:30">Night Handover (6:30 PM - 8:30 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-olive" />
                    {t('pickup.locationStyle', 'Pickup Style')}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'PORCH_BOX', label: 'Porch Drop Box' },
                      { id: 'GATE', label: 'Front Gate' },
                      { id: 'COMMUNITY_BENCH', label: 'Garden Bench' },
                      { id: 'DIRECT_HANDOVER', label: 'Direct Handover' }
                    ].map((tStyle) => (
                      <button
                        key={tStyle.id}
                        type="button"
                        onClick={() => setPickupType(tStyle.id)}
                        className={`p-2 rounded-xl border text-center transition-colors ${
                          pickupType === tStyle.id
                            ? 'bg-olive text-warm-white border-olive font-semibold'
                            : 'bg-warm-white dark:bg-darkcard border-sand dark:border-sand/30 text-earth dark:text-sand/80'
                        }`}
                      >
                        {tStyle.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                    {t('pickup.notes', 'Directions / Porch Notes')}
                  </label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder={t('pickup.notesPlaceholder', 'e.g. Produce will be placed in the brown wicker basket by the verandah.')}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-earth dark:text-sand hover:text-bark dark:hover:text-warm-white transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-olive hover:bg-olive/90 text-warm-white text-sm font-medium rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {loading ? t('common.submitting', 'Processing...') : mode === 'confirm' ? t('pickup.verifyButton', 'Verify & Complete') : t('pickup.saveSchedule', 'Set Pickup Window')}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default PickupScheduleModal;
