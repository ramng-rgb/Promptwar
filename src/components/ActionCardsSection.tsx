import React, { useState } from 'react';
import { 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Leaf, 
  Home, 
  Compass, 
  Users, 
  Sparkles,
  Zap,
  TrendingDown
} from 'lucide-react';
import { SustainableAction } from '../types';

interface ActionCardsSectionProps {
  actions: SustainableAction[];
  onToggleAction: (actionId: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const ActionCardsSection: React.FC<ActionCardsSectionProps> = ({
  actions,
  onToggleAction,
  activeFilter,
  onFilterChange,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredActions = actions.filter(action => {
    if (activeFilter === 'all') return true;
    return action.category === activeFilter;
  });

  const getCategoryBadge = (category: SustainableAction['category']) => {
    switch (category) {
      case 'indoor_hack':
        return { label: 'Indoor Hack', icon: Home, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' };
      case 'routine':
        return { label: 'Daily Routine', icon: Compass, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' };
      case 'sustainable_alt':
        return { label: 'Sustainable Alt', icon: Leaf, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
      case 'community':
        return { label: 'Community Action', icon: Users, color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Tailored Low-Emission Routines & Clean Air Hacks
          </h2>
          <p className="text-xs text-slate-400">
            Select actions to adopt today and see your family's direct pollution reduction in real time
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          {[
            { id: 'all', label: 'All Recommendations' },
            { id: 'indoor_hack', label: 'Indoor Hacks' },
            { id: 'routine', label: 'Daily Routines' },
            { id: 'sustainable_alt', label: 'Sustainable Alts' },
            { id: 'community', label: 'Community' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                activeFilter === filter.id
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActions.map(action => {
          const badge = getCategoryBadge(action.category);
          const Icon = badge.icon;
          const isExpanded = expandedId === action.id;

          return (
            <div
              key={action.id}
              className={`rounded-3xl border transition-all duration-300 p-5 relative ${
                action.implemented
                  ? 'bg-slate-900/90 border-emerald-500/50 shadow-xl ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/70 border-white/5 hover:border-slate-700 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}>
                    <Icon className="w-3 h-3" />
                    {badge.label}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                    {action.difficulty}
                  </span>
                </div>

                <button
                  onClick={() => onToggleAction(action.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    action.implemented
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  aria-pressed={action.implemented}
                >
                  <CheckCircle className={`w-3.5 h-3.5 ${action.implemented ? 'text-slate-950' : 'text-slate-400'}`} />
                  {action.implemented ? 'Action Implemented' : 'Adopt Action'}
                </button>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-slate-100 mt-2.5">
                {action.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {action.description}
              </p>

              {/* Impact Metrics Bar */}
              <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-emerald-400 font-medium">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>-{action.impactPmOffsetGrams}g PM2.5 prevented</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400 font-medium">
                    <Zap className="w-3.5 h-3.5" />
                    <span>-{action.co2SavedKg}kg CO₂</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpand(action.id)}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs font-medium focus:outline-none"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? 'Hide Steps' : 'Step-by-Step Guide'}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expandable Step-by-Step Instructions */}
              {isExpanded && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 animate-fadeIn">
                  <h4 className="font-semibold text-cyan-300 uppercase tracking-wider text-[11px] mb-2">
                    Implementation Guide:
                  </h4>
                  <ol className="space-y-1.5 list-decimal list-inside text-slate-300">
                    {action.steps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">
                        <span className="text-slate-200">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
