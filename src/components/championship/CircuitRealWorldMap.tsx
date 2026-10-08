import React, { useState, useEffect, useRef } from 'react';
import { CircuitData } from '../../types/circuit';
import { ExternalLink, Layers, Navigation, ZoomIn, ZoomOut, MapPin, Satellite, Info } from 'lucide-react';
import { generateCircuitGpsLayout } from '../../utils/circuitGpsHelper';
import 'leaflet/dist/leaflet.css';

export interface CircuitGeoCoords {
  lat: number;
  lng: number;
  zoom: number;
}

/**
 * Authentic GPS coordinates for every FIA Formula 1 World Championship circuit
 */
import { CIRCUIT_COORDINATES } from "./circuitCoordinates";


interface CircuitRealWorldMapProps {
  circuit: CircuitData;
  lang: 'vi' | 'en';
  heightClass?: string;
  className?: string;
}

export const CircuitRealWorldMap: React.FC<CircuitRealWorldMapProps> = ({
  circuit,
  lang,
  heightClass = 'h-[300px] sm:h-[340px]',
  className = '',
}) => {
  const isVi = lang === 'vi';
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tileLayerRef = useRef<any>(null);

  const [mapType, setMapType] = useState<'satellite' | 'street'>('satellite');
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [showLegend, setShowLegend] = useState<boolean>(true);

  // Look up coordinates with graceful fallback to Albert Park
  const coords: CircuitGeoCoords = CIRCUIT_COORDINATES[circuit.id] || {
    lat: -37.8497,
    lng: 144.968,
    zoom: 15,
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=${coords.zoom}/${coords.lat}/${coords.lng}`;

  useEffect(() => {
    let isCancelled = false;
    if (typeof window === 'undefined') return;

    // Dynamically load Leaflet for 100% SSR & test suite safety
    import('leaflet').then((L) => {
      if (isCancelled || !containerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map instance
      const map = L.map(containerRef.current, {
        center: [coords.lat, coords.lng],
        zoom: coords.zoom,
        zoomControl: false,
        attributionControl: false,
        maxZoom: 19,
        minZoom: 3,
      });

      mapInstanceRef.current = map;

      // Free Esri World Imagery (No API key required) & OSM fallback
      const esriSatelliteUrl =
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      const osmStreetUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const initialUrl = mapType === 'satellite' ? esriSatelliteUrl : osmStreetUrl;
      const initialLayer = L.tileLayer(initialUrl, {
        maxZoom: 19,
        attribution: 'Esri / OpenStreetMap',
      }).addTo(map);

      tileLayerRef.current = initialLayer;

      // Generate authentic real-world GPS track geometry, turns and DRS zones
      const layout = generateCircuitGpsLayout(circuit, coords);

      // ── 1. RED RACING TRACK POLYLINE ──
      // Base white kerb boundary
      L.polyline(layout.trackCoordinates, {
        color: '#ffffff',
        weight: 7,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Dark asphalt track bed
      L.polyline(layout.trackCoordinates, {
        color: '#0f172a',
        weight: 5.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Vivid F1 Red Racing Line
      const mainTrack = L.polyline(layout.trackCoordinates, {
        color: '#e10600',
        weight: 3.2,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      mainTrack.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 170px; padding: 3px;">
          <div style="font-size: 12px; font-weight: 800; color: #e10600; margin-bottom: 2px;">
            🏁 ${circuit.circuitName}
          </div>
          <div style="font-size: 10px; color: #475569;">
            ${isVi ? 'Chiều dài:' : 'Length:'} <strong>${circuit.telemetry?.circuitLengthKm} km</strong> · <strong>${circuit.telemetry?.turns?.total} ${isVi ? 'khúc cua' : 'turns'}</strong>
          </div>
        </div>
      `);

      // ── 2. VIVID GREEN DRS ZONES HIGHLIGHT ──
      layout.drsSegments.forEach((drs) => {
        const drsLine = L.polyline(drs.coordinates, {
          color: '#00e676',
          weight: 6,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        const drsPopup = `
          <div style="font-family: system-ui, sans-serif; min-width: 180px; padding: 3px;">
            <div style="font-size: 11px; font-weight: 900; color: #059669; text-transform: uppercase;">
              🟢 ${isVi ? drs.info.nameVi : drs.info.nameEn}
            </div>
            <div style="font-size: 10px; color: #475569; margin-top: 3px; line-height: 1.4;">
              <strong>${isVi ? 'Điểm đo:' : 'Detection:'}</strong> ${drs.info.detectionPoint}<br/>
              <strong>${isVi ? 'Kích hoạt:' : 'Activation:'}</strong> ${drs.info.activationPoint}
            </div>
          </div>
        `;
        drsLine.bindPopup(drsPopup);
      });

      // ── 3. CLICKABLE NUMBERED TURN MARKERS ──
      layout.turns.forEach((turn) => {
        const turnIcon = L.divIcon({
          className: 'f1-turn-marker',
          html: `
            <div style="
              width: 20px;
              height: 20px;
              background: #ffffff;
              border: 2px solid #e10600;
              border-radius: 9999px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 9px;
              font-weight: 900;
              color: #111827;
              box-shadow: 0 2px 5px rgba(0,0,0,0.45);
              cursor: pointer;
            ">
              ${turn.number}
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const turnMarker = L.marker([turn.lat, turn.lng], { icon: turnIcon }).addTo(map);

        const speedLabel = isVi
          ? turn.speedCategory === 'slow'
            ? 'Chậm'
            : turn.speedCategory === 'high'
            ? 'Tốc độ cao'
            : 'Trung bình'
          : turn.speedCategory;

        const turnPopup = `
          <div style="font-family: system-ui, sans-serif; min-width: 160px; padding: 3px;">
            <div style="font-size: 11px; font-weight: 900; color: #e10600;">
              Turn ${turn.number} · ${isVi ? turn.nameVi : turn.nameEn}
            </div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
              ${isVi ? 'Tốc độ:' : 'Speed:'} <strong>${speedLabel}</strong>
            </div>
          </div>
        `;
        turnMarker.bindPopup(turnPopup);
      });

      // ── 4. START / FINISH LINE MARKER ──
      const sfIcon = L.divIcon({
        className: 'f1-sf-marker',
        html: `
          <div style="
            background: #09090b;
            color: #ffffff;
            border: 1.5px solid #ffffff;
            border-radius: 6px;
            padding: 2px 5px;
            font-family: system-ui, sans-serif;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 3px;
            white-space: nowrap;
          ">
            <span>🏁</span>
            <span>${isVi ? 'XUẤT PHÁT' : 'START / FINISH'}</span>
          </div>
        `,
        iconSize: [84, 20],
        iconAnchor: [42, 10],
      });

      const sfMarker = L.marker(layout.startFinishCoord, { icon: sfIcon }).addTo(map);
      sfMarker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; font-size: 11px; padding: 2px;">
          <strong>🏁 ${isVi ? 'Vạch Xuất Phát & Về Đích' : 'Start / Finish Line'}</strong><br/>
          <span style="font-size: 10px; color: #64748b;">${circuit.circuitName}</span>
        </div>
      `);

      // Invalidate map size after DOM mount
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
  }, [circuit, coords.lat, coords.lng, coords.zoom, isVi]);

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

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([coords.lat, coords.lng], coords.zoom);
    }
  };

  return (
    <div className={`relative rounded-2xl bg-studio-950 border border-studio-800/80 overflow-hidden flex flex-col shadow-2xl ${className}`}>
      {/* Interactive Map Canvas Container */}
      <div
        ref={containerRef}
        className={`w-full ${heightClass} z-0 bg-studio-950 relative`}
      />

      {/* Loading overlay while tiles initialize */}
      {!isMapReady && (
        <div className="absolute inset-0 bg-studio-950/80 backdrop-blur-xs flex items-center justify-center pointer-events-none z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-studio-400">
            <span className="w-2 h-2 rounded-full bg-f1red animate-ping" />
            <span>{isVi ? 'Đang tải bản đồ vệ tinh...' : 'Loading satellite map...'}</span>
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
            title={isVi ? 'Ảnh vệ tinh thực tế độ nét cao (Esri)' : 'High-res Satellite View (Esri)'}
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

        {/* GPS Coordinates & Legend Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowLegend((prev) => !prev)}
            className="p-1.5 rounded-xl bg-studio-950/90 hover:bg-studio-800 text-studio-400 hover:text-white border border-studio-800 shadow-lg backdrop-blur-md text-[10px] flex items-center gap-1 cursor-pointer"
            title={isVi ? 'Bật/tắt chú thích bản đồ' : 'Toggle map legend'}
          >
            <Info className="w-3 h-3 text-studio-400" />
            <span className="hidden sm:inline font-mono">{isVi ? 'Chú Thích' : 'Legend'}</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 bg-studio-950/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-studio-800 text-[10px] font-mono text-studio-300 shadow-lg">
            <MapPin className="w-3 h-3 text-f1red" />
            <span>
              {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
            </span>
          </div>
        </div>
      </div>

      {/* Floating Map Legend (Bottom Left) */}
      {showLegend && (
        <div className="absolute bottom-11 sm:bottom-3 left-2.5 z-10 pointer-events-auto bg-studio-950/90 backdrop-blur-md p-2 rounded-xl border border-studio-800/90 shadow-xl max-w-[280px]">
          <div className="text-[9px] font-bold uppercase tracking-wider text-studio-400 mb-1 border-b border-studio-800/80 pb-0.5">
            {isVi ? 'Chú Thích Đường Đua' : 'Track Elements'}
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-medium text-studio-300">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#e10600] rounded-full inline-block" />
              <span>{isVi ? 'Track F1' : 'F1 Track'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 bg-[#00e676] rounded-full inline-block" />
              <span>{isVi ? 'Vùng DRS' : 'DRS Zone'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-white border border-[#e10600] text-[7px] text-black font-black flex items-center justify-center inline-flex">
                1
              </span>
              <span>{isVi ? 'Góc Cua' : 'Turns'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px]">🏁</span>
              <span>{isVi ? 'Xuất Phát' : 'Start'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Right Floating Navigation Controls */}
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

      {/* Bottom Floating Links Bar (Below Legend on small screens) */}
      <div className="absolute bottom-2.5 left-2.5 z-10 hidden sm:flex items-center gap-1.5 pointer-events-auto">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-0.5 rounded-lg bg-studio-950/90 hover:bg-studio-800 text-studio-400 hover:text-white border border-studio-800 text-[9px] font-mono flex items-center gap-1 shadow-md backdrop-blur-md transition-all"
        >
          <span>Google Maps</span>
          <ExternalLink className="w-2.5 h-2.5 text-studio-400" />
        </a>

        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-0.5 rounded-lg bg-studio-950/90 hover:bg-studio-800 text-studio-400 hover:text-white border border-studio-800 text-[9px] font-mono flex items-center gap-1 shadow-md backdrop-blur-md transition-all"
        >
          <span>OSM</span>
          <ExternalLink className="w-2.5 h-2.5 text-studio-400" />
        </a>
      </div>
    </div>
  );
};
