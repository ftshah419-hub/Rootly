import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, PauseCircle, PlayCircle, Sprout, ExternalLink, Check } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const ListingsTab = ({ listings = [], onToggleStatus, onDeleteListing, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map(n => (
          <div key={n} className="h-20 bg-sand/20 dark:bg-sand/10 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-cream/30 dark:bg-bark/20 rounded-2xl border border-dashed border-sand dark:border-sand/20 space-y-3">
        <Sprout className="w-12 h-12 text-olive/40 mx-auto" />
        <h4 className="text-base font-serif font-bold text-bark dark:text-warm-white">
          {t('dashboard.noListings', 'No Produce Listed Yet')}
        </h4>
        <p className="text-xs text-earth dark:text-sand/70 max-w-sm mx-auto">
          {t('dashboard.noListingsDesc', 'Share surplus vegetables, backyard fruits, herbs, or native seeds with neighbours around you.')}
        </p>
        <Link
          to="/create-listing"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-olive hover:bg-olive/90 text-warm-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          {t('dashboard.createFirstListing', 'Add Your First Produce Listing')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <h4 className="text-sm font-semibold text-bark dark:text-warm-white">
          {t('dashboard.allListingsCount', 'Your Garden Listings')} ({listings.length})
        </h4>
        <Link
          to="/create-listing"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-olive hover:bg-olive/90 text-warm-white text-xs font-medium rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('common.addProduce', 'New Listing')}
        </Link>
      </div>

      <div className="divide-y divide-sand/30 dark:divide-sand/10 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl overflow-hidden shadow-sm">
        {listings.map((item) => {
          const isPaused = item.status === 'PAUSED' || item.status === 'INACTIVE';
          const isSold = item.status === 'SOLD_OUT';
          const image = (item.images && item.images[0]) || item.image || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=300&q=80';

          return (
            <div key={item._id || item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream/20 dark:hover:bg-bark/20 transition-colors">
              <div className="flex items-center gap-3.5">
                <img
                  src={image}
                  alt={item.title || item.name}
                  className="w-14 h-14 rounded-xl object-cover border border-sand/40 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-sm text-bark dark:text-warm-white">
                      {item.title || item.name}
                    </h5>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isPaused ? 'bg-amber-100 text-amber-800' : isSold ? 'bg-red-100 text-red-800' : 'bg-olive/15 text-olive dark:text-sage'
                    }`}>
                      {item.status || 'ACTIVE'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-earth dark:text-sand/70 mt-1">
                    <span>{item.quantity} {item.unit || 'kg'} available</span>
                    <span>•</span>
                    <span className="font-medium text-bark dark:text-warm-white">
                      {item.listingType === 'BARTER' ? 'Barter Trade' : item.listingType === 'FREE' ? 'Free Surplus' : `₹${item.price}/${item.unit || 'kg'}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onToggleStatus?.(item, isPaused ? 'ACTIVE' : 'PAUSED')}
                  title={isPaused ? 'Resume Listing' : 'Pause Listing'}
                  className="p-2 text-earth dark:text-sand hover:text-olive dark:hover:text-sage hover:bg-sand/20 rounded-lg transition-colors"
                >
                  {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                </button>

                <Link
                  to={`/edit-listing/${item._id || item.id}`}
                  title="Edit Listing"
                  className="p-2 text-earth dark:text-sand hover:text-terracotta hover:bg-sand/20 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <Link
                  to={`/products/${item._id || item.id}`}
                  title="View Public Page"
                  className="p-2 text-earth dark:text-sand hover:text-bark dark:hover:text-warm-white hover:bg-sand/20 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => onDeleteListing?.(item._id || item.id)}
                  title="Delete Listing"
                  className="p-2 text-earth dark:text-sand hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListingsTab;
