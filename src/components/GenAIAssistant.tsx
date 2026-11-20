import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Lightbulb, 
  ShieldCheck,
  PlusCircle
} from 'lucide-react';
import { ChatMessage, SustainableAction, AirQualityData, FamilyProfile } from '../types';

interface GenAIAssistantProps {
  aqiData: AirQualityData;
  profile: FamilyProfile;
  onAddCustomAction: (action: SustainableAction) => void;
}

export const GenAIAssistant: React.FC<GenAIAssistantProps> = ({
  aqiData,
  profile,
  onAddCustomAction,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Hello! I'm your AeroPulse GenAI Environmental Companion. I'm actively monitoring ${aqiData.city} (AQI: ${aqiData.aqi} - ${aqiData.category}) and your family profile. How can I assist you with indoor air hacks, commute optimization, or winter smog mitigation right now?`
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current && typeof chatBottomRef.current.scrollIntoView === 'function') {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Contextual generative response engine simulation
    setTimeout(() => {
      const lower = query.toLowerCase();
      let responseText = '';
      let suggestedAction: SustainableAction | undefined = undefined;

      if (lower.includes('corsi') || lower.includes('box fan') || lower.includes('diy filter') || lower.includes('purifier')) {
        responseText = `A Corsi-Rosenthal (C-R) box delivers equivalent Clean Air Delivery Rate (CADR 250-400 CFM) to $500 commercial HEPA units for ~$60. Given that your city (${aqiData.city}) has PM2.5 levels at ${aqiData.pm25} µg/m³, assemble with 4 MERV-13 filters and a standard 20" box fan pointing upward. Make sure the arrows point inwards!`;
        suggestedAction = {
          id: `custom-cr-${Date.now()}`,
          title: 'Assemble Bedroom Corsi-Rosenthal Box',
          category: 'indoor_hack',
          impactPmOffsetGrams: 90,
          co2SavedKg: 12.0,
          description: 'Construct a 4-filter MERV-13 air cleaner for dedicated bedroom filtration.',
          difficulty: 'Easy',
          effectiveness: 'Critical',
          implemented: false,
          steps: [
            'Obtain four 20x20x1 or 20x20x2 MERV-13 filters and one 20" box fan.',
            'Tape into a square box with airflow directional arrows pointed IN.',
            'Seal bottom with cardboard plate; seal fan on top pulling air OUT.',
            'Run continuously on Medium in bedrooms with doors shut.'
          ]
        };
      } else if (lower.includes('child') || lower.includes('baby') || lower.includes('infant') || lower.includes('school')) {
        responseText = `Children inhale 50% more air per pound of body weight than adults, and during morning smog inversions (${aqiData.city} is currently under an inversion advisory), PM2.5 stays concentrated below 2 meters off the ground. Keep children strictly indoors before 10:30 AM when solar mixing begins. If school transit is mandatory, ensure a well-fitted pediatric N95 mask is worn.`;
      } else if (lower.includes('commute') || lower.includes('car') || lower.includes('travel') || lower.includes('drive')) {
        responseText = `In ${aqiData.city}, morning vehicular exhaust gets trapped beneath the thermal inversion layer between 7:30 AM and 9:45 AM. If you must commute, switch your car AC to 'Internal Air Recirculation' to cut cabin soot ingress by 80%, or shift commute departure by 40 minutes. Switching to electric rail/metro cuts your family's personal pollution footprint by ~140g of PM2.5 weekly.`;
      } else if (lower.includes('plant') || lower.includes('indoor plants') || lower.includes('spider plant') || lower.includes('snake plant')) {
        responseText = `While indoor plants (snake plant, peace lily, spider plant) remove certain volatile organic compounds (VOCs like benzene/formaldehyde) over long periods, peer-reviewed tests show they cannot filter fine PM2.5 or smoke particulate at a meaningful CADR. Do not rely on plants as an alternative to mechanical MERV-13/HEPA filtration!`;
      } else if (lower.includes('towel') || lower.includes('window') || lower.includes('door') || lower.includes('draft') || lower.includes('seal')) {
        responseText = `Placing damp micro-fiber rolled towels along outside door sills and window tracks creates a physical and electrostatic capillary trap for micro-soot particles. This stops draft penetration and cuts infiltration by up to 35% without needing expensive weatherstripping right away.`;
      } else {
        responseText = `Based on ${aqiData.city}'s current AQI of ${aqiData.aqi} (${aqiData.category}) and your family profile (${profile.hasChildren ? 'children present, ' : ''}${profile.hasAsthmaOrRespiratory ? 'asthma risk noted, ' : ''}heating: ${profile.heatingType}):\n\n1. Keep all perimeter windows sealed until 1:00 PM.\n2. Run indoor air filtration on continuous circulation.\n3. Avoid open-flame cooking without lids.\n4. Avoid outdoor cardiovascular exertion until the afternoon temperature trough.`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        suggestedAction,
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const samplePrompts = [
    'How do I build a DIY Corsi-Rosenthal box?',
    'Safe routine for children during severe smog?',
    'Can indoor plants filter PM2.5 smoke?',
    'Best commute timing during winter inversion?'
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col h-[600px] shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">AeroPulse GenAI Smog Advisor</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
                Context-Aware LLM
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded in {aqiData.city} meteorological data & WHO pollution frameworks
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Health Safety Verified</span>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-cyan-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.suggestedAction && (
                <div className="mt-3 pt-3 border-t border-slate-800 bg-slate-900/90 rounded-xl p-3 border">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Suggested Action Generated:
                    </span>
                    <button
                      onClick={() => onAddCustomAction(msg.suggestedAction!)}
                      className="text-[11px] flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add to Action Plan
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">{msg.suggestedAction.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{msg.suggestedAction.description}</p>
                </div>
              )}

              <span className={`block text-[10px] mt-2 opacity-60 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl w-32 border border-slate-800">
            <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="animate-pulse">Analyzing...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-[11px] font-medium text-slate-400 shrink-0">Try asking:</span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-[11px] whitespace-nowrap bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about smog hacks, door seals, or routines for ${aqiData.city}...`}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          aria-label="Ask the urban air quality assistant"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold p-2.5 rounded-xl transition-colors cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
