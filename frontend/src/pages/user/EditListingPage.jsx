import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sprout, Save, ArrowLeft, Trash2, CheckCircle2, AlertCircle, RefreshCw 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import { useTranslation } from '../../hooks/user/useTranslation';
import { productService } from '../../services/user/productService';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('vegetables');
  const [listingType, setListingType] = useState('SELL');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('kg');
  const [description, setDescription] = useState('');
  const [isOrganic, setIsOrganic] = useState(true);
  const [barterFor, setBarterFor] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    setInitialLoading(true);
    try {
      const res = await productService.getProductById(id);
      const p = res?.product || res?.data || res;
      if (p) {
        setTitle(p.title || p.name || '');
        setCategory(typeof p.category === 'object' ? p.category.name : p.category || 'vegetables');
        setListingType(p.listingType || p.type || 'SELL');
        setPrice(p.price || '');
        setQuantity(p.quantity || 1);
        setUnit(p.unit || 'kg');
        setDescription(p.description || '');
        setIsOrganic(p.isOrganic ?? p.organic ?? true);
        setBarterFor(Array.isArray(p.barterFor) ? p.barterFor.join(', ') : p.barterFor || '');
        setStatus(p.status || 'ACTIVE');
      }
    } catch (err) {
      console.error('Failed to load listing for edit:', err);
      setError('Could not load listing details.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title,
        name: title,
        category,
        listingType,
        type: listingType,
        quantity: Number(quantity),
        unit,
        price: listingType === 'SELL' ? Number(price) : undefined,
        barterFor: listingType === 'BARTER' ? barterFor : undefined,
        description,
        isOrganic,
        organic: isOrganic,
        status
      };

      await productService.updateProduct(id, payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/workspace');
      }, 1500);
    } catch (err) {
      console.error('Update error:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to update listing.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <UserLayout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-olive animate-spin mx-auto" />
          <p className="text-xs text-earth dark:text-sand/80">Loading listing details...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-sand/40 dark:border-sand/15 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl border border-sand dark:border-sand/30 hover:bg-sand/20 text-earth dark:text-sand transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-bark dark:text-warm-white">
                Edit Garden Listing
              </h1>
              <p className="text-xs text-earth dark:text-sand/70">
                Update produce availability, quantity, pricing, or status
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-12 text-center space-y-3 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-3xl shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-olive dark:text-sage mx-auto animate-bounce" />
            <h3 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
              Listing Updated!
            </h3>
            <p className="text-xs text-earth dark:text-sand/80">
              Returning to workspace...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-3xl shadow-sm space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive font-mono"
                >
                  <option value="ACTIVE">ACTIVE (Visible on map)</option>
                  <option value="PAUSED">PAUSED (Temporarily hidden)</option>
                  <option value="SOLD_OUT">SOLD_OUT (Harvest depleted)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                >
                  <option value="kg">kg</option>
                  <option value="grams">grams</option>
                  <option value="bunches">bunches</option>
                  <option value="pieces">pieces</option>
                  <option value="basket">basket</option>
                </select>
              </div>

              {listingType === 'SELL' && (
                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                  />
                </div>
              )}
            </div>

            {listingType === 'BARTER' && (
              <div>
                <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                  Desired Barter Items
                </label>
                <input
                  type="text"
                  value={barterFor}
                  onChange={(e) => setBarterFor(e.target.value)}
                  className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                Description & Harvest Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-3 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand/40 dark:border-sand/15">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm text-earth dark:text-sand hover:text-bark transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-olive hover:bg-olive/90 text-warm-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>

          </form>
        )}

      </div>
    </UserLayout>
  );
};

export default EditListingPage;
