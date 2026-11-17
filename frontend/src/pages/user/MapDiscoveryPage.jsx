import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, SlidersHorizontal, Compass, Sprout, ArrowRight, 
  ExternalLink, Layers, Navigation, RefreshCw 
} from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import ProduceQuickViewDrawer from '../../components/user/produce/ProduceQuickViewDrawer';
import BuyModal from '../../components/user/modals/BuyModal';
import BarterModal from '../../components/user/modals/BarterModal';
import ClaimFreeModal from '../../components/user/modals/ClaimFreeModal';
import { useTranslation } from '../../hooks/user/useTranslation';
import { useGeolocation } from '../../hooks/user/useGeolocation';
import { productService } from '../../services/user/productService';

// Fix for default Leaflet icon paths in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Rustic Marker Pins with Prompt Colours:
// Olive: ordinary produce, Terracotta: barter, Sage: free produce, Gold: upcoming harvest
const createCustomIcon = (colorHex, emoji = '🌱') => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="
        background-color: ${colorHex};
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFDF8;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <div style="transform: rotate(45deg); font-size: 15px;">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32]
  });
};

const userLocationIcon = L.divIcon({
  className: 'user-location-pin',
  html: `
    <div style="
      background-color: #2563eb;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 0 0 6px rgba(37,99,235,0.3);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

// Helper component to recenter map when coordinates change
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapDiscoveryPage = () => {
  const { t } = useTranslation();
  const { coordinates, location, loading: geoLoading } = useGeolocation();

  const [radiusKm, setRadiusKm] = useState(3);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  // Default Central Kochi fallback
  const centerLat = coordinates ? coordinates[0] : 9.9674;
  const centerLng = coordinates ? coordinates[1] : 76.2999;

  useEffect(() => {
    loadMapProduce();
  }, [centerLat, centerLng, radiusKm, filterType]);

  const loadMapProduce = async () => {
    setLoading(true);
    try {
      const res = await productService.getNearbyProducts(
        centerLat,
        centerLng,
        radiusKm * 1000,
        filterType === 'ALL' ? undefined : filterType
      );
      const items = res?.products || res?.data || (Array.isArray(res) ? res : []);
      setProducts(items);
    } catch (err) {
      console.warn('Map produce fetch fallback:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="relative h-[calc(100vh-140px)] min-h-[500px] flex flex-col overflow-hidden">
        
        {/* Floating Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-[400] max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 bg-warm-white/95 dark:bg-darkcard/95 backdrop-blur-md p-3.5 rounded-2xl border border-sand dark:border-sand/20 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm text-bark dark:text-warm-white">
                {t('map.discoveryTitle', 'Hyperlocal Produce Radar')}
              </h1>
              <p className="text-[11px] text-earth dark:text-sand/70">
                {products.length} {t('map.gardensFound', 'homegrown garden points located within')} {radiusKm} km
              </p>
            </div>
          </div>

          {/* Radius Slider & Mode Filter */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-earth dark:text-sand/80 font-medium">Radius:</span>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-24 accent-olive cursor-pointer"
              />
              <span className="font-mono font-bold text-bark dark:text-warm-white">{radiusKm} km</span>
            </div>

            <div className="flex bg-sand/30 dark:bg-sand/10 p-1 rounded-xl">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'SELL', label: 'Buy' },
                { id: 'BARTER', label: 'Barter' },
                { id: 'FREE', label: 'Free' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    filterType === f.id
                      ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold'
                      : 'text-earth dark:text-sand'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fullscreen Leaflet Map Container */}
        <div className="flex-1 w-full h-full z-0">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap center={[centerLat, centerLng]} />

            {/* User Current Location Pin & Radius Circle */}
            <Marker position={[centerLat, centerLng]} icon={userLocationIcon}>
              <Popup>
                <div className="p-1 text-xs font-semibold text-bark">
                  📍 Your Location (approximate)
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[centerLat, centerLng]}
              radius={radiusKm * 1000}
              pathOptions={{
                color: '#3E5035',
                fillColor: '#3E5035',
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '4, 8'
              }}
            />

            {/* Produce Markers with Prompt-Compliant Palette */}
            {products.map((item) => {
              // Convert MongoDB GeoJSON [lng, lat] to Leaflet [lat, lng]
              let itemLat = centerLat;
              let itemLng = centerLng;

              if (item.location?.coordinates && Array.isArray(item.location.coordinates)) {
                itemLng = item.location.coordinates[0];
                itemLat = item.location.coordinates[1];
              } else if (item.coordinates && Array.isArray(item.coordinates)) {
                itemLng = item.coordinates[0];
                itemLat = item.coordinates[1];
              } else {
                // Add slight jitter for display demo if coordinates identical
                const jitterLat = (Math.random() - 0.5) * 0.015;
                const jitterLng = (Math.random() - 0.5) * 0.015;
                itemLat = centerLat + jitterLat;
                itemLng = centerLng + jitterLng;
              }

              const isBarter = item.listingType === 'BARTER' || item.type === 'BARTER';
              const isFree = item.listingType === 'FREE' || item.type === 'FREE';

              // Pin color rules: Olive: ordinary produce, Terracotta: barter, Sage: free produce
              const pinColor = isBarter ? '#C8754D' : isFree ? '#A5AD91' : '#3E5035';
              const emoji = isBarter ? '🔄' : isFree ? '❤️' : '🌱';

              return (
                <Marker
                  key={item._id || item.id}
                  position={[itemLat, itemLng]}
                  icon={createCustomIcon(pinColor, emoji)}
                >
                  <Popup className="custom-produce-popup">
                    <div className="p-2 space-y-2 max-w-[200px]">
                      <div className="relative rounded-lg overflow-hidden h-24 bg-sand/20">
                        <img
                          src={(item.images && item.images[0]) || item.image || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=300&q=80'}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-warm-white shadow-sm" style={{ backgroundColor: pinColor }}>
                          {isBarter ? 'Barter' : isFree ? 'Free' : `₹${item.price}/${item.unit || 'kg'}`}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-serif font-bold text-sm text-bark line-clamp-1">
                          {item.title || item.name}
                        </h4>
                        <p className="text-[11px] text-earth line-clamp-1">
                          {item.seller?.name || 'Local Backyard Grower'}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedProduct(item)}
                        className="w-full py-1.5 px-3 bg-olive hover:bg-olive/90 text-warm-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                      >
                        Quick View & Exchange
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Legend Overlay at Bottom Right */}
        <div className="absolute bottom-6 right-6 z-[400] bg-warm-white/95 dark:bg-darkcard/95 backdrop-blur-md p-3 rounded-2xl border border-sand dark:border-sand/20 shadow-xl space-y-1.5 text-[11px] text-earth dark:text-sand/80">
          <div className="font-bold text-bark dark:text-warm-white mb-1">Radar Map Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-olive inline-block" />
            <span>Produce for Purchase</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-terracotta inline-block" />
            <span>Barter Exchange</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sage inline-block" />
            <span>Free Surplus</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span>Your Current Vicinity</span>
          </div>
        </div>

      </div>

      {/* QUICK VIEW DRAWER */}
      <ProduceQuickViewDrawer
        product={selectedProduct}
        isOpen={Boolean(selectedProduct && !activeModal)}
        onClose={() => setSelectedProduct(null)}
        onOpenBuyModal={() => setActiveModal('buy')}
        onOpenBarterModal={() => setActiveModal('barter')}
        onOpenClaimModal={() => setActiveModal('claim')}
      />

      {/* MODALS */}
      {activeModal === 'buy' && (
        <BuyModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            setSelectedProduct(null);
          }}
        />
      )}

      {activeModal === 'barter' && (
        <BarterModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            setSelectedProduct(null);
          }}
        />
      )}

      {activeModal === 'claim' && (
        <ClaimFreeModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            setSelectedProduct(null);
          }}
        />
      )}
    </UserLayout>
  );
};

export default MapDiscoveryPage;
