import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, Upload, X, Sparkles, Scale, Heart, IndianRupee, 
  MapPin, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Feather, Mic 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import ListingGeneratorWidget from '../../components/user/ai/ListingGeneratorWidget';
import PriceSuggesterWidget from '../../components/user/ai/PriceSuggesterWidget';
import VoiceListingWidget from '../../components/user/ai/VoiceListingWidget';
import { useTranslation } from '../../hooks/user/useTranslation';
import { useGeolocation } from '../../hooks/user/useGeolocation';
import { productService } from '../../services/user/productService';

const CreateListingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { coordinates, location } = useGeolocation();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('vegetables');
  const [listingType, setListingType] = useState('SELL'); // SELL, BARTER, FREE
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(2);
  const [unit, setUnit] = useState('kg');
  const [description, setDescription] = useState('');
  const [isOrganic, setIsOrganic] = useState(true);
  const [barterFor, setBarterFor] = useState('');
  const [address, setAddress] = useState(location?.address || 'Panampilly Nagar, Kochi');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const [activeAITool, setActiveAITool] = useState(null); // 'story', 'price', 'voice'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed per listing.');
      return;
    }

    setImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Build FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('name', title);
      formData.append('category', category);
      formData.append('listingType', listingType);
      formData.append('type', listingType);
      formData.append('quantity', Number(quantity));
      formData.append('unit', unit);
      formData.append('description', description);
      formData.append('isOrganic', isOrganic);
      formData.append('organic', isOrganic);

      if (listingType === 'SELL' && price) {
        formData.append('price', Number(price));
      }
      if (listingType === 'BARTER' && barterFor) {
        formData.append('barterFor', barterFor);
      }

      // GeoJSON Location format: [lng, lat]
      const lng = coordinates ? coordinates[1] : 76.2999;
      const lat = coordinates ? coordinates[0] : 9.9674;
      formData.append('location', JSON.stringify({
        type: 'Point',
        coordinates: [lng, lat],
        address
      }));

      // Append image files
      images.forEach(imgFile => {
        formData.append('images', imgFile);
      });

      await productService.createProduct(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/workspace');
      }, 1500);
    } catch (err) {
      console.error('Failed to create listing:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to publish produce listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/40 dark:border-sand/15 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive/10 text-olive dark:text-sage text-xs font-semibold mb-2">
              <Sprout className="w-3.5 h-3.5" />
              <span>Neighbourhood Produce Exchange</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-bark dark:text-warm-white">
              {t('listing.createTitle', 'Share Your Garden Harvest')}
            </h1>
            <p className="text-xs text-earth dark:text-sand/70 mt-1">
              List backyard produce for purchase, fair barter trade, or free zero-waste community sharing
            </p>
          </div>

          {/* AI Assist Toolbar */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setActiveAITool(activeAITool === 'story' ? null : 'story')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeAITool === 'story'
                  ? 'bg-terracotta text-warm-white border-terracotta shadow-sm'
                  : 'bg-warm-white dark:bg-darkcard border-sand dark:border-sand/30 text-bark dark:text-warm-white hover:border-terracotta'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span>AI Story Writer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAITool(activeAITool === 'price' ? null : 'price')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeAITool === 'price'
                  ? 'bg-olive text-warm-white border-olive shadow-sm'
                  : 'bg-warm-white dark:bg-darkcard border-sand dark:border-sand/30 text-bark dark:text-warm-white hover:border-olive'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>APMC Price Helper</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAITool(activeAITool === 'voice' ? null : 'voice')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeAITool === 'voice'
                  ? 'bg-red-500 text-warm-white border-red-500 shadow-sm'
                  : 'bg-warm-white dark:bg-darkcard border-sand dark:border-sand/30 text-bark dark:text-warm-white hover:border-red-400'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Listing</span>
            </button>
          </div>
        </div>

        {/* AI Tool Drawer / Inset */}
        {activeAITool === 'story' && (
          <div className="animate-fade-in">
            <ListingGeneratorWidget
              onApplyToForm={(copy) => {
                if (copy.english) setDescription(copy.english);
                setActiveAITool(null);
              }}
            />
          </div>
        )}

        {activeAITool === 'price' && (
          <div className="animate-fade-in">
            <PriceSuggesterWidget
              onSelectPrice={(suggestedPrice) => {
                setPrice(suggestedPrice);
                setActiveAITool(null);
              }}
            />
          </div>
        )}

        {activeAITool === 'voice' && (
          <div className="animate-fade-in">
            <VoiceListingWidget
              onParsedListing={(p) => {
                if (p.crop) setTitle(p.crop);
                if (p.quantity) setQuantity(p.quantity);
                if (p.unit) setUnit(p.unit);
                if (p.price) setPrice(p.price);
                if (p.type) setListingType(p.type);
                setActiveAITool(null);
              }}
            />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-16 text-center space-y-4 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-3xl shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-olive dark:text-sage mx-auto animate-bounce" />
            <h3 className="text-2xl font-serif font-bold text-bark dark:text-warm-white">
              Produce Listed Successfully!
            </h3>
            <p className="text-xs text-earth dark:text-sand/80 max-w-sm mx-auto">
              Your harvest is now discoverable on the radar. Redirecting to your Garden Workspace...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Exchange Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-earth/80 dark:text-sand/70 font-mono">
                Exchange Mode *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setListingType('SELL')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    listingType === 'SELL'
                      ? 'bg-olive/10 border-olive ring-1 ring-olive text-bark dark:text-warm-white'
                      : 'bg-warm-white dark:bg-darkcard border-sand dark:border-sand/30 text-earth dark:text-sand hover:border-olive'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <IndianRupee className="w-4 h-4 text-olive" />
                    <span className="font-serif font-bold text-sm">Sell Produce</span>
                  </div>
                  <p className="text-[11px] text-earth/80 dark:text-sand/70">
                    Direct neighbour sale at fair APMC prices. Cash/UPI on pickup.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setListingType('BARTER')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    listingType === 'BARTER'
                      ? 'bg-terracotta/10 border-terracotta ring-1 ring-terracotta text-bark dark:text-warm-white'
                      : 'bg-warm-white dark:bg-darkcard border-sand dark:border-sand/30 text-earth dark:text-sand hover:border-terracotta'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-4 h-4 text-terracotta" />
                    <span className="font-serif font-bold text-sm">Barter Swap</span>
                  </div>
                  <p className="text-[11px] text-earth/80 dark:text-sand/70">
                    Trade crops without cash using our community parity scale.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setListingType('FREE')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    listingType === 'FREE'
                      ? 'bg-sage/20 border-sage ring-1 ring-sage text-bark dark:text-warm-white'
                      : 'bg-warm-white dark:bg-darkcard border-sand dark:border-sand/30 text-earth dark:text-sand hover:border-sage'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-sage" />
                    <span className="font-serif font-bold text-sm">Free Surplus</span>
                  </div>
                  <p className="text-[11px] text-earth/80 dark:text-sand/70">
                    Share bumper crops to eliminate garden waste and nourish neighbours.
                  </p>
                </button>
              </div>
            </div>

            {/* Core Produce Information */}
            <div className="p-6 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-3xl shadow-sm space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                    Produce Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Nendran Bananas, Red Spinach, Backyard Tapioca"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                  >
                    <option value="vegetables">Fresh Vegetables</option>
                    <option value="fruits">Backyard Fruits</option>
                    <option value="tubers">Tubers & Roots</option>
                    <option value="greens">Herbs & Greens</option>
                    <option value="seeds">Heirloom Seeds</option>
                    <option value="compost">Garden Compost</option>
                  </select>
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                    Available Quantity *
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                    Measurement Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                  >
                    <option value="kg">kg</option>
                    <option value="grams">grams</option>
                    <option value="bunches">bunches</option>
                    <option value="pieces">pieces</option>
                    <option value="basket">basket</option>
                  </select>
                </div>

                {listingType === 'SELL' ? (
                  <div>
                    <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                      Price per {unit} (₹) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 40"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                    />
                  </div>
                ) : listingType === 'BARTER' ? (
                  <div>
                    <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                      Desired Crops in Exchange
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Eggs, Bananas, Honey"
                      value={barterFor}
                      onChange={(e) => setBarterFor(e.target.value)}
                      className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
                    />
                  </div>
                ) : (
                  <div className="flex items-center pt-6">
                    <span className="text-xs font-semibold text-sage bg-sage/20 px-3 py-2 rounded-xl block w-full text-center">
                      Zero Cost • Free Surplus
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                  Harvest Story & Growing Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share how this was grown, when it was picked, compost fed, or unique cooking qualities..."
                  className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-3 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                />
              </div>

              {/* Pesticide Free Toggle */}
              <label className="flex items-center gap-3 p-3 bg-cream/40 dark:bg-bark/30 rounded-2xl border border-sand/40 dark:border-sand/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="rounded text-olive focus:ring-olive w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-semibold text-bark dark:text-warm-white block flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-olive" />
                    Pesticide-Free / 100% Organically Grown
                  </span>
                  <span className="text-earth dark:text-sand/70">
                    Confirm that no synthetic chemical sprays or inorganic pesticides were applied to this crop.
                  </span>
                </div>
              </label>

              {/* Approximate Location */}
              <div>
                <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                  Approximate Neighbourhood Area
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2.5 text-bark dark:text-warm-white pl-9 focus:outline-none focus:ring-1 focus:ring-olive"
                  />
                  <MapPin className="w-4 h-4 text-terracotta absolute left-3 top-3.5" />
                </div>
              </div>
            </div>

            {/* Produce Photos Upload */}
            <div className="p-6 bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-3xl shadow-sm space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-earth/80 dark:text-sand/70 font-mono">
                Produce Photographs (Up to 5)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-sand shadow-inner group">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-bark/70 text-warm-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {imagePreviews.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-sand dark:border-sand/30 hover:border-olive flex flex-col items-center justify-center p-3 cursor-pointer text-center text-earth dark:text-sand transition-colors">
                    <Upload className="w-5 h-5 mb-1 text-olive" />
                    <span className="text-[11px] font-medium">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-sm text-earth dark:text-sand hover:text-bark transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-olive hover:bg-olive/90 text-warm-white text-sm font-semibold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Publishing Listing...
                  </>
                ) : (
                  <>
                    <Sprout className="w-4 h-4" />
                    Publish Garden Produce
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </UserLayout>
  );
};

export default CreateListingPage;
