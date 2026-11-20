import React from 'react';
import { 
  Users, 
  Baby, 
  HeartPulse, 
  SlidersHorizontal,
  CheckCircle2,
  Wind
} from 'lucide-react';
import { FamilyProfile } from '../types';

interface FamilyProfileCustomizerProps {
  profile: FamilyProfile;
  onChange: (updated: FamilyProfile) => void;
}

export const FamilyProfileCustomizer: React.FC<FamilyProfileCustomizerProps> = ({
  profile,
  onChange,
}) => {
  const toggleBoolean = (key: keyof FamilyProfile) => {
    onChange({
      ...profile,
      [key]: !profile[key],
    });
  };

  return (
    <div className="hud-panel rounded-3xl p-6 sm:p-7 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-md">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Household & Lifestyle Profile</h3>
            <p className="text-xs text-slate-400">Tailors low-emission routines and indoor hacks to your family</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-white/5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Dynamic Adaptation Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Household Composition */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
            Vulnerabilities
          </label>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => toggleBoolean('hasChildren')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                profile.hasChildren
                  ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Baby className="w-3.5 h-3.5" /> Children / Infants
              </span>
              {profile.hasChildren && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
            </button>

            <button
              type="button"
              onClick={() => toggleBoolean('hasAsthmaOrRespiratory')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                profile.hasAsthmaOrRespiratory
                  ? 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <HeartPulse className="w-3.5 h-3.5" /> Asthma / Bronchitis
              </span>
              {profile.hasAsthmaOrRespiratory && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />}
            </button>
          </div>
        </div>

        {/* Daily Commute */}
        <div className="space-y-2">
          <label htmlFor="commute-select" className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
            Primary Daily Commute
          </label>
          <div className="relative">
            <select
              id="commute-select"
              value={profile.commuteType}
              onChange={(e) => onChange({ ...profile, commuteType: e.target.value as FamilyProfile['commuteType'] })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-medium focus:ring-1 focus:ring-cyan-400 focus:outline-none"
            >
              <option value="car">Personal Car (Combustion)</option>
              <option value="metro_transit">Metro / Electric Transit</option>
              <option value="bike_walk">Cycling / Walking</option>
              <option value="remote">Work from Home / Remote</option>
            </select>
          </div>
          <p className="text-[11px] text-slate-400">
            {profile.commuteType === 'car' ? 'High potential for idling reductions & transit shift.' : 'Low personal tailpipe emissions.'}
          </p>
        </div>

        {/* Home Heating & Structure */}
        <div className="space-y-2">
          <label htmlFor="heating-select" className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
            Winter Heating Method
          </label>
          <select
            id="heating-select"
            value={profile.heatingType}
            onChange={(e) => onChange({ ...profile, heatingType: e.target.value as FamilyProfile['heatingType'] })}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-medium focus:ring-1 focus:ring-cyan-400 focus:outline-none"
          >
            <option value="natural_gas">Gas Furnace / Radiators</option>
            <option value="wood_coal">Wood Stove / Biomass / Chulha</option>
            <option value="electric_heatpump">Electric Heat Pump / AC</option>
          </select>
          {profile.heatingType === 'wood_coal' && (
            <p className="text-[11px] text-amber-400 font-medium">
              High indoor particulate emitter. Urgent DIY seal hack advised.
            </p>
          )}
        </div>

        {/* Indoor Air Purifier Status */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
            Air Filtration Status
          </label>
          <button
            type="button"
            onClick={() => toggleBoolean('airPurifierAvailable')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium border transition-colors ${
              profile.airPurifierAvailable
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-amber-950/60 border-amber-500/60 text-amber-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Wind className="w-4 h-4" />
              {profile.airPurifierAvailable ? 'HEPA Purifier Active' : 'No Commercial Purifier'}
            </span>
            {profile.airPurifierAvailable ? (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Protected</span>
            ) : (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">DIY Hacks Needed</span>
            )}
          </button>
          <p className="text-[11px] text-slate-400">
            {profile.airPurifierAvailable
              ? 'Recommendation: Place in bedroom, close perimeter.'
              : 'Recommendation: Assemble Corsi-Rosenthal Box ($50).'}
          </p>
        </div>
      </div>
    </div>
  );
};
