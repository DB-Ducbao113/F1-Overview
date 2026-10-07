import React, { useState, useEffect, useRef } from 'react';
import { CircuitData } from '../../types/circuit';
import { ExternalLink, Layers, Navigation, ZoomIn, ZoomOut, MapPin, Satellite } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export interface CircuitGeoCoords {
  lat: number;
  lng: number;
  zoom: number;
}

/**
 * Authentic GPS coordinates for every FIA Formula 1 World Championship circuit
 */
export const CIRCUIT_COORDINATES: Record<string, CircuitGeoCoords> = {
  'albert-park': { lat: -37.8497, lng: 144.968, zoom: 15 },
  shanghai: { lat: 31.3389, lng: 121.22, zoom: 15 },
  suzuka: { lat: 34.8431, lng: 136.541, zoom: 15 },
  bahrain: { lat: 26.0325, lng: 50.5106, zoom: 15 },
  miami: { lat: 25.9581, lng: -80.2389, zoom: 15 },
  monaco: { lat: 43.7347, lng: 7.4206, zoom: 16 },
  'gilles-villeneuve': { lat: 45.5, lng: -73.5228, zoom: 15 },
  catalunya: { lat: 41.57, lng: 2.2611, zoom: 15 },
  'red-bull-ring': { lat: 47.2197, lng: 14.7647, zoom: 15 },
  silverstone: { lat: 52.0786, lng: -1.0169, zoom: 15 },
  spa: { lat: 50.4372, lng: 5.9714, zoom: 14 },
  hungaroring: { lat: 47.5789, lng: 19.2486, zoom: 15 },
  zandvoort: { lat: 52.3888, lng: 4.5409, zoom: 15 },
  monza: { lat: 45.6156, lng: 9.2811, zoom: 15 },
  baku: { lat: 40.3725, lng: 49.8533, zoom: 15 },
  'marina-bay': { lat: 1.2914, lng: 103.864, zoom: 15 },
  cota: { lat: 30.1328, lng: -97.6411, zoom: 15 },
  'hermanos-rodriguez': { lat: 19.4042, lng: -99.0907, zoom: 15 },
  interlagos: { lat: -23.7036, lng: -46.6997, zoom: 15 },
  'las-vegas': { lat: 36.1147, lng: -115.168, zoom: 15 },
  lusail: { lat: 25.49, lng: 51.4542, zoom: 15 },
  'yas-marina': { lat: 24.4672, lng: 54.6031, zoom: 15 },
  sepang: { lat: 2.7608, lng: 101.738, zoom: 15 },
  madring: { lat: 40.6172, lng: -3.5856, zoom: 15 },
};

interface CircuitRealWorldMapProps {
  circuit: CircuitData;
  lang: 'vi' | 'en';
}

