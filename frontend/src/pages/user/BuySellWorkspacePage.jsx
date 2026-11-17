import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Sprout, ArrowRightLeft, Calendar, Award, 
  CheckCircle, Clock, Plus, ShieldCheck, KeyRound, MessageSquare 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import ListingsTab from '../../components/user/dashboard/ListingsTab';
import RequestsTab from '../../components/user/dashboard/RequestsTab';
import PickupsTab from '../../components/user/dashboard/PickupsTab';
import PickupScheduleModal from '../../components/user/modals/PickupScheduleModal';
import ReviewModal from '../../components/user/modals/ReviewModal';
import { useTranslation } from '../../hooks/user/useTranslation';
import { productService } from '../../services/user/productService';
import { exchangeService } from '../../services/user/exchangeService';
import { pickupService } from '../../services/user/pickupService';
import { userService } from '../../services/user/userService';

const BuySellWorkspacePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('selling'); // 'selling' or 'buying'
  const [activeSubTab, setActiveSubTab] = useState('requests'); // 'requests', 'listings', 'pickups'

  const [myProducts, setMyProducts] = useState([]);
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [scheduleModalExchange, setScheduleModalExchange] = useState(null);
  const [reviewModalExchange, setReviewModalExchange] = useState(null);

  useEffect(() => {
    loadWorkspaceData();
  }, [activeTab]);

  const loadWorkspaceData = async () => {
    setLoading(true);
    try {
      const userRes = await userService.getCurrentUser().catch(() => null);
      const userObj = userRes?.user || userRes?.data || userRes;
      setCurrentUser(userObj);

      // Load listings
      const prodsRes = await productService.getMyProducts().catch(() => []);
      setMyProducts(prodsRes?.products || prodsRes?.data || (Array.isArray(prodsRes) ? prodsRes : []));

      // Load exchanges
      const exRes = await exchangeService.getExchangeRequests().catch(() => []);
      setExchangeRequests(exRes?.requests || exRes?.data || (Array.isArray(exRes) ? exRes : []));

      // Load pickups
      const pickRes = await pickupService.getMyPickups().catch(() => []);
      setPickups(pickRes?.pickups || pickRes?.data || (Array.isArray(pickRes) ? pickRes : []));
    } catch (err) {
      console.warn('Workspace loading fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await exchangeService.updateExchangeStatus(requestId, 'ACCEPTED');
      loadWorkspaceData();
    } catch (err) {
      alert('Failed to accept exchange request.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await exchangeService.updateExchangeStatus(requestId, 'REJECTED');
      loadWorkspaceData();
    } catch (err) {
      alert('Failed to decline exchange request.');
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await exchangeService.updateExchangeStatus(requestId, 'CANCELLED');
      loadWorkspaceData();
    } catch (err) {
      alert('Failed to cancel request.');
    }
  };

  const handleToggleStatus = async (item, newStatus) => {
    try {
      await productService.toggleProductStatus(item._id || item.id, newStatus);
      loadWorkspaceData();
    } catch (err) {
      alert('Failed to update listing status.');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to remove this garden listing?')) return;
    try {
      await productService.deleteProduct(id);
      loadWorkspaceData();
    } catch (err) {
      alert('Failed to delete listing.');
    }
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Workspace Dual Role Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand/40 dark:border-sand/15 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-olive dark:text-sage font-bold">
                Unified Hyperlocal Account
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-bark dark:text-warm-white mt-1">
              Garden & Exchange Workspace
            </h1>
            <p className="text-xs text-earth dark:text-sand/70">
              Seamlessly toggle between sharing your harvest and collecting fresh produce from neighbours
            </p>
          </div>

          {/* Master Dual Role Switcher */}
          <div className="flex bg-sand/30 dark:bg-sand/10 p-1.5 rounded-2xl self-start md:self-center">
            <button
              onClick={() => { setActiveTab('selling'); setActiveSubTab('requests'); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'selling'
                  ? 'bg-olive text-warm-white shadow-md'
                  : 'text-earth dark:text-sand hover:text-bark dark:hover:text-warm-white'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>Growing & Sharing</span>
            </button>

            <button
              onClick={() => { setActiveTab('buying'); setActiveSubTab('requests'); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'buying'
                  ? 'bg-terracotta text-warm-white shadow-md'
                  : 'text-earth dark:text-sand hover:text-bark dark:hover:text-warm-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Collecting</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex border-b border-sand/30 dark:border-sand/10 gap-6 text-sm font-medium">
          {activeTab === 'selling' && (
            <button
              onClick={() => setActiveSubTab('listings')}
              className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
                activeSubTab === 'listings'
                  ? 'text-olive dark:text-sage font-bold border-b-2 border-olive dark:border-sage'
                  : 'text-earth dark:text-sand hover:text-bark'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>Garden Listings ({myProducts.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveSubTab('requests')}
            className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
              activeSubTab === 'requests'
                ? 'text-olive dark:text-sage font-bold border-b-2 border-olive dark:border-sage'
                : 'text-earth dark:text-sand hover:text-bark'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>
              {activeTab === 'selling' ? 'Inbound Requests' : 'Outbound Orders'}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('pickups')}
            className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
              activeSubTab === 'pickups'
                ? 'text-olive dark:text-sage font-bold border-b-2 border-olive dark:border-sage'
                : 'text-earth dark:text-sand hover:text-bark'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Porch Pickups & PINs ({pickups.length})</span>
          </button>
        </div>

        {/* Tab View Content */}
        <div className="pt-2">
          {activeSubTab === 'listings' && activeTab === 'selling' && (
            <ListingsTab
              listings={myProducts}
              loading={loading}
              onToggleStatus={handleToggleStatus}
              onDeleteListing={handleDeleteListing}
            />
          )}

          {activeSubTab === 'requests' && (
            <RequestsTab
              requests={exchangeRequests}
              currentUserId={currentUser?._id || currentUser?.id}
              loading={loading}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              onCancelRequest={handleCancelRequest}
              onSchedulePickup={(req) => setScheduleModalExchange(req)}
              onOpenChat={(req) => {
                const partner = req.requester || req.seller || {};
                window.location.href = `/messages?recipient=${partner._id || partner.id}&product=${req.product?._id || req.product}`;
              }}
            />
          )}

          {activeSubTab === 'pickups' && (
            <PickupsTab
              pickups={pickups}
              loading={loading}
              onVerifyPin={(p) => setScheduleModalExchange(p.exchange || p)}
            />
          )}
        </div>

      </div>

      {/* SCHEDULE MODAL */}
      {scheduleModalExchange && (
        <PickupScheduleModal
          exchange={scheduleModalExchange}
          isOpen={true}
          onClose={() => setScheduleModalExchange(null)}
          onSuccess={() => {
            setScheduleModalExchange(null);
            loadWorkspaceData();
          }}
        />
      )}

      {/* REVIEW MODAL */}
      {reviewModalExchange && (
        <ReviewModal
          exchange={reviewModalExchange}
          isOpen={true}
          onClose={() => setReviewModalExchange(null)}
          onSuccess={() => {
            setReviewModalExchange(null);
            loadWorkspaceData();
          }}
        />
      )}
    </UserLayout>
  );
};

export default BuySellWorkspacePage;
