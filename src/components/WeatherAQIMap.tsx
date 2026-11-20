import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AreaStation, CityConfig, fetchLiveStationsData } from '../services/weatherService';
import { MapPin, Layers, AlertTriangle, RefreshCw, Radio } from 'lucide-react';

interface WeatherAQIMapProps {
  currentCity: CityConfig;
  selectedStation: AreaStation | null;
  onSelectStation: (station: AreaStation) => void;
  liveCityAQI?: number;
}

export const WeatherAQIMap: React.FC<WeatherAQIMapProps> = ({
  currentCity,
  selectedStation,
  onSelectStation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circlesLayerRef = useRef<L.LayerGroup | null>(null);
  const [stations, setStations] = useState<AreaStation[]>(currentCity.stations);
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [hasLiveSensors, setHasLiveSensors] = useState<boolean>(false);

  // Sync live API data for stations whenever city changes
  useEffect(() => {
    let isMounted = true;
    const loadLiveStations = async () => {
      setIsFetchingLive(true);
      const liveStations = await fetchLiveStationsData(currentCity.stations);
      if (isMounted) {
        setStations(liveStations);
        setHasLiveSensors(true);
        setIsFetchingLive(false);
      }
    };

    loadLiveStations();
    return () => {
      isMounted = false;
    };
  }, [currentCity]);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981'; // emerald
    if (aqi <= 100) return '#f59e0b'; // amber
    if (aqi <= 150) return '#f97316'; // orange
    if (aqi <= 200) return '#ef4444'; // red
    if (aqi <= 300) return '#8b5cf6'; // purple
    return '#991b1b'; // dark red / maroon
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map with public dark canvas map tiles (no API key watermark)
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCity.lat, currentCity.lng],
        zoom: 11,
        zoomControl: true,
      });

      // Esri World Dark Gray Canvas: High-res dark cartography without watermark/key restriction
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &copy; DeLorme, NAVTEQ',
        maxZoom: 16,
      }).addTo(map);

      // Reference labels overlay
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        attribution: '',
        maxZoom: 16,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
      circlesLayerRef.current = L.layerGroup().addTo(map);
    } else {
      mapInstanceRef.current.setView([currentCity.lat, currentCity.lng], 11);
    }
  }, [currentCity]);

  // Update area-wise AQI circles and markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !circlesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    circlesLayerRef.current.clearLayers();

    stations.forEach((station) => {
      const color = getAQIColor(station.aqi);

      // Area Smog / AQI Diffusion Circle
      const circle = L.circle([station.lat, station.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.38,
        radius: 2600, // 2.6 km radius
        weight: 1.5,
      });

      circle.bindTooltip(`
        <div style="font-family: system-ui, sans-serif; font-size: 12px; color: #fff; background: #020617; padding: 6px 10px; border-radius: 8px; border: 1px solid ${color};">
          <strong>${station.name}</strong><br/>
          AQI: <span style="color: ${color}; font-weight: bold;">${station.aqi}</span> (${station.status})<br/>
          PM2.5: ${station.pm25} µg/m³ • PM10: ${station.pm10} µg/m³
        </div>
      `, { permanent: false, direction: 'top' });

      circle.on('click', () => {
        onSelectStation(station);
      });

      circle.addTo(circlesLayerRef.current!);

      // Custom HTML Marker with AQI Badge
      const customIcon = L.divIcon({
        className: 'custom-aqi-marker',
        html: `
          <div style="
            background: #020617;
            color: #ffffff;
            font-family: system-ui, sans-serif;
            font-weight: 700;
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 12px;
            border: 2px solid ${color};
            box-shadow: 0 0 10px ${color}88;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            <span style="display:inline-block; width: 7px; height: 7px; border-radius: 50%; background: ${color};"></span>
            <span>${station.name.split(' ')[0]}:</span>
            <span style="color:${color}; font-weight: 900;">${station.aqi}</span>
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([station.lat, station.lng], { icon: customIcon });
      marker.on('click', () => {
        onSelectStation(station);
      });
      marker.addTo(markersLayerRef.current!);
    });
  }, [stations, onSelectStation]);

  const handleManualRefresh = async () => {
    setIsFetchingLive(true);
    const liveStations = await fetchLiveStationsData(currentCity.stations);
    setStations(liveStations);
    setHasLiveSensors(true);
    setIsFetchingLive(false);
  };

  return (
    <div className="hud-panel rounded-3xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Area-Wise Urban AQI & Smog Inversion Map
              </h3>
              {hasLiveSensors && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                  Live API Linked
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Interactive neighborhood air monitoring for {currentCity.name} ({currentCity.region})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={isFetchingLive}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isFetchingLive ? 'animate-spin' : ''}`} />
            <span>{isFetchingLive ? 'Updating...' : 'Refresh Station API'}</span>
          </button>

          {/* Legend */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">AQI:</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"/> Good</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"/> Mod</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"/> Sensitive</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"/> Unhealthy</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"/> Hazardous</span>
          </div>
        </div>
      </div>

      {/* Map View Canvas */}
      <div className="relative">
        <div 
          ref={mapContainerRef} 
          className="w-full h-[420px] z-10 bg-slate-950" 
          aria-label="Area wise air quality index map"
        />

        {/* Selected Station Overlay Drawer */}
        {selectedStation && (
          <div className="absolute top-4 right-4 z-20 max-w-xs w-full bg-slate-950/95 border border-slate-700 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  Selected Area Station
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedStation.name}</h4>
              </div>
              <span 
                className="text-xs font-black px-2.5 py-1 rounded-lg text-black"
                style={{ backgroundColor: getAQIColor(selectedStation.aqi) }}
              >
                {selectedStation.aqi} AQI
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">PM2.5 Level</span>
                <span className="font-bold text-slate-100">{selectedStation.pm25} µg/m³</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">PM10 Level</span>
                <span className="font-bold text-slate-100">{selectedStation.pm10} µg/m³</span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-semibold block mb-0.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Dominant Emission Source:
              </span>
              {selectedStation.dominantSource}
            </div>

            <button
              onClick={() => onSelectStation(null as any)}
              className="mt-2.5 w-full text-center text-xs text-slate-400 hover:text-white py-1 transition-colors"
            >
              Close Details
            </button>
          </div>
        )}
      </div>

      {/* Area Station Quick Picker Bar */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Hotspot Stations:
        </span>
        {stations.map((st) => (
          <button
            key={st.id}
            onClick={() => onSelectStation(st)}
            className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              selectedStation?.id === st.id
                ? 'bg-slate-800 border-cyan-400 text-white shadow-sm'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: getAQIColor(st.aqi) }} 
            />
            <span>{st.name}</span>
            <span className="font-mono font-bold text-slate-400 text-[11px]">{st.aqi}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

