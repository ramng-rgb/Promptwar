import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, 
  AlertTriangle, 
  Thermometer, 
  ShieldAlert, 
  Info, 
  Clock, 
  MapPin, 
  RefreshCw, 
  Radio,
  Navigation,
  Search,
  X,
  Flame
} from 'lucide-react';
import { AirQualityData } from '../types';
import { searchLocations, GeocodingResult } from '../services/weatherService';

interface AQIOverviewCardProps {
  data: AirQualityData;
  onCityChange: (cityKey: string) => void;
  selectedCityKey: string;
  onSelectCustomLocation?: (lat: number, lng: number, name: string, region: string) => void;
  onUseCurrentLocation?: () => void;
  isLocating?: boolean;
  onRefreshLive?: () => void;
  isLoadingLive?: boolean;
}

export const AQIOverviewCard: React.FC<AQIOverviewCardProps> = ({
  data,
  onCityChange,
  selectedCityKey,
  onSelectCustomLocation,
  onUseCurrentLocation,
  isLocating,
  onRefreshLive,
  isLoadingLive,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      setShowSearchDropdown(true);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handlePickLocation = (result: GeocodingResult) => {
    const locationName = result.name;
    const regionName = [result.admin1, result.country].filter(Boolean).join(', ') || result.name;
    if (onSelectCustomLocation) {
      onSelectCustomLocation(result.latitude, result.longitude, locationName, regionName);
    }
    setSearchQuery('');
    setShowSearchDropdown(false);
  };
  // Determine color theme based on AQI level
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', badge: 'bg-emerald-500 text-black' };
    if (aqi <= 100) return { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', badge: 'bg-amber-500 text-black' };
    if (aqi <= 150) return { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400', badge: 'bg-orange-500 text-white' };
    if (aqi <= 200) return { bg: 'bg-rose-500/20', border: 'border-rose-500/40', text: 'text-rose-400', badge: 'bg-rose-500 text-white' };
    if (aqi <= 300) return { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', badge: 'bg-purple-600 text-white' };
    return { bg: 'bg-rose-950/60', border: 'border-rose-700/60', text: 'text-rose-300', badge: 'bg-red-800 text-white font-bold' };
  };

  const aqiStyle = getAQIColor(data.aqi);

  return (
    <section 
      aria-labelledby="aqi-heading"
      className="hud-panel rounded-3xl p-6 sm:p-7 relative overflow-hidden transition-all duration-300 shadow-2xl"
    >
      {/* Dynamic atmospheric radial haze matching live hazard level */}
      <div 
        className="absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700" 
        style={{ backgroundColor: data.aqi > 200 ? '#ef4444' : data.aqi > 100 ? '#f59e0b' : '#10b981' }}
      />

      {/* Header controls: City Selector, Search & Geolocation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-cyan-400 shadow-inner">
            <MapPin className="w-5 h-5" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 block">
              Current Location Monitoring
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {/* Preset Cities Dropdown */}
              <select
                id="city-select"
                value={selectedCityKey}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-slate-900/90 text-white font-semibold text-sm rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer shadow-sm"
                aria-label="Select urban location for air quality index"
              >
                <option value="delhi-ncr">Delhi-NCR (Indo-Gangetic Basin)</option>
                <option value="mumbai">Mumbai (Coastal Konkan)</option>
                <option value="lahore">Lahore (Punjab Plains)</option>
                <option value="salt-lake-city">Salt Lake City (Wasatch Inversion)</option>
                <option value="bakersfield">Bakersfield (Central Valley)</option>
                <option value="london">London (Greater London)</option>
                {selectedCityKey === 'custom' && (
                  <option value="custom">📍 {data.city} (Custom/GPS)</option>
                )}
              </select>

              {/* Use My GPS Location Button */}
              {onUseCurrentLocation && (
                <button
                  type="button"
                  onClick={onUseCurrentLocation}
                  disabled={isLocating}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 transition-all cursor-pointer disabled:opacity-50"
                  title="Detect and monitor your exact current GPS location"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
                </button>
              )}

              {/* Search Different Location Input with Autocomplete */}
              <div ref={searchContainerRef} className="relative">
                <div className="flex items-center bg-slate-900/90 border border-slate-700 rounded-lg px-2.5 py-1 focus-within:ring-2 focus-within:ring-cyan-400 shadow-sm">
                  <Search className={`w-3.5 h-3.5 mr-1.5 shrink-0 ${isSearching ? 'text-cyan-400 animate-spin' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city, neighborhood or region..."
                    className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-44 sm:w-56"
                    aria-label="Search different location for air quality"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-white p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Autocomplete Results Flyout */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <div className="absolute left-0 top-full mt-1.5 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
                    <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/70">
                      Select Location:
                    </div>
                    {searchResults.map((res) => (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => handlePickLocation(res)}
                        className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-cyan-950 hover:text-cyan-300 transition-colors flex flex-col"
                      >
                        <span className="font-bold text-white">{res.name}</span>
                        <span className="text-[11px] text-slate-400">
                          {[res.admin1, res.country].filter(Boolean).join(', ')}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                {data.region}
              </span>

              {data.isLive && (
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg font-bold">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                  LIVE OPEN-METEO
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRefreshLive && (
            <button
              onClick={onRefreshLive}
              disabled={isLoadingLive}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
              title="Fetch latest meteorological and atmospheric sensor data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingLive ? 'animate-spin' : ''}`} />
              <span>{isLoadingLive ? 'Updating...' : 'Sync Live Weather'}</span>
            </button>
          )}

          {data.inversionWarning && (
            <div 
              role="alert"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-medium shadow-sm animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" aria-hidden="true" />
              <span><strong>Thermal Inversion Active:</strong> Ground cold air trap active</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Main AQI Display */}
        <div className="md:col-span-4 flex flex-col items-start bg-slate-950/80 p-5 rounded-2xl border border-white/5 shadow-inner">
          <span className="text-[11px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: aqiStyle.badge.includes('bg-red') ? '#ef4444' : '#0ea5e9' }} />
            Real-time Air Quality Index
          </span>
          <div className="flex items-baseline gap-3 my-2.5">
            <span className={`text-6xl sm:text-7xl font-black tracking-tighter ${aqiStyle.text}`} aria-label={`AQI is ${data.aqi}`}>
              {data.aqi}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800">
              US-AQI
            </span>
          </div>
          <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${aqiStyle.badge}`}>
            {data.category}
          </span>
          <p className="text-xs text-slate-400 mt-3.5 flex items-center gap-1.5 pt-3 border-t border-slate-900 w-full">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Primary Threat: <strong className="text-slate-200">{data.primaryPollutant} (Fine Combustion Particles)</strong></span>
          </p>
        </div>

        {/* Center: Detailed Pollutants & Weather Atmospheric Factors */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">PM2.5 Level</span>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-black text-slate-100">{data.pm25}</span>
              <span className="text-xs text-slate-400 font-mono">µg/m³</span>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold block mt-1">{(data.pm25 / 15).toFixed(1)}x WHO Limit</span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">PM10 Coarse</span>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-black text-slate-100">{data.pm10}</span>
              <span className="text-xs text-slate-400 font-mono">µg/m³</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">Road Dust & Soot</span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> Temperature
            </span>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-black text-slate-100">{data.temperature}°</span>
              <span className="text-xs text-slate-400 font-mono">C</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">{data.humidity}% Humidity</span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind Velocity
            </span>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-xl font-black text-slate-100 truncate" title={data.windSpeed}>{data.windSpeed.split(' ')[0]}</span>
              <span className="text-xs text-slate-400 font-mono">km/h</span>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold block mt-1 truncate">
              {parseFloat(data.windSpeed) < 5 ? 'Ground Trap' : 'Ventilated'}
            </span>
          </div>
        </div>
      </div>

      {/* Advisory & Stubble Smoke Alerts Banner */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3.5">
        <div className="md:col-span-8 p-4 rounded-2xl bg-slate-950/70 border border-white/5 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs text-slate-200">
            <strong className="text-amber-400 font-semibold mr-1.5">Community Health Advisory:</strong>
            {data.healthAdvisory}
          </div>
        </div>

        {/* Real-time Fire / Agricultural Stubble Burning Indicator (AQI.in inspired) */}
        <div className="md:col-span-4 p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Flame className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                Biomass & Stubble Smoke
              </span>
              <span className="text-xs font-bold text-white">
                {data.stubbleFireAlert 
                  ? `${data.stubbleFireAlert.activeFires} Active Fires (${data.stubbleFireAlert.distanceKm}km away)` 
                  : 'Low Local Biomass Smoke'}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-1 rounded-lg border border-amber-700/50">
            {data.stubbleFireAlert ? `+${data.stubbleFireAlert.impactPercentage}% PM2.5` : 'Normal'}
          </span>
        </div>
      </div>

      {/* Diurnal Smog Inversion Windows (Forecast) */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" /> Diurnal Smog & Inversion Schedule (Safe Windows)
          </h3>
          <span className="text-[11px] text-slate-400">Plan outdoor movement during lowest AQI trough</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {data.forecast.map((slot, index) => {
            const isLowest = slot.aqi === Math.min(...data.forecast.map(f => f.aqi));
            return (
              <div 
                key={index}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                  isLowest 
                    ? 'bg-cyan-950/50 border-cyan-400/60 ring-1 ring-cyan-400/40 shadow-lg shadow-cyan-950/50' 
                    : 'bg-slate-950/70 border-white/5 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300">{slot.time}</span>
                  <span className={`text-xs font-black ${getAQIColor(slot.aqi).text}`}>
                    {slot.aqi} AQI
                  </span>
                </div>
                {isLowest && (
                  <span className="inline-block mt-1.5 text-[10px] bg-cyan-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Optimal Window
                  </span>
                )}
                <p className="text-[11px] text-slate-300 mt-1.5 line-clamp-2 leading-snug">
                  {slot.suitableFor}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
