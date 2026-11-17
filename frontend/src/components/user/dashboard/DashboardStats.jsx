import React from 'react';
import { Sprout, ShoppingBag, Scale, CheckCircle2, Award, Heart } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const DashboardStats = ({ stats = {} }) => {
  const { t } = useTranslation();

  const statItems = [
    {
      id: 'listings',
      label: t('dashboard.activeListings', 'Active Garden Produce'),
      value: stats.activeListingsCount ?? stats.productsCount ?? 0,
      icon: Sprout,
      color: 'text-olive dark:text-sage',
      bg: 'bg-olive/10 dark:bg-olive/20'
    },
    {
      id: 'requests',
      label: t('dashboard.pendingRequests', 'Pending Inbound Requests'),
      value: stats.pendingRequestsCount ?? stats.inboundPending ?? 0,
      icon: ShoppingBag,
      color: 'text-terracotta',
      bg: 'bg-terracotta/10 dark:bg-terracotta/20'
    },
    {
      id: 'barters',
      label: t('dashboard.activeSwaps', 'Active Barter Matches'),
      value: stats.activeBartersCount ?? stats.barterMatches ?? 0,
      icon: Scale,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-950/40'
    },
    {
      id: 'completed',
      label: t('dashboard.completedTrades', 'Completed Local Exchanges'),
      value: stats.completedExchangesCount ?? stats.completedCount ?? 0,
      icon: CheckCircle2,
      color: 'text-olive dark:text-sage',
      bg: 'bg-olive/15 dark:bg-olive/25'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="p-4 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-earth dark:text-sand/70 font-medium">
                {item.label}
              </span>
              <div className={`w-8 h-8 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-bark dark:text-warm-white">
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
