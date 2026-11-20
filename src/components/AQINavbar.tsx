import React, { useState } from 'react';
import { 
  Search, 
  Navigation, 
  X, 
  MapPin, 
  Sparkles,
  BarChart2,
  Map as MapIcon,
  Trophy,
  Bot
} from 'lucide-react';
import { GeocodingResult, searchLocations } from '../services/weatherService';

interface AQINavbarProps {
  onSearchSelect: (lat: number, lng: number, name: string, region: string) => void;
  onLocateMe: () => void;
  isLocating?: boolean;
  activeTab: string;
  onTabChange: (tab: any) => void;
  selectedCityName?: string;
}

export const AQINavbar: React.FC<AQINavbarProps> = ({
  onSearchSelect,
  onLocateMe,
  isLocating,
  activeTab,
  onTabChange,
  selectedCityName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      const res = await searchLocations(val);
      setSearchResults(res);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (item: GeocodingResult) => {
    const region = [item.admin1, item.country].filter(Boolean).join(', ') || item.name;
    onSearchSelect(item.latitude, item.longitude, item.name, region);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f141f] border-b border-[#1e2638] px-4 lg:px-8 py-2.5">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6 shrink-0">
          <div 
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className="text-2xl font-black tracking-tight text-[#00c8b3] group-hover:text-cyan-400 transition-colors">
              AQI
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c8b3] -mt-3 animate-pulse" />
          </div>

          {/* Search bar directly matching AQI.in */}
          <div className="relative w-64 md:w-96 hidden sm:block">
            <div className="flex items-center bg-[#182032] border border-[#26334d] rounded-full px-3.5 py-1.5 focus-within:border-[#00c8b3] transition-all shadow-inner">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search any Location, City, State or Country"
                className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
              />
              {searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button 
                  onClick={onLocateMe}
                  title="Detect GPS Location"
                  className="text-slate-400 hover:text-[#00c8b3] ml-1 p-0.5"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-[#00c8b3]' : ''}`} />
                </button>
              )}
            </div>

            {/* Dropdown search flyout */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-full bg-[#182032] border border-[#26334d] rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-[#202b40]">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#202b40] transition-colors flex flex-col"
                  >
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#00c8b3]" />
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-400 pl-4.5">
                      {[item.admin1, item.country].filter(Boolean).join(', ')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center / Right: Nav Items matching AQI.in header */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#00c8b3]/20 text-[#00c8b3] border border-[#00c8b3]/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onTabChange('map')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'map'
                ? 'bg-[#00c8b3]/20 text-[#00c8b3] border border-[#00c8b3]/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>

          <button
            onClick={() => onTabChange('rankings')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'rankings'
                ? 'bg-[#00c8b3]/20 text-[#00c8b3] border border-[#00c8b3]/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Ranking</span>
          </button>

          <button
            onClick={() => onTabChange('scale')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'scale'
                ? 'bg-[#00c8b3]/20 text-[#00c8b3] border border-[#00c8b3]/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AQI Scale</span>
          </button>

          <button
            onClick={() => onTabChange('ai-assistant')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'ai-assistant'
                ? 'bg-[#00c8b3]/20 text-[#00c8b3] border border-[#00c8b3]/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#00c8b3]" />
            <span>GenAI Advisor</span>
          </button>
        </nav>

        {/* Right Settings Pill (AQI Standard, Country, Locate Me) */}
        <div className="flex items-center gap-2">
          {selectedCityName && (
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] bg-[#182032] border border-[#26334d] px-3 py-1.5 rounded-full text-slate-300">
              <MapPin className="w-3 h-3 text-[#00c8b3]" />
              <span className="font-semibold text-white truncate max-w-[120px]">{selectedCityName}</span>
            </div>
          )}

          <button
            onClick={onLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1 text-[11px] font-bold bg-[#182032] hover:bg-[#202b40] text-slate-200 border border-[#26334d] px-3 py-1.5 rounded-full transition-all cursor-pointer"
          >
            <Navigation className={`w-3 h-3 text-[#00c8b3] ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{isLocating ? 'Locating...' : 'Locate Me'}</span>
          </button>

          <div className="hidden lg:flex items-center gap-1 text-[11px] bg-[#182032] border border-[#26334d] px-2.5 py-1.5 rounded-full text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>AQI-US</span>
          </div>
        </div>
      </div>
    </header>
  );
};
