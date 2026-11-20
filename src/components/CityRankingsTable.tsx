import React, { useState } from 'react';
import { Heart, ArrowUpRight, Flame } from 'lucide-react';

interface CityRankingsTableProps {
  onSelectCity: (cityName: string) => void;
}

interface RankedCityItem {
  rank: number;
  city: string;
  state: string;
  country: string;
  flag: string;
  aqi: number;
  status: 'Hazardous' | 'Severe' | 'Unhealthy' | 'Poor' | 'Moderate' | 'Good';
  standardRatio: string;
}

export const AQI_IN_TOP_CITIES: RankedCityItem[] = [
  { rank: 1, city: 'Srinagar', state: 'Jammu And Kashmir', country: 'India', flag: '🇮🇳', aqi: 325, status: 'Hazardous', standardRatio: '16x above Standard' },
  { rank: 2, city: 'Buxar', state: 'Bihar', country: 'India', flag: '🇮🇳', aqi: 232, status: 'Severe', standardRatio: '10x above Standard' },
  { rank: 3, city: 'Ghazipur', state: 'Uttar Pradesh', country: 'India', flag: '🇮🇳', aqi: 228, status: 'Severe', standardRatio: '10x above Standard' },
  { rank: 4, city: 'Prayagraj', state: 'Uttar Pradesh', country: 'India', flag: '🇮🇳', aqi: 226, status: 'Severe', standardRatio: '10x above Standard' },
  { rank: 5, city: 'Rewa', state: 'Madhya Pradesh', country: 'India', flag: '🇮🇳', aqi: 224, status: 'Severe', standardRatio: '10x above Standard' },
  { rank: 6, city: 'Hisar', state: 'Haryana', country: 'India', flag: '🇮🇳', aqi: 223, status: 'Severe', standardRatio: '10x above Standard' },
  { rank: 7, city: 'Ludhiana', state: 'Punjab', country: 'India', flag: '🇮🇳', aqi: 215, status: 'Severe', standardRatio: '9x above Standard' },
  { rank: 8, city: 'Umaria', state: 'Madhya Pradesh', country: 'India', flag: '🇮🇳', aqi: 211, status: 'Severe', standardRatio: '9x above Standard' },
  { rank: 9, city: 'New Delhi', state: 'Delhi', country: 'India', flag: '🇮🇳', aqi: 209, status: 'Severe', standardRatio: '9x above Standard' },
  { rank: 10, city: 'Sirsa', state: 'Haryana', country: 'India', flag: '🇮🇳', aqi: 205, status: 'Severe', standardRatio: '9x above Standard' },
  { rank: 11, city: 'Noida', state: 'Uttar Pradesh', country: 'India', flag: '🇮🇳', aqi: 199, status: 'Unhealthy', standardRatio: '8x above Standard' },
  { rank: 12, city: 'Gurugram', state: 'Haryana', country: 'India', flag: '🇮🇳', aqi: 194, status: 'Unhealthy', standardRatio: '8x above Standard' },
];

