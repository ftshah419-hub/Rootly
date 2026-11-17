import L from 'leaflet';

// Create custom pin icons using SVG data URIs
const createPinIcon = (colorHex, badgeText = '') => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#282B24" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10.667 16 26 16 26s16-15.333 16-26C32 7.163 24.837 0 16 0z" fill="${colorHex}" filter="url(#shadow)"/>
      <circle cx="16" cy="15" r="7" fill="#FFFDF8"/>
      <circle cx="16" cy="15" r="4" fill="${colorHex}"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'rootly-custom-pin',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -38]
  });
};

export const MARKER_COLORS = {
  SELL: '#3E5035', // Olive (regular produce)
  BARTER: '#C8754D', // Terracotta (barter)
  FREE: '#A5AD91', // Sage (free produce)
  HARVEST: '#D4AF37', // Gold (upcoming harvest)
  USER: '#282B24' // Deep bark with blue dot (user location)
};

export const getProduceMarkerIcon = (exchangeType = 'SELL') => {
  const color = MARKER_COLORS[exchangeType] || MARKER_COLORS.SELL;
  return createPinIcon(color);
};

export const getUserLocationIcon = () => {
  const svg = `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: rgba(62, 80, 53, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 24px; height: 24px; border-radius: 9999px; background-color: #3E5035; border: 3px solid #FFFDF8; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
    </div>
  `;
  return L.divIcon({
    html: svg,
    className: 'rootly-user-loc-pin',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default {
  getProduceMarkerIcon,
  getUserLocationIcon,
  MARKER_COLORS
};
