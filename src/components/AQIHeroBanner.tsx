import React from 'react';
import { 
  Sun, 
  MapPin, 
  Share2, 
  Heart, 
  ArrowUpRight
} from 'lucide-react';
import { AirQualityData } from '../types';

interface AQIHeroBannerProps {
  data: AirQualityData;
  onLocateMe: () => void;
  isLocating?: boolean;
}

export const AQIHeroBanner: React.FC<AQIHeroBannerProps> = ({
  data,
  onLocateMe,
  isLocating,
}) => {
  // Map AQI to AQI.in signature palette & character states
  const getAQITheme = (aqi: number) => {
    if (aqi <= 50) return {
      category: 'Good',
      color: '#10b981', // green
      bgGradient: 'from-[#0b291e] via-[#0f172a] to-[#080d1a]',
      avatarEmoji: '😊',
      adviceText: 'The air is fresh and free from toxins. Enjoy outdoor activities without concerns.',
      maskStatus: 'No Mask Needed'
    };
    if (aqi <= 100) return {
      category: 'Moderate',
      color: '#f59e0b', // amber
      bgGradient: 'from-[#2e230b] via-[#0f172a] to-[#080d1a]',
      avatarEmoji: '😐',
      adviceText: 'Air quality is acceptable for most, but sensitive individuals might experience mild discomfort.',
      maskStatus: 'Optional for Sensitive'
    };
    if (aqi <= 150) return {
      category: 'Poor',
      color: '#f97316', // orange
      bgGradient: 'from-[#331c0a] via-[#0f172a] to-[#080d1a]',
      avatarEmoji: '😷',
      adviceText: 'Breathing may become slightly uncomfortable, especially for those with respiratory issues.',
      maskStatus: 'Wear Cloth/Surgical Mask'
    };
    if (aqi <= 200) return {
      category: 'Unhealthy',
      color: '#e11d48', // deep rose/red (like in screenshot)
      bgGradient: 'from-[#420f1c] via-[#1c0f18] to-[#0d111d]',
      avatarEmoji: '😷',
      adviceText: 'This air quality is particularly risky for children, pregnant women, and the elderly. Limit outdoor activities.',
      maskStatus: 'N95 / FFP2 Essential'
    };
    if (aqi <= 300) return {
      category: 'Severe',
      color: '#8b5cf6', // purple
      bgGradient: 'from-[#340f42] via-[#170e24] to-[#0d111d]',
      avatarEmoji: '🤢',
      adviceText: 'Prolonged exposure can cause chronic health issues or organ damage. Avoid all outdoor physical activity.',
      maskStatus: 'N95 Mandatory + Air Scrubbers'
    };
    return {
      category: 'Hazardous',
      color: '#b91c1c', // dark crimson
      bgGradient: 'from-[#540810] via-[#24080d] to-[#0d111d]',
      avatarEmoji: '☣️',
      adviceText: 'Dangerously high pollution levels. Emergency respiratory advisory in effect with continuous air filtration required.',
      maskStatus: 'Strict Lockdown & Medical Mask'
    };
  };

  const theme = getAQITheme(data.aqi);

  // Position on spectrum bar (0 to 350)
  const spectrumPercent = Math.min(100, Math.max(2, (data.aqi / 350) * 100));

  return (
    <div className={`w-full rounded-[28px] border border-[#2b354d] bg-gradient-to-r ${theme.bgGradient} p-6 sm:p-8 shadow-2xl relative overflow-hidden`}>
      {/* City Monument Skyline vector silhouette watermark at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-28 opacity-15 pointer-events-none bg-repeat-x bg-bottom"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath fill='%23ffffff' d='M0,120 L0,80 L20,80 L20,60 L30,60 L30,40 L40,20 L50,40 L50,80 L80,80 L90,30 L110,30 L120,80 L160,80 L160,50 L190,50 L190,80 L240,80 L260,10 L280,10 L300,80 L360,80 L380,45 L400,80 L460,80 L480,25 L500,80 L550,80 L550,55 L580,55 L580,80 L640,80 L670,15 L700,80 L760,80 L780,40 L800,80 L860,80 L890,20 L920,80 L980,80 L1000,50 L1030,80 L1080,80 L1100,30 L1130,80 L1200,80 L1200,120 Z'/%3E%3C/svg%3E")`,
          backgroundSize: '800px 100px'
        }}
      />

      {/* Top Bar: Title & Geolocation info */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Real-time Air Quality Index (AQI)
          </h2>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium mt-1">
            <span className="text-white font-bold">{data.city}</span>
            <span>•</span>
            <span className="text-slate-400">{data.region}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Last Updated: {data.lastUpdated || '2026-11-20 18:25:00 (Local Time)'}
          </p>
        </div>

        {/* Action icons (Locate Me, Favorite, Share) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#1e2738]/80 hover:bg-[#2b374e] text-cyan-300 border border-cyan-800 transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#00c8b3]" />
            <span>{isLocating ? 'Locating...' : 'Locate me'}</span>
          </button>
          <button className="p-2 rounded-full bg-[#1e2738]/80 hover:bg-[#2b374e] text-slate-300 border border-slate-700 transition-all">
            <Heart className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Air Quality link copied to clipboard!');
            }}
            className="p-2 rounded-full bg-[#1e2738]/80 hover:bg-[#2b374e] text-slate-300 border border-slate-700 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Layout: Big AQI Number + Mascot Avatar + Weather Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Side: Big Number & Status */}
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">Live AQI</span>
          </div>

          <div className="flex items-baseline gap-3 my-1">
            <span 
              className="text-7xl sm:text-8xl font-black tracking-tighter"
              style={{ color: theme.color }}
            >
              {data.aqi}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">AQI (US)</span>
          </div>

          <div className="mt-1">
            <span className="text-xs text-slate-400 block mb-0.5">Air Quality is</span>
            <span 
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: theme.color }}
            >
              {theme.category}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono mt-4 text-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px]">PM2.5:</span>
              <span className="font-bold text-white text-sm">{data.pm25} µg/m³</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-700" />
            <div>
              <span className="text-slate-400 block text-[10px]">PM10:</span>
              <span className="font-bold text-white text-sm">{data.pm10} µg/m³</span>
            </div>
          </div>
        </div>

        {/* Center: Signature Mask Character Illustration (Matches AQI.in mascot) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center py-2">
          <div className="relative flex flex-col items-center">
            {/* Soft Ambient Smoke Clouds */}
            <div className="w-24 h-12 bg-white/10 rounded-full blur-xl absolute -top-4 -left-6 pointer-events-none" />
            <div className="w-24 h-12 bg-white/10 rounded-full blur-xl absolute -top-2 -right-6 pointer-events-none" />

            {/* Mascot Character Avatar SVG */}
            <div className="w-32 h-44 relative flex items-center justify-center">
              <svg viewBox="0 0 120 160" className="w-full h-full drop-shadow-2xl">
                {/* Hair */}
                <path d="M35 50 C20 30, 80 15, 95 45 C105 55, 100 80, 95 85 C85 65, 80 60, 60 55 C40 55, 35 65, 35 50 Z" fill="#2d1b10" />
                {/* Head */}
                <ellipse cx="60" cy="70" rx="26" ry="26" fill="#fcd3a1" />
                {/* Eyes closed squinting */}
                <path d="M48 65 Q54 62 58 66" stroke="#4a3728" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M68 66 Q72 62 78 65" stroke="#4a3728" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Eyebrows worried */}
                <path d="M46 58 Q53 55 57 60" stroke="#2d1b10" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M69 60 Q73 55 80 58" stroke="#2d1b10" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Protective Mask */}
                <path d="M42 75 Q60 70 78 75 Q82 92 60 96 Q38 92 42 75 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                {/* Mask Straps */}
                <path d="M42 78 Q36 75 35 82" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                <path d="M78 78 Q84 75 85 82" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                {/* Body / Kurta */}
                <path d="M44 98 L30 145 L90 145 L76 98 Z" fill="#ec4899" />
                <path d="M60 98 L60 125" stroke="#be185d" strokeWidth="2" strokeDasharray="3,3" />
                {/* Hands in pocket / sides */}
                <ellipse cx="32" cy="130" rx="5" ry="9" fill="#fcd3a1" />
                <ellipse cx="88" cy="130" rx="5" ry="9" fill="#fcd3a1" />
                {/* Legs */}
                <rect x="47" y="145" width="10" height="15" fill="#f8fafc" />
                <rect x="63" y="145" width="10" height="15" fill="#f8fafc" />
              </svg>
            </div>

            <div className="mt-2 text-center">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/40 border border-white/10 text-white backdrop-blur-sm">
                Status: {theme.maskStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Weather Box (AQI.in Card Style) */}
        <div className="lg:col-span-4 flex flex-col justify-end">
          <div className="bg-[#121927]/90 border border-[#2b354d] rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" />
                <div>
                  <div className="text-3xl font-black text-white">{data.temperature}°<span className="text-lg font-normal text-slate-400">c</span></div>
                  <span className="text-xs text-slate-300 font-semibold">
                    {data.inversionWarning ? 'Smog & Inversion' : 'Haze'}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-1 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Humidity</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{data.humidity}%</span>
              </div>
              <div className="border-x border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Wind Speed</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{data.windSpeed.split(' ')[0]} km/h</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Inversion</span>
                <span className="text-xs font-bold text-amber-400 mt-0.5 block">
                  {data.inversionWarning ? 'Active' : 'Normal'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spectrum Progress Bar (Good -> Hazardous) */}
      <div className="mt-8 pt-4 border-t border-white/10 relative z-10">
        <div className="relative">
          {/* Moving Needle Indicator */}
          <div 
            className="absolute -top-3 transition-all duration-500 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: `${spectrumPercent}%` }}
          >
            <div 
              className="w-3 h-3 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: theme.color }}
            />
            <div className="w-0.5 h-3 bg-white shadow-md" />
          </div>

          {/* Continuous Gradient Spectrum */}
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#10b981] via-[#f59e0b] via-[#f97316] via-[#e11d48] via-[#8b5cf6] to-[#7f1d1d] shadow-inner" />
        </div>

        {/* Labels underneath */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-400 font-medium mt-2">
          <span>Good<br/><strong className="text-slate-300 font-mono">0</strong></span>
          <span>Moderate<br/><strong className="text-slate-300 font-mono">50</strong></span>
          <span>Poor<br/><strong className="text-slate-300 font-mono">100</strong></span>
          <span>Unhealthy<br/><strong className="text-slate-300 font-mono">150</strong></span>
          <span>Severe<br/><strong className="text-slate-300 font-mono">200</strong></span>
          <span>Hazardous<br/><strong className="text-slate-300 font-mono">301+</strong></span>
        </div>
      </div>
    </div>
  );
};
