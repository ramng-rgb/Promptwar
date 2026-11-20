import React, { useState } from 'react';

interface AQIScaleGuideProps {}

export const AQIScaleGuide: React.FC<AQIScaleGuideProps> = () => {
  const [activePollutant, setActivePollutant] = useState<'aqi' | 'pm25' | 'o3' | 'co' | 'so2' | 'no2'>('aqi');

  const scaleItems = [
    {
      category: 'Good',
      range: '0 to 50',
      color: '#10b981',
      bgBorder: 'border-l-4 border-l-[#10b981] bg-[#121927]',
      description: 'The air is fresh and free from toxins. Enjoy outdoor activities without any health concerns.',
      avatarDesc: 'Smiling green shirt (no mask)',
      avatarSvg: (
        <svg viewBox="0 0 40 50" className="w-8 h-10">
          <circle cx="20" cy="18" r="12" fill="#fcd3a1" />
          <circle cx="16" cy="16" r="1.5" fill="#1e293b" />
          <circle cx="24" cy="16" r="1.5" fill="#1e293b" />
          <path d="M15 22 Q20 27 25 22" stroke="#1e293b" strokeWidth="1.5" fill="none" />
          <path d="M10 32 L30 32 L26 48 L14 48 Z" fill="#10b981" />
        </svg>
      )
    },
    {
      category: 'Moderate',
      range: '51 to 100',
      color: '#f59e0b',
      bgBorder: 'border-l-4 border-l-[#f59e0b] bg-[#121927]',
      description: 'Air quality is acceptable for most, but sensitive individuals might experience mild discomfort.',
      avatarDesc: 'Neutral yellow shirt',
      avatarSvg: (
        <svg viewBox="0 0 40 50" className="w-8 h-10">
          <circle cx="20" cy="18" r="12" fill="#fcd3a1" />
          <circle cx="16" cy="16" r="1.5" fill="#1e293b" />
          <circle cx="24" cy="16" r="1.5" fill="#1e293b" />
          <line x1="16" y1="23" x2="24" y2="23" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M10 32 L30 32 L26 48 L14 48 Z" fill="#f59e0b" />
        </svg>
      )
    },
    {
      category: 'Poor',
      range: '101 to 150',
      color: '#f97316',
      bgBorder: 'border-l-4 border-l-[#f97316] bg-[#121927]',
      description: 'Breathing may become slightly uncomfortable, especially for those with respiratory issues.',
      avatarDesc: 'Coughing orange shirt',
      avatarSvg: (
        <svg viewBox="0 0 40 50" className="w-8 h-10">
          <circle cx="20" cy="18" r="12" fill="#fcd3a1" />
          <path d="M15 17 Q17 15 19 17" stroke="#1e293b" strokeWidth="1.5" fill="none" />
          <path d="M22 17 Q24 15 26 17" stroke="#1e293b" strokeWidth="1.5" fill="none" />
          <circle cx="20" cy="23" r="3" fill="#be185d" />
          <path d="M10 32 L30 32 L26 48 L14 48 Z" fill="#f97316" />
        </svg>
      )
    },
    {
      category: 'Unhealthy',
      range: '151 to 200',
      color: '#e11d48',
      bgBorder: 'border-l-4 border-l-[#e11d48] bg-[#121927]',
      description: 'This air quality is particularly risky for children, pregnant women, and the elderly. Limit outdoor activities.',
      avatarDesc: 'White mask on pink shirt',
      avatarSvg: (
        <svg viewBox="0 0 40 50" className="w-8 h-10">
          <circle cx="20" cy="18" r="12" fill="#fcd3a1" />
          <rect x="13" y="19" width="14" height="9" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M10 32 L30 32 L26 48 L14 48 Z" fill="#e11d48" />
        </svg>
      )
    },
    {
      category: 'Severe',
      range: '201 to 300',
      color: '#8b5cf6',
      bgBorder: 'border-l-4 border-l-[#8b5cf6] bg-[#121927]',
      description: 'Prolonged exposure can cause chronic health issues or organ damage. Avoid outdoor activities.',
      avatarDesc: 'Gas mask / ventilator',
      avatarSvg: (
        <svg viewBox="0 0 40 50" className="w-8 h-10">
          <circle cx="20" cy="18" r="12" fill="#fcd3a1" />
          <rect x="12" y="18" width="16" height="11" rx="4" fill="#334155" />
          <circle cx="20" cy="23" r="3" fill="#00c8b3" />
          <path d="M10 32 L30 32 L26 48 L14 48 Z" fill="#8b5cf6" />
        </svg>
      )
    },
    {
      category: 'Hazardous',
      range: '301+',
      color: '#b91c1c',
      bgBorder: 'border-l-4 border-l-[#b91c1c] bg-[#121927]',
      description: 'Dangerously high pollution levels. Emergency respiratory protocol in effect with prolonged exposure.',
      avatarDesc: 'Hazard respirator',
      avatarSvg: (
        <svg viewBox="0 0 40 50" className="w-8 h-10">
          <circle cx="20" cy="18" r="12" fill="#fcd3a1" />
          <rect x="11" y="17" width="18" height="13" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
          <path d="M10 32 L30 32 L26 48 L14 48 Z" fill="#b91c1c" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Title & Filter bar matching Screenshot 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Air Quality Index (AQI) Scale
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Know about the category of air quality index (AQI) your ambient air falls in and what it implies.
          </p>
        </div>

        {/* Pill switcher for AQI, PM2.5, O3, CO, SO2, NO2 */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#182032] border border-[#26334d] self-start md:self-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'aqi', label: 'AQI (US)' },
            { id: 'pm25', label: 'PM2.5' },
            { id: 'o3', label: 'O₃' },
            { id: 'co', label: 'CO' },
            { id: 'so2', label: 'SO₂' },
            { id: 'no2', label: 'NO₂' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePollutant(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activePollutant === tab.id
                  ? 'bg-[#00c8b3] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Categories + AQI.in Right Side Promotion card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: 6 AQI Category Rows */}
        <div className="lg:col-span-8 space-y-3">
          {scaleItems.map((item) => (
            <div
              key={item.category}
              className={`p-4 rounded-2xl border border-white/5 ${item.bgBorder} flex items-center justify-between gap-4 shadow-lg hover:border-slate-700 transition-all`}
            >
              <div className="w-24 sm:w-28 shrink-0">
                <span 
                  className="text-xs sm:text-sm font-black block"
                  style={{ color: item.color }}
                >
                  {item.category}
                </span>
                <span className="text-[11px] font-mono font-medium text-slate-400">
                  ({item.range})
                </span>
              </div>

              <div className="flex-1 text-xs text-slate-300 leading-relaxed">
                {item.description}
              </div>

              <div className="shrink-0 flex items-center justify-center p-1 bg-black/20 rounded-xl">
                {item.avatarSvg}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Cair+ Clean Air Device Card (Matching Screenshot 1) */}
        <div className="lg:col-span-4 bg-[#121927] border border-[#2b354d] rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[450px]">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-[#00c8b3] tracking-widest block">
              Indoor Air Sanctuary
            </span>
            <h3 className="text-xl font-black text-white leading-tight">
              AeroPulse DIY & Smart Monitors
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pair your home with our open-source Corsi-Rosenthal filtration blueprints or Wi-Fi connected laser PM2.5 sensors for real-time room sealing.
            </p>

            <div className="bg-[#182032] border border-[#26334d] p-3.5 rounded-2xl text-xs space-y-2 mt-4">
              <div className="flex justify-between text-slate-300">
                <span>Living Room PM2.5:</span>
                <strong className="text-emerald-400 font-mono">18 µg/m³</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Door Gap Infiltration:</span>
                <strong className="text-cyan-400 font-mono">Sealed (-85%)</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Filter Life (MERV-13):</span>
                <strong className="text-white font-mono">92% Remaining</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <button
              onClick={() => alert('View our step-by-step Corsi-Rosenthal Cube guide in the Dashboard Action cards!')}
              className="w-full py-2.5 rounded-xl bg-[#00c8b3] hover:bg-cyan-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-lg"
            >
              Get DIY Blueprints to Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
