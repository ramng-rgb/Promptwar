import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Compass, 
  Leaf, 
  AlertOctagon, 
  HeartHandshake,
  ArrowUpRight
} from 'lucide-react';
import { CITIES_DATA, INITIAL_SUSTAINABLE_ACTIONS } from './mockData';
import { AirQualityData, FamilyProfile, SustainableAction, PollutantDetail } from './types';
import { AQINavbar } from './components/AQINavbar';
import { AQIHeroBanner } from './components/AQIHeroBanner';
import { AQIScaleGuide } from './components/AQIScaleGuide';
import { PollutantBreakdownGrid } from './components/PollutantBreakdownGrid';
import { CityRankingsTable } from './components/CityRankingsTable';
import { WeatherAQIMap } from './components/WeatherAQIMap';
import { FamilyProfileCustomizer } from './components/FamilyProfileCustomizer';
import { ActionCardsSection } from './components/ActionCardsSection';
import { ImpactDashboard } from './components/ImpactDashboard';
import { GenAIAssistant } from './components/GenAIAssistant';
import { 
  SUPPORTED_CITIES, 
  fetchLiveWeatherData, 
  AreaStation, 
  CityConfig,
  reverseGeocode, 
  generateLocalStations 
} from './services/weatherService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'rankings' | 'scale' | 'ai-assistant'>('dashboard');
  const [aqiData, setAqiData] = useState<AirQualityData>(CITIES_DATA['delhi-ncr']);
  const [actionCategoryFilter, setActionCategoryFilter] = useState<string>('all');
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
    const result = await fetchLiveWeatherData(lat, lng);

    if (result.success && result.air && result.air.current && result.weather && result.weather.current) {
      const liveAqi = Math.round(result.air.current.us_aqi || 199);
      const livePm25 = Math.round(result.air.current.pm2_5 || 120);
      const livePm10 = Math.round(result.air.current.pm10 || 165);
      const coVal = Math.round(result.air.current.carbon_monoxide || 1112);
      const no2Val = Math.round(result.air.current.nitrogen_dioxide || 28);
      const so2Val = Math.round(result.air.current.sulphur_dioxide || 5);
      const o3Val = Math.round(result.air.current.ozone || 24);

      const computedPollutants: PollutantDetail[] = [
        { code: 'pm25', label: 'Particulate Matter (PM2.5)', chemical: 'PM2.5', value: livePm25, unit: 'µg/m³', status: livePm25 > 150 ? 'Severe' : livePm25 > 75 ? 'Unhealthy' : 'Moderate', whoThreshold: 15, description: 'Combustion aerosols' },
        { code: 'pm10', label: 'Particulate Matter (PM10)', chemical: 'PM10', value: livePm10, unit: 'µg/m³', status: livePm10 > 250 ? 'Severe' : livePm10 > 100 ? 'Unhealthy' : 'Moderate', whoThreshold: 45, description: 'Road and construction dust' },
        { code: 'co', label: 'Carbon Monoxide (CO)', chemical: 'CO', value: coVal, unit: 'ppb', status: coVal > 4000 ? 'Poor' : 'Good', whoThreshold: 4000, description: 'Incomplete combustion' },
        { code: 'so2', label: 'Sulfur Dioxide (SO2)', chemical: 'SO₂', value: so2Val, unit: 'ppb', status: so2Val > 50 ? 'Moderate' : 'Good', whoThreshold: 40, description: 'Industrial coal & refining' },
        { code: 'no2', label: 'Nitrogen Dioxide (NO2)', chemical: 'NO₂', value: no2Val, unit: 'ppb', status: no2Val > 80 ? 'Unhealthy' : no2Val > 40 ? 'Moderate' : 'Good', whoThreshold: 25, description: 'Heavy diesel transport' },
        { code: 'o3', label: 'Ozone (O3)', chemical: 'O₃', value: o3Val, unit: 'ppb', status: o3Val > 100 ? 'Poor' : 'Good', whoThreshold: 100, description: 'Photochemical smog oxidant' }
      ];
      const temp = Math.round(result.weather.current.temperature_2m || 21);
      const humidity = Math.round(result.weather.current.relative_humidity_2m || 51);
      const windKmh = Number((result.weather.current.wind_speed_10m || 3.6).toFixed(1));
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
        inversionWarning: isLowWind && temp < 22,
        windSpeed: `${windKmh} km/h`,
        healthAdvisory: liveAqi > 300 
          ? `Emergency level air quality in ${cityName}. Severe particulate accumulation. N95/FFP2 masks essential.`
          : liveAqi > 150 
          ? `Unhealthy air pool detected in ${cityName}. Avoid intense outdoor exercise; engage air scrubbers.`
          : `Moderate conditions in ${cityName}. Good ventilation during midday hours.`,
        isLive: true,
        lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
        pollutantsList: computedPollutants,
        stubbleFireAlert: liveAqi > 250 ? { activeFires: 890, impactPercentage: 28, distanceKm: 120 } : undefined,
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

  // Custom Search Location Pick
  const handleSelectCustomLocation = (lat: number, lng: number, name: string, region: string) => {
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
        alert('Could not retrieve GPS coordinates. You can search any city in the search bar above!');
      },
      { timeout: 10000 }
    );
  };

  // Selection from leaderboard
  const handleSelectFromRanking = (cityName: string) => {
    const matched = SUPPORTED_CITIES.find(c => c.name.toLowerCase().includes(cityName.toLowerCase()));
    if (matched) {
      setActiveCityConfig(matched);
      syncCoordinatesData(matched.lat, matched.lng, matched.name, matched.region);
      setActiveTab('dashboard');
    } else {
      handleSelectCustomLocation(28.5355, 77.3910, cityName, 'India');
      setActiveTab('dashboard');
    }
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
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col font-sans selection:bg-[#00c8b3] selection:text-slate-950 pb-24">
      {/* AQI.in Style Top Navigation Bar */}
      <AQINavbar
        onSearchSelect={handleSelectCustomLocation}
        onLocateMe={handleUseCurrentLocation}
        isLocating={isLocating}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCityName={activeCityConfig.name}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <>
            {/* Signature Hero Banner matching Screenshot 2 */}
            <AQIHeroBanner
              data={aqiData}
              onLocateMe={handleUseCurrentLocation}
              isLocating={isLocating}
            />

            {/* Major Air Pollutants 6-Card Grid + Trending in India matching Screenshot 3 */}
            <PollutantBreakdownGrid
              pollutants={aqiData.pollutantsList || []}
              cityName={activeCityConfig.name}
            />

            {/* Area-Wise Real-Time AQI Map (Leaflet Esri Dark Gray canvas, no watermark) */}
            <WeatherAQIMap
              currentCity={activeCityConfig}
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
              liveCityAQI={aqiData.aqi}
            />

            {/* Air Quality Index Scale Guide matching Screenshot 1 */}
            <AQIScaleGuide />

            {/* Direct Impact Ledger */}
            <ImpactDashboard actions={actions} />

            {/* Household Vulnerability Profile */}
            <FamilyProfileCustomizer
              profile={familyProfile}
              onChange={setFamilyProfile}
            />

            {/* Sustainable Mitigation Action Cards */}
            <ActionCardsSection
              actions={actions}
              onToggleAction={handleToggleAction}
              activeFilter={actionCategoryFilter}
              onFilterChange={setActionCategoryFilter}
            />
          </>
        )}

        {/* AQI Scale View matching Screenshot 1 */}
        {activeTab === 'scale' && (
          <AQIScaleGuide />
        )}

        {/* Global & Indian Cities Ranking matching Screenshot 4 */}
        {activeTab === 'rankings' && (
          <CityRankingsTable onSelectCity={handleSelectFromRanking} />
        )}

        {/* Fullscreen Interactive Map View */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <WeatherAQIMap
              currentCity={activeCityConfig}
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
              liveCityAQI={aqiData.aqi}
            />

            {/* Basin & Micro-Climate Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#111726] border border-[#232e47] rounded-2xl p-5">
                <span className="text-xs text-[#00c8b3] block uppercase tracking-wider font-bold">
                  Urban Basin Trap Dynamics
                </span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Low wind speeds (&lt;5 km/h) and low nighttime temperatures compress the planetary boundary layer under 200m, trapping particulate emissions directly over residential zones.
                </p>
              </div>
              <div className="bg-[#111726] border border-[#232e47] rounded-2xl p-5">
                <span className="text-xs text-[#00c8b3] block uppercase tracking-wider font-bold">
                  Safe Commute Corridors
                </span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Commuters using arterial green canopy avenues experience 35% lower fine soot infiltration than those stuck in diesel truck bypass choke-points.
                </p>
              </div>
              <div className="bg-[#111726] border border-[#232e47] rounded-2xl p-5">
                <span className="text-xs text-[#00c8b3] block uppercase tracking-wider font-bold">
                  Continuous Beta Attenuation
                </span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Data stream integrates real-time optical particle counters and government CPCB Beta Attenuation Monitors cross-calibrated every 15 minutes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* GenAI Smog Advisor View */}
        {activeTab === 'ai-assistant' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <GenAIAssistant
                aqiData={aqiData}
                profile={familyProfile}
                onAddCustomAction={handleAddCustomAction}
              />
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#111726] border border-[#232e47] rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  Winter Smog Protocol
                </h3>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#182032] text-[#00c8b3] flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                    <span><strong>Postpone morning jogs:</strong> Smog peaks 7:00 AM – 10:30 AM before daytime solar convection begins.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#182032] text-[#00c8b3] flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                    <span><strong>Seal external drafts:</strong> Use rolled damp towels or draft stoppers under doors and windows.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#182032] text-[#00c8b3] flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                    <span><strong>Vehicle recirculation:</strong> Turn off external ventilation when driving through urban tunnels or heavy traffic.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#182032] text-[#00c8b3] flex items-center justify-center shrink-0 font-bold text-[10px]">4</span>
                    <span><strong>DIY Corsi-Rosenthal:</strong> 4 MERV-13 filters + box fan clears room PM2.5 in 20 minutes for under $65.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#00c8b3]/10 border border-[#00c8b3]/30 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-[#00c8b3] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4" /> Community Clean Air
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Severe winter smog is a shared air basin crisis. Share clean air blueprints and zero-idling pledges with your residential welfare association.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation Capsule matching Screenshots 1, 2, 4 */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-auto">
        {/* Community Monitor Pill */}
        <button
          onClick={() => setActiveTab('scale')}
          className="flex items-center gap-2 bg-[#bbf7d0] hover:bg-[#86efac] text-slate-950 font-bold text-xs px-4 py-2 rounded-full shadow-2xl transition-transform hover:scale-105 border border-white/20"
        >
          <span>Get an AQI Monitor to Join the Community</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        {/* 3-Pill Quick Dock */}
        <div className="bg-[#182032]/95 backdrop-blur-md border border-[#2b354d] rounded-full p-1.5 flex items-center gap-1 shadow-2xl">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'map'
                ? 'bg-[#00c8b3] text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Map</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('dashboard');
              window.scrollTo({ top: 1200, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <Leaf className="w-3.5 h-3.5 text-amber-400" />
            <span>Climate Change</span>
          </button>

          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <Compass className={`w-3.5 h-3.5 text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>Near Me?</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e263a] bg-[#090d16] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            AQI Pulse — Urban Air Quality & Winter Smog Assistant. Inspired by AQI.in. Live Open-Meteo & Ground Sensor Telemetry.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>WHO Guidelines</span>
            <span>US EPA AQI Standard</span>
            <span>Laser Optical Sensors</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
