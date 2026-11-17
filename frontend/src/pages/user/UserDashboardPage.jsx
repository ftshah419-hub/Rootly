import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, ShoppingBag, ArrowRightLeft, Calendar, Award, 
  Settings, User, Plus, RefreshCw, MapPin, ShieldCheck, Heart 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import DashboardStats from '../../components/user/dashboard/DashboardStats';
import ListingsTab from '../../components/user/dashboard/ListingsTab';
import RequestsTab from '../../components/user/dashboard/RequestsTab';
import PickupsTab from '../../components/user/dashboard/PickupsTab';
import ImpactCard from '../../components/user/dashboard/ImpactCard';
import EditProfileModal from '../../components/user/modals/EditProfileModal';
import PickupScheduleModal from '../../components/user/modals/PickupScheduleModal';
import { useTranslation } from '../../hooks/user/useTranslation';
import { userService } from '../../services/user/userService';
import { productService } from '../../services/user/productService';
import { exchangeService } from '../../services/user/exchangeService';
import { pickupService } from '../../services/user/pickupService';

const UserDashboardPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'listings', 'requests', 'pickups', 'impact'

  const [stats, setStats] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [scheduleModalExchange, setScheduleModalExchange] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [uRes, statRes, prodRes, reqRes, pickRes, impRes] = await Promise.all([
        userService.getCurrentUser().catch(() => null),
        userService.getDashboardMetrics().catch(() => ({})),
        productService.getMyProducts().catch(() => []),
        exchangeService.getExchangeRequests().catch(() => []),
        pickupService.getMyPickups().catch(() => []),
        userService.getSustainabilityImpact().catch(() => null)
      ]);

      setUserProfile(uRes?.user || uRes?.data || uRes);
      setStats(statRes?.metrics || statRes?.data || statRes || {});
      setListings(prodRes?.products || prodRes?.data || (Array.isArray(prodRes) ? prodRes : []));
      setRequests(reqRes?.requests || reqRes?.data || (Array.isArray(reqRes) ? reqRes : []));
      setPickups(pickRes?.pickups || pickRes?.data || (Array.isArray(pickRes) ? pickRes : []));
      setImpactData(impRes?.impact || impRes?.data || impRes);
    } catch (err) {
      console.warn('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (item, newStatus) => {
    try {
      await productService.toggleProductStatus(item._id || item.id, newStatus);
      loadDashboard();
    } catch (err) {
      alert('Failed to update listing status.');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await productService.deleteProduct(id);
      loadDashboard();
    } catch (err) {
      alert('Failed to delete listing.');
    }
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Header Card */}
        <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-olive/15 text-olive dark:text-sage font-serif font-bold text-2xl flex items-center justify-center border-2 border-olive/30 shrink-0">
              {(userProfile?.name || 'G').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-bark dark:text-warm-white">
                  {userProfile?.name || 'Local Community Grower'}
                </h1>
                <ShieldCheck className="w-5 h-5 text-olive" title="Verified Neighbourhood Member" />
              </div>
              <p className="text-xs text-earth dark:text-sand/70 mt-0.5">
                {userProfile?.gardenName || 'Backyard & Terrace Plot'} • {userProfile?.location?.address || 'Hyperlocal Kochi'}
              </p>
              {userProfile?.bio && (
                <p className="text-xs text-earth dark:text-sand/80 mt-1 line-clamp-1 italic">
                  "{userProfile.bio}"
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => setEditProfileOpen(true)}
              className="px-4 py-2 border border-sand dark:border-sand/30 hover:bg-sand/20 text-xs font-semibold text-bark dark:text-warm-white rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-olive" />
              <span>Edit Profile</span>
            </button>
            <Link
              to="/create-listing"
              className="px-4 py-2 bg-olive hover:bg-olive/90 text-warm-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Produce</span>
            </Link>
          </div>
        </div>

        {/* Real Metrics Counter Bar */}
        <DashboardStats stats={stats} />

        {/* Dashboard Tabs */}
        <div className="flex border-b border-sand/30 dark:border-sand/10 gap-6 text-sm font-medium overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: Sprout },
            { id: 'listings', label: `My Listings (${listings.length})`, icon: Sprout },
            { id: 'requests', label: `Exchanges (${requests.length})`, icon: ArrowRightLeft },
            { id: 'pickups', label: `Pickups & PINs (${pickups.length})`, icon: Calendar },
            { id: 'impact', label: 'Ecological Impact', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 transition-colors relative whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'text-olive dark:text-sage font-bold border-b-2 border-olive dark:border-sage'
                    : 'text-earth dark:text-sand hover:text-bark dark:hover:text-warm-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Active Listings Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
                    Active Garden Inventory
                  </h3>
                  <button
                    onClick={() => setActiveTab('listings')}
                    className="text-xs text-olive dark:text-sage font-medium hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>
                <ListingsTab
                  listings={listings.slice(0, 3)}
                  loading={loading}
                  onToggleStatus={handleToggleStatus}
                  onDeleteListing={handleDeleteListing}
                />
              </div>

              {/* Community Impact Card */}
              <ImpactCard impact={impactData} />
            </div>
          )}

          {activeTab === 'listings' && (
            <ListingsTab
              listings={listings}
              loading={loading}
              onToggleStatus={handleToggleStatus}
              onDeleteListing={handleDeleteListing}
            />
          )}

          {activeTab === 'requests' && (
            <RequestsTab
              requests={requests}
              currentUserId={userProfile?._id || userProfile?.id}
              loading={loading}
              onAcceptRequest={async (id) => {
                await exchangeService.updateExchangeStatus(id, 'ACCEPTED');
                loadDashboard();
              }}
              onRejectRequest={async (id) => {
                await exchangeService.updateExchangeStatus(id, 'REJECTED');
                loadDashboard();
              }}
              onCancelRequest={async (id) => {
                await exchangeService.updateExchangeStatus(id, 'CANCELLED');
                loadDashboard();
              }}
              onSchedulePickup={(req) => setScheduleModalExchange(req)}
              onOpenChat={(req) => {
                const partner = req.requester || req.seller || {};
                window.location.href = `/messages?recipient=${partner._id || partner.id}&product=${req.product?._id || req.product}`;
              }}
            />
          )}

          {activeTab === 'pickups' && (
            <PickupsTab
              pickups={pickups}
              loading={loading}
              onVerifyPin={(p) => setScheduleModalExchange(p.exchange || p)}
            />
          )}

          {activeTab === 'impact' && (
            <ImpactCard impact={impactData} />
          )}
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {editProfileOpen && (
        <EditProfileModal
          user={userProfile}
          isOpen={true}
          onClose={() => setEditProfileOpen(false)}
          onSuccess={() => {
            setEditProfileOpen(false);
            loadDashboard();
          }}
        />
      )}

      {/* SCHEDULE MODAL */}
      {scheduleModalExchange && (
        <PickupScheduleModal
          exchange={scheduleModalExchange}
          isOpen={true}
          onClose={() => setScheduleModalExchange(null)}
          onSuccess={() => {
            setScheduleModalExchange(null);
            loadDashboard();
          }}
        />
      )}
    </UserLayout>
  );
};

export default UserDashboardPage;
