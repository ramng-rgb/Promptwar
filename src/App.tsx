import React, { useState, useEffect, useCallback } from 'react';
import { 
  Wind, 
  Sparkles, 
  BarChart, 
  Map,
  AlertOctagon,
  HeartHandshake
} from 'lucide-react';
import { CITIES_DATA, INITIAL_SUSTAINABLE_ACTIONS } from './mockData';
import { AirQualityData, FamilyProfile, SustainableAction } from './types';
import { AQIOverviewCard } from './components/AQIOverviewCard';
import { FamilyProfileCustomizer } from './components/FamilyProfileCustomizer';
import { ActionCardsSection } from './components/ActionCardsSection';
import { ImpactDashboard } from './components/ImpactDashboard';
import { GenAIAssistant } from './components/GenAIAssistant';
import { WeatherAQIMap } from './components/WeatherAQIMap';
import { 
  SUPPORTED_CITIES, 
  fetchLiveWeatherData, 
  AreaStation, 
  CityConfig,
  reverseGeocode, 
  generateLocalStations 
} from './services/weatherService';

export const App: React.FC = () => {
  const [selectedCityKey, setSelectedCityKey] = useState<string>('delhi-ncr');
  const [aqiData, setAqiData] = useState<AirQualityData>(CITIES_DATA['delhi-ncr']);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'ai-assistant'>('dashboard');
  const [actionCategoryFilter, setActionCategoryFilter] = useState<string>('all');
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [selectedStation, setSelectedStation] = useState<AreaStation | null>(null);

  // Dynamic active city configuration supporting custom search & GPS location
  const [activeCityConfig, setActiveCityConfig] = useState<CityConfig>(SUPPORTED_CITIES[0]);

  // Helper to calculate category from US AQI
  const getCategoryFromAQI = (aqi: number): AirQualityData['category'] => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Severe Smog / Hazardous';
  };

  // Sync Live Data from Open-Meteo Weather & Air Quality API for coordinates
  const syncCoordinatesData = useCallback(async (lat: number, lng: number, cityName: string, regionName: string) => {
    setIsLoadingLive(true);
    const result = await fetchLiveWeatherData(lat, lng);
    setIsLoadingLive(false);

    if (result.success && result.air && result.air.current && result.weather && result.weather.current) {
      const liveAqi = Math.round(result.air.current.us_aqi || 120);
      const livePm25 = Math.round(result.air.current.pm2_5 || 45);
      const livePm10 = Math.round(result.air.current.pm10 || 70);
      const temp = Math.round(result.weather.current.temperature_2m || 20);
      const humidity = Math.round(result.weather.current.relative_humidity_2m || 60);
      const windKmh = result.weather.current.wind_speed_10m || 4;
      const isLowWind = windKmh < 5.0;

      const hourlyAqi = result.air.hourly?.us_aqi || [];
      const forecastSlots = [6, 9, 12, 15, 18, 21].map(hour => {
        const slotAqi = hourlyAqi[hour] || Math.round(liveAqi * (0.8 + Math.random() * 0.4));
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        return {
          time: timeStr,
          aqi: slotAqi,
          suitableFor: slotAqi > 250 
            ? 'Hazardous: Keep indoor perimeter sealed' 
            : slotAqi > 150 
            ? 'Sensitive groups stay indoors' 
            : 'Optimal window for necessary travel'
        };
      });

      setAqiData({
        city: cityName,
        region: regionName,
        aqi: liveAqi,
        category: getCategoryFromAQI(liveAqi),
        primaryPollutant: livePm25 > livePm10 ? 'PM2.5 (Fine Particulate)' : 'PM10 (Coarse Dust)',
        pm25: livePm25,
        pm10: livePm10,
        temperature: temp,
        humidity: humidity,
        inversionWarning: isLowWind && temp < 18,
        windSpeed: `${windKmh} km/h (${isLowWind ? 'Calm Inversion Trap' : 'Active Air Mixing'})`,
        healthAdvisory: liveAqi > 300 
          ? `Emergency level air quality in ${cityName}. Severe particulate accumulation. N95/FFP2 masks essential.`
          : liveAqi > 150 
          ? `Unhealthy air pool detected in ${cityName}. Avoid intense outdoor exercise; engage air scrubbers.`
          : `Moderate conditions in ${cityName}. Good ventilation during midday hours.`,
        isLive: true,
        lastUpdated: new Date().toLocaleTimeString(),
        gases: {
          co: result.air.current.carbon_monoxide,
          no2: result.air.current.nitrogen_dioxide,
          so2: result.air.current.sulphur_dioxide,
          o3: result.air.current.ozone,
        },
        forecast: forecastSlots,
      });
    }
  }, []);

  // Preset City Change
  const handleCityChange = (newCityKey: string) => {
    setSelectedCityKey(newCityKey);
    setSelectedStation(null);
    const config = SUPPORTED_CITIES.find(c => c.key === newCityKey);
    if (config) {
      setActiveCityConfig(config);
      if (CITIES_DATA[newCityKey]) {
        setAqiData(CITIES_DATA[newCityKey]);
      }
      syncCoordinatesData(config.lat, config.lng, config.name, config.region);
    }
  };

  // Custom Search Location Pick
  const handleSelectCustomLocation = (lat: number, lng: number, name: string, region: string) => {
    setSelectedCityKey('custom');
    setSelectedStation(null);

    const customStations = generateLocalStations(lat, lng, name);
    const newConfig: CityConfig = {
      key: `custom-${Date.now()}`,
      name,
      region,
      lat,
      lng,
      stations: customStations,
    };

    setActiveCityConfig(newConfig);
    syncCoordinatesData(lat, lng, name, region);
  };

  // Browser Geolocation Detection
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const { name, region } = await reverseGeocode(latitude, longitude);

        setSelectedCityKey('custom');
        setSelectedStation(null);

        const customStations = generateLocalStations(latitude, longitude, name);
        const newConfig: CityConfig = {
          key: `gps-${Date.now()}`,
          name,
          region,
          lat: latitude,
          lng: longitude,
          stations: customStations,
        };

        setActiveCityConfig(newConfig);
        await syncCoordinatesData(latitude, longitude, name, region);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation access issue:', err);
        setIsLocating(false);
        alert('Could not retrieve GPS coordinates. You can type any city or locality in the Search box!');
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    syncCoordinatesData(activeCityConfig.lat, activeCityConfig.lng, activeCityConfig.name, activeCityConfig.region);
  }, []);

  const [familyProfile, setFamilyProfile] = useState<FamilyProfile>({
    name: 'Household Profile',
    membersCount: 4,
    hasChildren: true,
    hasElderly: true,
    hasAsthmaOrRespiratory: true,
    commuteType: 'car',
    livingType: 'apartment',
    heatingType: 'natural_gas',
    airPurifierAvailable: false,
  });

  const [actions, setActions] = useState<SustainableAction[]>(INITIAL_SUSTAINABLE_ACTIONS);

  const handleToggleAction = (actionId: string) => {
    setActions(prev =>
      prev.map(action =>
        action.id === actionId ? { ...action, implemented: !action.implemented } : action
      )
    );
  };

  const handleAddCustomAction = (newAction: SustainableAction) => {
    setActions(prev => [newAction, ...prev]);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen ambient-smog-backdrop text-white flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Wind className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  AeroPulse
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
                  Urban Clean Air AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Winter Smog Inversion Mitigation & Low-Emission Lifestyle Assistant
              </p>
            </div>
          </div>

          {/* Navigation Tab Pills */}
          <nav className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart className="w-3.5 h-3.5" />
              <span>Overview & Actions</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Area AQI Map</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ai-assistant'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>GenAI Smog Advisor</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Real-time Atmospheric AQI Card */}
        <AQIOverviewCard
          data={aqiData}
          selectedCityKey={selectedCityKey}
          onCityChange={handleCityChange}
          onSelectCustomLocation={handleSelectCustomLocation}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
          onRefreshLive={() => syncCoordinatesData(activeCityConfig.lat, activeCityConfig.lng, activeCityConfig.name, activeCityConfig.region)}
          isLoadingLive={isLoadingLive}
        />

        {activeTab === 'dashboard' && (
          <>
            {/* Direct Impact Ledger Bar */}
            <ImpactDashboard actions={actions} />

            {/* Area-Wise AQI Map Preview Component */}
            <WeatherAQIMap
              currentCity={activeCityConfig}
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
              liveCityAQI={aqiData.aqi}
            />

            {/* Household Vulnerability & Lifestyle Profile */}
            <FamilyProfileCustomizer
              profile={familyProfile}
              onChange={setFamilyProfile}
            />

            {/* Action Cards & DIY Hacks Grid */}
            <ActionCardsSection
              actions={actions}
              onToggleAction={handleToggleAction}
              activeFilter={actionCategoryFilter}
              onFilterChange={setActionCategoryFilter}
            />
          </>
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <WeatherAQIMap
              currentCity={activeCityConfig}
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
              liveCityAQI={aqiData.aqi}
            />

            {/* Deep Neighborhood Vulnerability Drilldown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">
                  Urban Micro-Climate Stagnation
                </span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Basin geography traps particulate matter in valley bottoms and low-elevation ring roads. Urban street canyons with tall buildings increase localized exposure by up to <strong>300%</strong>.
                </p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">
                  Safe Commute Corridors
                </span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Select stations located in green canopy buffer zones (such as parks and river corridors) for necessary morning travel rather than major truck logistics bypasses.
                </p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">
                  Sensor Ground Validation
                </span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Station monitors reflect continuous ambient BAM (Beta Attenuation Monitors) and laser optical particle counters cross-calibrated with meteorological stations.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-assistant' && (
          /* GenAI Interactive Smog Assistant View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <GenAIAssistant
                aqiData={aqiData}
                profile={familyProfile}
                onAddCustomAction={handleAddCustomAction}
              />
            </div>

            {/* Sidebar with Quick Winter Air Protocol */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  Critical Smog Inversion Checklist
                </h3>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                    <span><strong>Delay morning outings:</strong> Smog peaks 7:00 AM - 10:30 AM before daytime solar mixing begins.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                    <span><strong>Seal external drafts:</strong> Use rolled damp towels or draft stoppers under doors and window sills.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                    <span><strong>Internal car recirculation:</strong> Turn off external ventilation when driving through urban tunnels or idling intersections.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-[10px]">4</span>
                    <span><strong>Corsi-Rosenthal filtration:</strong> 4 MERV-13 filters + box fan clears room PM2.5 in 20 minutes for under $65.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4" /> Community Inversion Alert
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Severe winter smog is a community challenge. Share zero-idling pledges and DIY Corsi-Rosenthal blueprints with your neighborhood council.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            AeroPulse — Urban Air Quality & Winter Smog Assistant. Live Open-Meteo Weather & Atmospheric Integration.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>WHO Air Guidelines</span>
            <span>EPA PM2.5 Scale</span>
            <span>Open-Meteo Satellite & Ground Sensors</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