export const CityRankingsTable: React.FC<CityRankingsTableProps> = ({ onSelectCity }) => {
  const [rankingType, setRankingType] = useState<'city' | 'country'>('city');
  const [followedRanks, setFollowedRanks] = useState<number[]>([]);

  const toggleFollow = (rank: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowedRanks(prev => 
      prev.includes(rank) ? prev.filter(r => r !== rank) : [...prev, rank]
    );
  };

  const getStatusColor = (status: RankedCityItem['status']) => {
    switch (status) {
      case 'Hazardous': return 'text-[#b91c1c]';
      case 'Severe': return 'text-[#8b5cf6]';
      case 'Unhealthy': return 'text-[#e11d48]';
      case 'Poor': return 'text-[#f97316]';
      case 'Moderate': return 'text-[#f59e0b]';
      case 'Good': return 'text-[#10b981]';
    }
  };

  const getArcColor = (aqi: number) => {
    if (aqi > 300) return '#b91c1c';
    if (aqi > 200) return '#8b5cf6';
    if (aqi > 150) return '#e11d48';
    if (aqi > 100) return '#f97316';
    return '#10b981';
  };

  return (
    <div className="w-full bg-[#111726] border border-[#232e47] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header section matching Screenshot 4 */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            Live AQI Ranking
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          World Most Polluted Cities 2026
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Real-time air quality index ranking of cities & countries around the world
        </p>
      </div>

      {/* Tabs matching Screenshot 4: City Rankings vs Country Rankings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setRankingType('city')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
            rankingType === 'city'
              ? 'bg-[#182032] border-[#e11d48]/60 shadow-lg'
              : 'bg-[#141b2b] border-[#222c42] opacity-70 hover:opacity-100'
          }`}
        >
          <div>
            <span className="text-[11px] font-semibold text-[#e11d48] uppercase tracking-wider block">
              World's Most Polluted
            </span>
            <span className="text-sm font-bold text-white">
              City Rankings (2025/2026)
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setRankingType('country')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
            rankingType === 'country'
              ? 'bg-[#182032] border-[#e11d48]/60 shadow-lg'
              : 'bg-[#141b2b] border-[#222c42] opacity-70 hover:opacity-100'
          }`}
        >
          <div>
            <span className="text-[11px] font-semibold text-[#e11d48] uppercase tracking-wider block">
              World's Most Polluted
            </span>
            <span className="text-sm font-bold text-white">
              Country Rankings (2025/2026)
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-[#202a3d] text-[11px] font-medium">
              <th className="pb-3 pl-3 w-16">Rank</th>
              <th className="pb-3">Most Polluted Cities</th>
              <th className="pb-3 text-center">AQI</th>
              <th className="pb-3 text-center">AQI Status</th>
              <th className="pb-3 text-center">Standard Value</th>
              <th className="pb-3 pr-3 text-center">Follow</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e263a]">
            {AQI_IN_TOP_CITIES.map((c) => {
              const arcColor = getArcColor(c.aqi);
              const isFollowed = followedRanks.includes(c.rank);

              return (
                <tr
                  key={c.rank}
                  onClick={() => onSelectCity(c.city)}
                  className="hover:bg-[#182032] transition-colors cursor-pointer group"
                >
                  <td className="py-4 pl-3 font-medium text-slate-300">
                    {c.rank}.
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span className="font-semibold text-white group-hover:text-[#00c8b3] transition-colors">
                        {c.city}, {c.state}, {c.country}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    {/* Semi-circular needle badge matching screenshot */}
                    <div className="inline-flex flex-col items-center">
                      <div className="relative w-14 h-7 flex items-end justify-center">
                        <svg viewBox="0 0 50 25" className="w-12 h-6">
                          <path
                            d="M 5 25 A 20 20 0 0 1 45 25"
                            fill="none"
                            stroke="#26334d"
                            strokeWidth="4"
                          />
                          <path
                            d="M 5 25 A 20 20 0 0 1 45 25"
                            fill="none"
                            stroke={arcColor}
                            strokeWidth="4"
                            strokeDasharray="63"
                            strokeDashoffset={63 - Math.min(63, (c.aqi / 350) * 63)}
                          />
                        </svg>
                        <span className="absolute bottom-0 text-[11px] font-black text-white font-mono">
                          {c.aqi}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-center font-bold">
                    <span className={getStatusColor(c.status)}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 text-center font-medium text-slate-300">
                    <span className="text-[#e11d48] font-semibold">{c.standardRatio}</span>
                  </td>
                  <td className="py-4 pr-3 text-center">
                    <button
                      onClick={(e) => toggleFollow(c.rank, e)}
                      className="p-1.5 rounded-full hover:bg-slate-800 transition-colors inline-block"
                      title="Follow this city"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isFollowed ? 'fill-rose-500 text-rose-500' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#1e263a]">
        <div className="flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Real-time continuous CPCB & Open-Meteo atmospheric telemetry</span>
        </div>
        <span>Last Updated: 20 Nov 2026, 06:30 PM (IST)</span>
      </div>
    </div>
  );
};
