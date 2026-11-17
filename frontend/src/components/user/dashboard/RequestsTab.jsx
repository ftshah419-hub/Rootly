import React, { useState } from 'react';
import { ShoppingBag, Scale, Heart, Check, X, Clock, MessageSquare, Calendar, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const RequestsTab = ({ 
  requests = [], 
  currentUserId,
  onAcceptRequest, 
  onRejectRequest, 
  onCancelRequest,
  onSchedulePickup,
  onOpenChat,
  loading 
}) => {
  const { t } = useTranslation();
  const [filterMode, setFilterMode] = useState('incoming'); // 'incoming' or 'outgoing'

  const filteredRequests = requests.filter(r => {
    const isRequester = (r.requester?._id || r.requester?.id || r.requester) === currentUserId;
    return filterMode === 'incoming' ? !isRequester : isRequester;
  });

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map(n => (
          <div key={n} className="h-24 bg-sand/20 dark:bg-sand/10 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex bg-sand/30 dark:bg-sand/10 p-1 rounded-xl text-xs font-medium w-full sm:w-auto self-start inline-flex">
        <button
          onClick={() => setFilterMode('incoming')}
          className={`px-4 py-2 rounded-lg transition-all ${
            filterMode === 'incoming'
              ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold'
              : 'text-earth dark:text-sand'
          }`}
        >
          {t('dashboard.inboundRequests', 'Incoming from Neighbours')}
        </button>
        <button
          onClick={() => setFilterMode('outgoing')}
          className={`px-4 py-2 rounded-lg transition-all ${
            filterMode === 'outgoing'
              ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold'
              : 'text-earth dark:text-sand'
          }`}
        >
          {t('dashboard.outboundRequests', 'My Sent Requests')}
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 px-4 bg-cream/30 dark:bg-bark/20 rounded-2xl border border-dashed border-sand dark:border-sand/20 space-y-2">
          <ShoppingBag className="w-10 h-10 text-olive/40 mx-auto" />
          <h4 className="text-sm font-serif font-bold text-bark dark:text-warm-white">
            {filterMode === 'incoming'
              ? t('dashboard.noIncoming', 'No Incoming Requests at the Moment')
              : t('dashboard.noOutgoing', 'You Have Not Requested Any Produce Yet')}
          </h4>
          <p className="text-xs text-earth dark:text-sand/70 max-w-sm mx-auto">
            {filterMode === 'incoming'
              ? 'When neighbours request to buy, barter, or claim your garden produce, requests will appear here.'
              : 'Explore the nearby produce discovery map and connect with garden growers.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const product = req.product || {};
            const isPending = req.status === 'PENDING';
            const isAccepted = req.status === 'ACCEPTED';
            const isCompleted = req.status === 'COMPLETED';
            const isIncoming = filterMode === 'incoming';
            const counterParty = isIncoming ? req.requester : (req.seller || product.seller || {});

            return (
              <div
                key={req._id || req.id}
                className="p-4 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-sand/30 dark:border-sand/15">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      req.type === 'BARTER' ? 'bg-terracotta/15 text-terracotta' : req.type === 'FREE' ? 'bg-sage/30 text-bark dark:text-sage' : 'bg-olive/15 text-olive dark:text-sage'
                    }`}>
                      {req.type || 'BUY'}
                    </span>
                    <h5 className="font-semibold text-sm text-bark dark:text-warm-white">
                      {product.title || product.name || 'Produce Item'}
                    </h5>
                  </div>

                  <span className={`text-xs font-mono font-bold self-start sm:self-center px-2.5 py-0.5 rounded-full ${
                    isPending ? 'bg-amber-100 text-amber-800' : isAccepted ? 'bg-olive/15 text-olive dark:text-sage' : isCompleted ? 'bg-sage/30 text-bark' : 'bg-red-100 text-red-800'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-earth dark:text-sand/80">
                  <div className="space-y-1">
                    <div>
                      {isIncoming ? 'Requested by' : 'Offered to'}:{' '}
                      <strong className="text-bark dark:text-warm-white">
                        {counterParty?.name || 'Local Neighbour'}
                      </strong>
                    </div>
                    <div>
                      Requested: <strong className="font-mono text-bark dark:text-warm-white">{req.quantity || 1} {product.unit || 'kg'}</strong>
                      {product.price && req.type === 'BUY' && (
                        <span> (Est. ₹{Number(product.price) * Number(req.quantity || 1)})</span>
                      )}
                    </div>
                    {req.notes && (
                      <p className="italic text-earth/80 dark:text-sand/70 bg-sand/15 dark:bg-sand/5 p-2 rounded-lg">
                        "{req.notes}"
                      </p>
                    )}
                  </div>

                  {/* Action Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => onOpenChat?.(req)}
                      className="p-2 border border-sand dark:border-sand/30 hover:bg-sand/20 rounded-xl text-bark dark:text-warm-white text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-olive" />
                      <span>Message</span>
                    </button>

                    {isIncoming && isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => onRejectRequest?.(req._id || req.id)}
                          className="px-3 py-1.5 border border-red-200 dark:border-red-900/50 hover:bg-red-50 text-red-600 rounded-xl text-xs font-medium transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => onAcceptRequest?.(req._id || req.id)}
                          className="px-3.5 py-1.5 bg-olive hover:bg-olive/90 text-warm-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept Request
                        </button>
                      </>
                    )}

                    {!isIncoming && isPending && (
                      <button
                        type="button"
                        onClick={() => onCancelRequest?.(req._id || req.id)}
                        className="px-3 py-1.5 border border-sand hover:bg-sand/20 text-earth dark:text-sand rounded-xl text-xs font-medium transition-colors"
                      >
                        Cancel Request
                      </button>
                    )}

                    {isAccepted && (
                      <button
                        type="button"
                        onClick={() => onSchedulePickup?.(req)}
                        className="px-3.5 py-1.5 bg-olive/15 hover:bg-olive/25 text-olive dark:text-sage rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Porch Pickup & PIN
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RequestsTab;
