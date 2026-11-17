import React, { useState, useEffect } from 'react';
import { 
  User, Settings, ShieldCheck, MapPin, Phone, Mail, 
  Sprout, Star, Heart, Award, KeyRound, Globe2, Edit3 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import EditProfileModal from '../../components/user/modals/EditProfileModal';
import ListingsTab from '../../components/user/dashboard/ListingsTab';
import ImpactCard from '../../components/user/dashboard/ImpactCard';
import { useTranslation } from '../../hooks/user/useTranslation';
import { userService } from '../../services/user/userService';
import { productService } from '../../services/user/productService';
import { reviewService } from '../../services/user/reviewService';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'reviews', 'impact'
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const uRes = await userService.getCurrentUser().catch(() => null);
      const user = uRes?.user || uRes?.data || uRes;
      setProfile(user);

      const prodRes = await productService.getMyProducts().catch(() => []);
      setListings(prodRes?.products || prodRes?.data || (Array.isArray(prodRes) ? prodRes : []));

      const revRes = await reviewService.getUserReviews(user?._id || user?.id).catch(() => []);
      setReviews(revRes?.reviews || revRes?.data || (Array.isArray(revRes) ? revRes : []));

      const impRes = await userService.getSustainabilityImpact().catch(() => null);
      setImpactData(impRes?.impact || impRes?.data || impRes);
    } catch (err) {
      console.warn('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Card */}
        <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-olive/15 text-olive dark:text-sage font-serif font-bold text-3xl flex items-center justify-center border-4 border-sand/40 dark:border-sand/15 shrink-0">
                {(profile?.name || 'G').charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-bark dark:text-warm-white">
                    {profile?.name || 'Local Community Grower'}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-olive shrink-0" title="Verified Neighbourhood Member" />
                </div>

                <div className="text-sm font-semibold text-olive dark:text-sage">
                  {profile?.gardenName || 'Backyard Garden & Terrace Homestead'}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-earth dark:text-sand/70 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-terracotta" />
                    {profile?.location?.address || 'Panampilly Nagar, Kochi'}
                  </span>
                  {profile?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-olive" />
                      {profile.phone}
                    </span>
                  )}
                  {profile?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-sand" />
                      {profile.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditModalOpen(true)}
              className="px-4 py-2 border border-sand dark:border-sand/30 hover:bg-sand/20 text-xs font-semibold text-bark dark:text-warm-white rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-olive" />
              <span>Edit Profile</span>
            </button>
          </div>

          {profile?.bio && (
            <div className="mt-6 pt-6 border-t border-sand/30 dark:border-sand/15 text-xs text-bark/90 dark:text-warm-white/90 leading-relaxed font-sans">
              <strong className="block text-earth dark:text-sand/70 font-mono uppercase text-[10px] mb-1">
                Garden Bio & Ethos
              </strong>
              "{profile.bio}"
            </div>
          )}

          {/* Porch Box Hub Pill */}
          <div className="mt-4 p-3 bg-cream/50 dark:bg-bark/30 rounded-2xl border border-sand/40 dark:border-sand/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-olive" />
              <span className="text-earth dark:text-sand/80">
                Contactless Porch Drop Box Status: <strong className="text-olive dark:text-sage">Active & Verified</strong>
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-bark dark:text-warm-white bg-sand/30 dark:bg-sand/10 px-2.5 py-0.5 rounded-full">
              4-Digit PIN Security
            </span>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-b border-sand/30 dark:border-sand/10 gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'text-olive dark:text-sage font-bold border-b-2 border-olive dark:border-sage'
                : 'text-earth dark:text-sand hover:text-bark'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Garden Listings ({listings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'text-olive dark:text-sage font-bold border-b-2 border-olive dark:border-sage'
                : 'text-earth dark:text-sand hover:text-bark'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span>Neighbour Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'impact'
                ? 'text-olive dark:text-sage font-bold border-b-2 border-olive dark:border-sage'
                : 'text-earth dark:text-sand hover:text-bark'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Ecological Stewardship</span>
          </button>
        </div>

        {/* Tab 1: Listings */}
        {activeTab === 'listings' && (
          <ListingsTab
            listings={listings}
            loading={loading}
            onToggleStatus={async (item, newStatus) => {
              await productService.toggleProductStatus(item._id || item.id, newStatus);
              loadProfile();
            }}
            onDeleteListing={async (id) => {
              if (!window.confirm('Delete listing?')) return;
              await productService.deleteProduct(id);
              loadProfile();
            }}
          />
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="p-12 text-center bg-cream/30 dark:bg-bark/20 rounded-3xl border border-dashed border-sand dark:border-sand/20 space-y-2">
                <Star className="w-10 h-10 text-amber-400/40 mx-auto" />
                <h4 className="text-sm font-serif font-bold text-bark dark:text-warm-white">
                  No Reviews Yet
                </h4>
                <p className="text-xs text-earth dark:text-sand/70">
                  Reviews from neighbours after completed exchanges will be featured here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div
                    key={r._id || r.id}
                    className="p-5 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (r.rating || 5)
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-sand/40'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-earth/70 dark:text-sand/60">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                    <p className="text-xs text-bark/90 dark:text-warm-white/90 leading-relaxed italic">
                      "{r.comment}"
                    </p>

                    <div className="text-[11px] text-earth dark:text-sand/70 pt-1">
                      From: <strong className="text-bark dark:text-warm-white">{r.reviewer?.name || 'Neighbour'}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Impact */}
        {activeTab === 'impact' && (
          <ImpactCard impact={impactData} />
        )}

      </div>

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <EditProfileModal
          user={profile}
          isOpen={true}
          onClose={() => setEditModalOpen(false)}
          onSuccess={() => {
            setEditModalOpen(false);
            loadProfile();
          }}
        />
      )}
    </UserLayout>
  );
};

export default ProfilePage;