export const CircuitRealWorldMap: React.FC<CircuitRealWorldMapProps> = ({ circuit, lang }) => {
  const isVi = lang === 'vi';
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tileLayerRef = useRef<any>(null);

  const [mapType, setMapType] = useState<'satellite' | 'street'>('satellite');
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // Look up coordinates with graceful fallback to Albert Park
  const coords: CircuitGeoCoords = CIRCUIT_COORDINATES[circuit.id] || {
    lat: -37.8497,
    lng: 144.968,
    zoom: 15,
  };

  // Google Maps & OpenStreetMap direct links
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=${coords.zoom}/${coords.lat}/${coords.lng}`;

  useEffect(() => {
    let isCancelled = false;
    if (typeof window === 'undefined') return;

    // Dynamically load Leaflet to ensure 100% SSR and Vitest compatibility
    import('leaflet').then((L) => {
      if (isCancelled || !containerRef.current) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map instance
      const map = L.map(containerRef.current, {
        center: [coords.lat, coords.lng],
        zoom: coords.zoom,
        zoomControl: false, // We render custom high-tech themed zoom controls
        attributionControl: false,
        maxZoom: 19,
        minZoom: 3,
      });

      mapInstanceRef.current = map;

      // Set tile layer
      const esriSatelliteUrl =
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      const osmStreetUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const initialUrl = mapType === 'satellite' ? esriSatelliteUrl : osmStreetUrl;
      const initialLayer = L.tileLayer(initialUrl, {
        maxZoom: 19,
        attribution: 'Esri / OpenStreetMap',
      }).addTo(map);

      tileLayerRef.current = initialLayer;

      // Custom pulsing F1 Pin Marker
      const customPinIcon = L.divIcon({
        className: 'f1-live-pin-icon',
        html: `
          <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(255, 24, 1, 0.45); animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 30px; height: 30px; border-radius: 9999px; background: #e10600; border: 2.5px solid #ffffff; box-shadow: 0 0 14px rgba(225, 6, 0, 0.85); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-family: monospace; font-size: 11px;">
              F1
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([coords.lat, coords.lng], { icon: customPinIcon }).addTo(map);

      // Popup with track info
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; min-width: 190px; color: #111; padding: 4px;">
          <div style="font-size: 13px; font-weight: 800; color: #e10600; line-height: 1.2; margin-bottom: 3px;">
            ${circuit.circuitName}
          </div>
          <div style="font-size: 11px; color: #555; margin-bottom: 6px;">
            📍 ${circuit.city}, ${circuit.country}
          </div>
          <div style="font-size: 10px; font-mono: monospace; background: #f3f4f6; padding: 3px 6px; border-radius: 4px; margin-bottom: 6px;">
            GPS: ${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°
          </div>
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; font-size: 10px; font-weight: 700; color: #2563eb; text-decoration: none;">
            Mở trên Google Maps ↗
          </a>
        </div>
      `;
      marker.bindPopup(popupHtml);

      // Invalidate size to guarantee perfect layout inside modal
      setTimeout(() => {
        if (!isCancelled && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          setIsMapReady(true);
        }
      }, 150);
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [circuit.id, coords.lat, coords.lng, coords.zoom, googleMapsUrl]);

  // Handle Map Type Switch (Satellite vs Street)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const esriSatelliteUrl =
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      const osmStreetUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const nextUrl = mapType === 'satellite' ? esriSatelliteUrl : osmStreetUrl;
      const nextLayer = L.tileLayer(nextUrl, {
        maxZoom: 19,
        attribution: 'Esri / OpenStreetMap',
      }).addTo(mapInstanceRef.current);

      tileLayerRef.current = nextLayer;
    });
  }, [mapType]);

  // Zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([coords.lat, coords.lng], coords.zoom);
    }
  };

  return (
    <div className="relative rounded-2xl bg-studio-950 border border-studio-800/80 overflow-hidden flex flex-col min-h-[300px] sm:min-h-[340px] shadow-2xl">
      {/* Interactive Map Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[300px] sm:h-[340px] z-0 bg-studio-950 relative"
      />

      {/* Loading overlay while tiles initialize */}
      {!isMapReady && (
        <div className="absolute inset-0 bg-studio-950/80 backdrop-blur-xs flex items-center justify-center pointer-events-none z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-studio-400">
            <span className="w-2 h-2 rounded-full bg-f1red animate-ping" />
            <span>{isVi ? 'Đang tải bản đồ thực địa...' : 'Loading satellite map...'}</span>
          </div>
        </div>
      )}

      {/* Top Floating Controls Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Layer Mode Switcher: Satellite vs Street */}
        <div className="flex items-center bg-studio-950/90 backdrop-blur-md p-1 rounded-xl border border-studio-800 shadow-lg">
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-f1red text-white shadow-md'
                : 'text-studio-400 hover:text-white hover:bg-studio-800/60'
            }`}
            title={isVi ? 'Ảnh vệ tinh thực tế độ nét cao' : 'High-res Satellite View'}
          >
            <Satellite className="w-3 h-3" />
            <span>{isVi ? 'Vệ Tinh' : 'Satellite'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMapType('street')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mapType === 'street'
                ? 'bg-f1red text-white shadow-md'
                : 'text-studio-400 hover:text-white hover:bg-studio-800/60'
            }`}
            title={isVi ? 'Bản đồ giao thông địa hình' : 'Street & Road Map'}
          >
            <Layers className="w-3 h-3" />
            <span>{isVi ? 'Địa Hình' : 'Street'}</span>
          </button>
        </div>

        {/* GPS Coordinates Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-studio-950/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-studio-800 text-[10px] font-mono text-studio-300 shadow-lg">
          <MapPin className="w-3 h-3 text-f1red" />
          <span>
            {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
          </span>
        </div>
      </div>

      {/* Right Floating Map Navigation Controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col items-center gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={handleResetCenter}
          className="p-2 rounded-xl bg-studio-950/90 hover:bg-studio-800 text-studio-300 hover:text-white border border-studio-800 shadow-lg backdrop-blur-md transition-all cursor-pointer"
          title={isVi ? 'Căn giữa lại trường đua' : 'Recenter Circuit'}
        >
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
        </button>

        <div className="flex flex-col rounded-xl bg-studio-950/90 border border-studio-800 shadow-lg backdrop-blur-md overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 hover:bg-studio-800 text-studio-300 hover:text-white border-b border-studio-800/80 transition-colors cursor-pointer"
            title={isVi ? 'Phóng to' : 'Zoom In'}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 hover:bg-studio-800 text-studio-300 hover:text-white transition-colors cursor-pointer"
            title={isVi ? 'Thu nhỏ' : 'Zoom Out'}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Links Bar */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 pointer-events-auto">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded-xl bg-studio-950/90 hover:bg-studio-800 text-studio-300 hover:text-white border border-studio-800 text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg backdrop-blur-md transition-all"
        >
          <span>Google Maps</span>
          <ExternalLink className="w-2.5 h-2.5 text-studio-400" />
        </a>

        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xs:flex px-2.5 py-1 rounded-xl bg-studio-950/90 hover:bg-studio-800 text-studio-300 hover:text-white border border-studio-800 text-[10px] font-mono font-bold items-center gap-1 shadow-lg backdrop-blur-md transition-all"
        >
          <span>OpenStreetMap</span>
          <ExternalLink className="w-2.5 h-2.5 text-studio-400" />
        </a>
      </div>
    </div>
  );
};
