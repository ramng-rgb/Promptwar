import React from 'react';
import { CityRanking } from '../types';
import { Trophy, Globe2, MapPin, ArrowRight } from 'lucide-react';

interface CityRankingsTableProps {
  onSelectCity: (cityKey: string) => void;
}

export const GLOBAL_CITY_RANKINGS: CityRanking[] = [
  { rank: 1, city: 'Lahore', country: 'Pakistan', aqi: 445, status: 'Hazardous', pm25: 412 },
  { rank: 2, city: 'Delhi-NCR', country: 'India', aqi: 388, status: 'Severe Smog', pm25: 342 },
  { rank: 3, city: 'Dhaka', country: 'Bangladesh', aqi: 275, status: 'Very Unhealthy', pm25: 225 },
  { rank: 4, city: 'Kolkata', country: 'India', aqi: 235, status: 'Very Unhealthy', pm25: 185 },
  { rank: 5, city: 'Mumbai', country: 'India', aqi: 172, status: 'Unhealthy', pm25: 86 },
  { rank: 6, city: 'Salt Lake City', country: 'USA (Inversion)', aqi: 168, status: 'Unhealthy', pm25: 88 },
  { rank: 7, city: 'Bakersfield', country: 'USA (Valley)', aqi: 154, status: 'Unhealthy', pm25: 64 },
  { rank: 8, city: 'London', country: 'United Kingdom', aqi: 68, status: 'Moderate', pm25: 19 },
];

export const CityRankingsTable: React.FC<CityRankingsTableProps> = ({ onSelectCity }) => {
  const getAQIBadge = (aqi: number) => {
    if (aqi > 300) return 'bg-rose-950 text-rose-300 border-rose-800';
    if (aqi > 200) return 'bg-purple-950 text-purple-300 border-purple-800';
    if (aqi > 150) return 'bg-orange-950 text-orange-300 border-orange-800';
    if (aqi > 100) return 'bg-amber-950 text-amber-300 border-amber-800';
    return 'bg-emerald-950 text-emerald-300 border-emerald-800';
  };

  const mapCityToKey = (cityName: string) => {
    const lower = cityName.toLowerCase();
    if (lower.includes('delhi')) return 'delhi-ncr';
    if (lower.includes('lahore')) return 'lahore';
    if (lower.includes('mumbai')) return 'mumbai';
    if (lower.includes('salt lake')) return 'salt-lake-city';
    if (lower.includes('bakersfield')) return 'bakersfield';
    if (lower.includes('london')) return 'london';
    return 'delhi-ncr';
  };

  return (
    <div className="hud-panel rounded-3xl p-6 sm:p-7 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 shadow-md">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Live Global & Regional Smog Leaderboard
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800 font-bold">
                Real-Time Rank
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparative particulate index across global pollution epicenters (Inspired by AQI.in World Ranking)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Updated across 10,000+ stations</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-white/5 uppercase tracking-wider text-[10px]">
              <th className="pb-3 pl-3">Rank</th>
              <th className="pb-3">City & Basin</th>
              <th className="pb-3">Country</th>
              <th className="pb-3 text-right">Live AQI</th>
              <th className="pb-3 text-right">PM2.5 (µg/m³)</th>
              <th className="pb-3 text-center">Smog Status</th>
              <th className="pb-3 pr-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {GLOBAL_CITY_RANKINGS.map((city) => (
              <tr 
                key={city.rank}
                className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                onClick={() => onSelectCity(mapCityToKey(city.city))}
              >
                <td className="py-3.5 pl-3 font-mono font-bold text-slate-400">
                  #{city.rank}
                </td>
                <td className="py-3.5 font-bold text-white flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                  {city.city}
                </td>
                <td className="py-3.5 text-slate-300">
                  {city.country}
                </td>
                <td className="py-3.5 text-right font-black font-mono text-sm text-white">
                  {city.aqi}
                </td>
                <td className="py-3.5 text-right font-mono text-slate-300">
                  {city.pm25}
                </td>
                <td className="py-3.5 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getAQIBadge(city.aqi)}`}>
                    {city.status}
                  </span>
                </td>
                <td className="py-3.5 pr-3 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCity(mapCityToKey(city.city));
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 px-2.5 py-1 rounded-lg border border-cyan-800 transition-colors"
                  >
                    <span>View Telemetry</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
