import React from 'react';
import { 
  ChevronRight, 
  Smartphone, 
  ChevronLeft, 
  Wind, 
  CloudFog, 
  Flame, 
  Sun 
} from 'lucide-react';
import { PollutantDetail } from '../types';

interface PollutantBreakdownGridProps {
  pollutants: PollutantDetail[];
  cityName?: string;
}

export const PollutantBreakdownGrid: React.FC<PollutantBreakdownGridProps> = ({ 
  pollutants, 
  cityName = 'Noida' 
}) => {
  // Find individual pollutants with fallbacks
  const pm25 = pollutants.find(p => p.code === 'pm25') || { value: 120, unit: 'µg/m³' };
  const pm10 = pollutants.find(p => p.code === 'pm10') || { value: 165, unit: 'µg/m³' };
  const co = pollutants.find(p => p.code === 'co') || { value: 1112, unit: 'ppb' };
  const so2 = pollutants.find(p => p.code === 'so2') || { value: 5, unit: 'ppb' };
  const no2 = pollutants.find(p => p.code === 'no2') || { value: 28, unit: 'ppb' };
  const o3 = pollutants.find(p => p.code === 'o3') || { value: 24, unit: 'ppb' };

  const cards = [
    {
      id: 'pm25',
      title: 'Particulate Matter',
      code: '(PM2.5)',
      value: pm25.value,
      unit: 'µg/m³',
      borderColor: 'border-[#e11d48]',
      icon: <Wind className="w-5 h-5 text-slate-400" />,
      hasAlert: false,
    },
    {
      id: 'pm10',
      title: 'Particulate Matter',
      code: '(PM10)',
      value: pm10.value,
      unit: 'µg/m³',
      borderColor: 'border-[#f97316]',
      icon: <CloudFog className="w-5 h-5 text-slate-400" />,
      hasAlert: true,
    },
    {
      id: 'co',
      title: 'Carbon Monoxide',
      code: '(CO)',
      value: co.value,
      unit: 'ppb',
      borderColor: 'border-[#10b981]',
      icon: <Flame className="w-5 h-5 text-slate-400" />,
      hasAlert: false,
    },
    {
      id: 'so2',
      title: 'Sulfur Dioxide',
      code: '(SO2)',
      value: so2.value,
      unit: 'ppb',
      borderColor: 'border-[#10b981]',
      icon: <CloudFog className="w-5 h-5 text-slate-400" />,
      hasAlert: false,
    },
    {
      id: 'no2',
      title: 'Nitrogen Dioxide',
      code: '(NO2)',
      value: no2.value,
      unit: 'ppb',
      borderColor: 'border-[#10b981]',
      icon: <Wind className="w-5 h-5 text-slate-400" />,
      hasAlert: false,
    },
    {
      id: 'o3',
      title: 'Ozone',
      code: '(O3)',
      value: o3.value,
      unit: 'ppb',
      borderColor: 'border-[#10b981]',
      icon: <Sun className="w-5 h-5 text-slate-400" />,
      hasAlert: false,
    },
  ];

  const trendingArticles = [
    {
      id: 1,
      ringColor: 'border-yellow-400',
      title: 'What Does a Good Air Quality Day Feel...',
      badgeBg: 'bg-emerald-900/60',
      imageDesc: 'Green trees sunlight'
    },
    {
      id: 2,
      ringColor: 'border-pink-500',
      title: "What's in the Air You're Breathing?",
      badgeBg: 'bg-purple-900/60',
      imageDesc: 'Breathing lungs illustration'
    },
    {
      id: 3,
      ringColor: 'border-amber-400',
      title: 'Delhi and Beijing: Could Delhi Have a...',
      badgeBg: 'bg-amber-900/60',
      imageDesc: 'City skyline smog'
    },
    {
      id: 4,
      ringColor: 'border-purple-400',
      title: '530 or 470? Which AQI Should You...',
      badgeBg: 'bg-slate-800',
      imageDesc: 'AQI comparison numbers'
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Section Header matching Screenshot 3 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Major Air Pollutants
          </h2>
          <p className="text-sm font-semibold text-[#00c8b3] mt-0.5">
            {cityName}
          </p>
        </div>

        <button 
          onClick={() => alert('AQI App is available on iOS App Store & Android Play Store.')}
          className="flex items-center gap-2 bg-[#182032] hover:bg-[#202b40] text-slate-200 border border-[#26334d] px-4 py-2 rounded-xl text-xs font-bold transition-all"
        >
          <Smartphone className="w-4 h-4 text-[#00c8b3]" />
          <span>Get AQI App</span>
        </button>
      </div>

      {/* 6 Pollutant Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`bg-[#182032] border border-[#232e47] rounded-2xl p-4 flex items-center justify-between relative transition-all hover:bg-[#1d273d] group cursor-pointer border-l-4 ${card.borderColor}`}
          >
            {card.hasAlert && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md animate-pulse">
                !
              </span>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#111726] border border-[#232e47] flex items-center justify-center shrink-0">
                {card.icon}
              </div>
              <div>
                <p className="text-xs text-slate-300 font-medium leading-tight">
                  {card.title}
                </p>
                <p className="text-[11px] text-slate-400 font-bold">
                  {card.code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-lg font-black text-white font-mono block leading-none">
                  {card.value}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {card.unit}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Trending in India Strip matching Screenshot 3 */}
      <div className="bg-[#182032] border border-[#232e47] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            Trending in <span className="text-[#00c8b3]">India</span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 rounded-full bg-[#111726] text-slate-400 hover:text-white flex items-center justify-center transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-6 h-6 rounded-full bg-[#111726] text-slate-400 hover:text-white flex items-center justify-center transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trendingArticles.map((art) => (
            <div
              key={art.id}
              className="bg-[#111726] hover:bg-[#151d30] border border-[#232e47] rounded-xl p-2.5 flex items-center gap-3 transition-all cursor-pointer group"
            >
              <div className={`w-11 h-11 rounded-full border-2 ${art.ringColor} p-0.5 shrink-0 overflow-hidden bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300`}>
                <span className="text-[10px] text-center leading-tight">AQI</span>
              </div>
              <p className="text-xs text-slate-300 group-hover:text-white line-clamp-2 leading-snug">
                {art.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
