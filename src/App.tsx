import React, { useState } from 'react';
import { 
  Wind, 
  Sparkles, 
  BarChart, 
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

export const App: React.FC = () => {
  const [selectedCityKey, setSelectedCityKey] = useState<string>('delhi-ncr');
  const [aqiData, setAqiData] = useState<AirQualityData>(CITIES_DATA['delhi-ncr']);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai-assistant' | 'diy-guide'>('dashboard');
  const [actionCategoryFilter, setActionCategoryFilter] = useState<string>('all');

  const [familyProfile, setFamilyProfile] = useState<FamilyProfile>({
    name: 'Gupta Household',
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

  const handleCityChange = (newCityKey: string) => {
    setSelectedCityKey(newCityKey);
    if (CITIES_DATA[newCityKey]) {
      setAqiData(CITIES_DATA[newCityKey]);
    }
  };

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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
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
        {/* Real-time Atmospheric AQI Card (Always Top) */}
        <AQIOverviewCard
          data={aqiData}
          selectedCityKey={selectedCityKey}
          onCityChange={handleCityChange}
        />

        {activeTab === 'dashboard' ? (
          <>
            {/* Direct Impact Ledger Bar */}
            <ImpactDashboard actions={actions} />

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
        ) : (
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
            AeroPulse — Urban Air Quality & Winter Smog Assistant. Built with Impeccable Design Standards.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>WHO Air Guidelines</span>
            <span>EPA PM2.5 Scale</span>
            <span>Corsi-Rosenthal Clean Air Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
