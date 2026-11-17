import React from 'react';
import { Scale, ArrowRightLeft, Check, X, MessageSquare, MapPin, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const BarterDeckCard = ({ 
  exchange, 
  onAccept, 
  onReject, 
  onCounter, 
  onChat, 
  isIncoming = true 
}) => {
  const { t } = useTranslation();

  if (!exchange) return null;

  const targetProduce = exchange.product || {};
  const offeredProduce = exchange.offeredProduct || exchange.offeredItemDetails || {};
  const requester = exchange.requester || exchange.user || {};
  const status = exchange.status || 'PENDING';

  const isPending = status === 'PENDING';
  const isAccepted = status === 'ACCEPTED';
  const isCompleted = status === 'COMPLETED';
  const isRejected = status === 'REJECTED' || status === 'CANCELLED';

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-sand/40 dark:border-sand/15">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-mono text-earth dark:text-sand/70 block">
              {isIncoming ? t('barter.incomingProposal', 'Inbound Trade Proposal') : t('barter.outboundProposal', 'Your Sent Proposal')}
            </span>
            <span className="text-sm font-semibold text-bark dark:text-warm-white">
              {isIncoming ? requester.name || t('common.neighbour', 'Neighbour') : t('barter.sentToGrower', 'To Grower')}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isPending && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t('status.pending', 'Pending Approval')}
            </span>
          )}
          {isAccepted && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-olive/15 text-olive dark:text-sage flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {t('status.accepted', 'Trade Accepted')}
            </span>
          )}
          {isCompleted && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sage/30 text-bark dark:text-sage flex items-center gap-1">
              <Check className="w-3 h-3" />
              {t('status.completed', 'Exchanged')}
            </span>
          )}
          {isRejected && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 flex items-center gap-1">
              <X className="w-3 h-3" />
              {t('status.declined', 'Declined')}
            </span>
          )}
        </div>
      </div>

      {/* Trade Parity Visual Block */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center bg-cream/40 dark:bg-bark/30 p-4 rounded-xl border border-sand/30 dark:border-sand/10">
        
        {/* Desired / Target Item */}
        <div className="md:col-span-3 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-earth/80 dark:text-sand/70 block">
            {t('barter.askingProduce', 'Requested Produce')}
          </span>
          <div className="text-base font-serif font-bold text-bark dark:text-warm-white">
            {targetProduce.title || targetProduce.name || 'Garden Produce'}
          </div>
          <div className="text-xs text-olive dark:text-sage font-medium">
            {exchange.quantity || 1} {targetProduce.unit || 'kg'}
          </div>
        </div>

        {/* Center Exchange Icon */}
        <div className="md:col-span-1 flex justify-center py-2 md:py-0">
          <div className="w-9 h-9 rounded-full bg-sand/30 dark:bg-sand/10 flex items-center justify-center text-terracotta shadow-inner">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
        </div>

        {/* Offered Item */}
        <div className="md:col-span-3 space-y-1 md:text-right">
          <span className="text-[11px] font-bold uppercase tracking-wider text-earth/80 dark:text-sand/70 block">
            {t('barter.offeredCrop', 'Offered in Exchange')}
          </span>
          <div className="text-base font-serif font-bold text-bark dark:text-warm-white">
            {offeredProduce.title || offeredProduce.name || t('barter.customSurplus', 'Garden Surplus')}
          </div>
          <div className="text-xs text-terracotta font-medium">
            {offeredProduce.quantity || 1} {offeredProduce.unit || 'kg'}
          </div>
        </div>
      </div>

      {/* Trade Note */}
      {exchange.notes && (
        <div className="text-xs text-earth dark:text-sand/80 bg-sand/15 dark:bg-sand/5 p-3 rounded-xl italic">
          "{exchange.notes}"
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <button
          onClick={() => onChat?.(exchange)}
          className="text-xs font-medium text-olive dark:text-sage hover:underline flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {t('barter.discussTerms', 'Message Neighbour')}
        </button>

        <div className="flex items-center gap-2">
          {isIncoming && isPending && (
            <>
              <button
                onClick={() => onReject?.(exchange)}
                className="px-3 py-1.5 rounded-xl border border-sand dark:border-sand/30 hover:bg-sand/30 text-xs font-medium text-earth dark:text-sand transition-colors"
              >
                {t('barter.decline', 'Decline')}
              </button>
              <button
                onClick={() => onAccept?.(exchange)}
                className="px-4 py-1.5 rounded-xl bg-terracotta hover:bg-terracotta/90 text-warm-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                {t('barter.acceptTrade', 'Accept & Reveal PIN')}
              </button>
            </>
          )}

          {isAccepted && (
            <div className="flex items-center gap-2 text-xs font-mono bg-olive/10 dark:bg-olive/20 px-3 py-1.5 rounded-xl text-olive dark:text-sage">
              <span>{t('barter.porchPin', 'Porch PIN')}:</span>
              <strong className="font-bold text-sm tracking-wider">
                {exchange.pickupCode || exchange.pin || '4921'}
              </strong>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default BarterDeckCard;
