import React from 'react';
import { Calendar, Clock, MapPin, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const PickupsTab = ({ pickups = [], onVerifyPin, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2].map(n => (
          <div key={n} className="h-24 bg-sand/20 dark:bg-sand/10 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (pickups.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-cream/30 dark:bg-bark/20 rounded-2xl border border-dashed border-sand dark:border-sand/20 space-y-2">
        <Calendar className="w-10 h-10 text-olive/40 mx-auto" />
        <h4 className="text-sm font-serif font-bold text-bark dark:text-warm-white">
          {t('pickup.noPickups', 'No Scheduled Porch Pickups Right Now')}
        </h4>
        <p className="text-xs text-earth dark:text-sand/70 max-w-sm mx-auto">
          {t('pickup.noPickupsDesc', 'Once an exchange request is accepted, coordinate a convenient contactless porch box pickup window with 4-digit verification code.')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pickups.map((p) => {
        const isCompleted = p.status === 'COMPLETED';
        const isScheduled = p.status === 'SCHEDULED' || p.status === 'CONFIRMED';
        const exchange = p.exchange || {};
        const product = exchange.product || {};

        return (
          <div
            key={p._id || p.id}
            className="p-4 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-sand/30 dark:border-sand/15">
              <div>
                <span className="text-[10px] font-mono uppercase text-earth/80 dark:text-sand/70 block">
                  {p.type === 'PORCH_BOX' ? 'Contactless Porch Drop Box' : p.type === 'GATE' ? 'Front Gate Handover' : 'Garden Pickup'}
                </span>
                <h5 className="font-semibold text-sm text-bark dark:text-warm-white">
                  {product.title || product.name || 'Produce Exchange'}
                </h5>
              </div>

              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full self-start sm:self-center ${
                isCompleted ? 'bg-sage/30 text-bark dark:text-sage' : 'bg-olive/15 text-olive dark:text-sage'
              }`}>
                {p.status || 'SCHEDULED'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-earth dark:text-sand/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-olive" />
                <span>{new Date(p.date || p.scheduledDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-terracotta" />
                <span>{p.timeWindow || 'Evening Window'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-olive" />
                <span className="truncate">{p.location?.address || 'Porch drop box'}</span>
              </div>
            </div>

            {/* PIN Code Box & Completion */}
            <div className="p-3 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-olive dark:text-sage" />
                <div>
                  <span className="text-[10px] text-earth/70 dark:text-sand/60 block uppercase font-mono">
                    Exchange Verification PIN
                  </span>
                  <span className="font-mono text-base font-bold tracking-wider text-bark dark:text-warm-white">
                    {p.pin || p.code || '4821'}
                  </span>
                </div>
              </div>

              {!isCompleted && (
                <button
                  type="button"
                  onClick={() => onVerifyPin?.(p)}
                  className="px-3.5 py-1.5 bg-olive hover:bg-olive/90 text-warm-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Verify Handover
                </button>
              )}
            </div>

            {p.notes && (
              <p className="text-xs text-earth dark:text-sand/70 italic">
                Note: "{p.notes}"
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PickupsTab;
