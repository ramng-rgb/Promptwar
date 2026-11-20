import { AirQualityData, SustainableAction } from './types';

export const CITIES_DATA: Record<string, AirQualityData> = {
  'delhi-ncr': {
    city: 'Delhi-NCR',
    region: 'Indo-Gangetic Basin',
    aqi: 388,
    category: 'Severe Smog / Hazardous',
    primaryPollutant: 'PM2.5',
    pm25: 342,
    pm10: 480,
    temperature: 13,
    humidity: 78,
    inversionWarning: true,
    windSpeed: '2.4 km/h (Calm - Trapping Smog)',
    healthAdvisory: 'High thermal inversion in effect until 11:30 AM. Outdoor exercise strictly discouraged. Children & elderly must stay indoors with sealed windows.',
    forecast: [
      { time: '06:00', aqi: 412, suitableFor: 'Critical: Seal doors & run scrubbers' },
      { time: '09:00', aqi: 420, suitableFor: 'Avoid morning school/work outdoor exposure' },
      { time: '12:00', aqi: 350, suitableFor: 'Sun warming slightly disperses inversion layer' },
      { time: '15:00', aqi: 290, suitableFor: 'Best daytime window for essential errands' },
      { time: '18:00', aqi: 360, suitableFor: 'Evening inversion begins - seal perimeter' },
      { time: '21:00', aqi: 395, suitableFor: 'Night accumulation spike' },
    ],
  },
  'lahore': {
    city: 'Lahore',
    region: 'Punjab Plains',
    aqi: 435,
    category: 'Severe Smog / Hazardous',
    primaryPollutant: 'PM2.5',
    pm25: 398,
    pm10: 520,
    temperature: 12,
    humidity: 82,
    inversionWarning: true,
    windSpeed: '1.8 km/h',
    healthAdvisory: 'Dense smog blanket and industrial boundary trapping. Emergency mask mandate (N95/FFP2).',
    forecast: [
      { time: '06:00', aqi: 450, suitableFor: 'Extreme hazard - stay enclosed' },
      { time: '12:00', aqi: 380, suitableFor: 'Elevated smog' },
      { time: '15:00', aqi: 320, suitableFor: 'Sub-peak transit window' },
      { time: '20:00', aqi: 440, suitableFor: 'Hazardous return of cold-air pool' },
    ],
  },
  'salt-lake-city': {
    city: 'Salt Lake City',
    region: 'Wasatch Front Basin',
    aqi: 168,
    category: 'Unhealthy',
    primaryPollutant: 'PM2.5',
    pm25: 88,
    pm10: 110,
    temperature: -2,
    humidity: 65,
    inversionWarning: true,
    windSpeed: '3.1 km/h',
    healthAdvisory: 'Valley thermal inversion trapping woodsmoke and tailpipe exhaust. Limit heavy outdoor exertion.',
    forecast: [
      { time: '07:00', aqi: 175, suitableFor: 'Heavy vehicle commute exhaust trapping' },
      { time: '12:00', aqi: 155, suitableFor: 'Mild mixing at ridge tops' },
      { time: '16:00', aqi: 140, suitableFor: 'Best afternoon window' },
      { time: '20:00', aqi: 170, suitableFor: 'Night cold valley pool formation' },
    ],
  },
  'bakersfield': {
    city: 'Central Valley (Bakersfield)',
    region: 'San Joaquin Valley',
    aqi: 154,
    category: 'Unhealthy',
    primaryPollutant: 'PM2.5',
    pm25: 64,
    pm10: 95,
    temperature: 9,
    humidity: 70,
    inversionWarning: true,
    windSpeed: '4.0 km/h',
    healthAdvisory: 'Stagnant valley fog (Tule fog) exacerbating particulate accumulation. Sensitive groups need indoor filtration.',
    forecast: [
      { time: '08:00', aqi: 160, suitableFor: 'Dense morning haze' },
      { time: '13:00', aqi: 135, suitableFor: 'Moderate ventilation window' },
      { time: '18:00', aqi: 155, suitableFor: 'Nighttime stagnation' },
    ],
  },
  'london': {
    city: 'London',
    region: 'Greater London',
    aqi: 68,
    category: 'Moderate',
    primaryPollutant: 'NO2 & PM2.5',
    pm25: 19,
    pm10: 32,
    temperature: 6,
    humidity: 80,
    inversionWarning: false,
    windSpeed: '14.2 km/h',
    healthAdvisory: 'Moderate roadside pollution. Unusually sensitive individuals should consider taking side streets rather than main arterial corridors.',
    forecast: [
      { time: '08:00', aqi: 75, suitableFor: 'Morning rush hour elevated NO2' },
      { time: '14:00', aqi: 55, suitableFor: 'Good outdoor walk opportunity' },
      { time: '19:00', aqi: 70, suitableFor: 'Standard commute peak' },
    ],
  }
};

export const INITIAL_SUSTAINABLE_ACTIONS: SustainableAction[] = [
  {
    id: 'corsi-rosenthal',
    title: 'DIY Corsi-Rosenthal Cube Air Purifier',
    category: 'indoor_hack',
    impactPmOffsetGrams: 85,
    co2SavedKg: 14.5,
    description: 'Build a low-cost, medical-grade air filtration cube using a standard 20-inch box fan and 4 MERV-13 furnace filters.',
    difficulty: 'Easy',
    effectiveness: 'Critical',
    implemented: false,
    steps: [
      'Tape 4 MERV-13 (20x20x1) filters together in a cube shape with airflow arrows pointing inward.',
      'Cut a cardboard square for the bottom base and tape airtight.',
      'Place a standard 20-inch box fan on top facing upward (blowing air out), and duct tape all edges tightly.',
      'Operate on Medium speed in central family room to clean 600 sq ft in 25 minutes for under $65.'
    ]
  },
  {
    id: 'door-towel-seal',
    title: 'Wet-Towel Draft & Gap Barrier',
    category: 'indoor_hack',
    impactPmOffsetGrams: 30,
    co2SavedKg: 3.2,
    description: 'Stop external smog infiltration through door thresholds, balcony gaps, and window seams during morning thermal inversions.',
    difficulty: 'Easy',
    effectiveness: 'Very High',
    implemented: false,
    steps: [
      'Dampen a micro-fiber bath towel or rolled cloth draft stopper.',
      'Place snugly along the base of exterior doors and balcony sliders.',
      'The moist textile traps ultra-fine particulate matter that standard door sweeps let bypass.'
    ]
  },
  {
    id: 'inversion-commute-shift',
    title: 'Thermal Inversion Commute Shift (Shift 45m)',
    category: 'routine',
    impactPmOffsetGrams: 110,
    co2SavedKg: 8.8,
    description: 'Delay morning transit until solar heating breaks the ground inversion layer (typically between 10:15 - 11:30 AM).',
    difficulty: 'Moderate',
    effectiveness: 'High',
    implemented: false,
    steps: [
      'Coordinate with workplace/school for flexible winter arrival, or transition first morning call to remote.',
      'Avoid standing near traffic intersections between 7:30 - 9:30 AM when heavy exhaust pools at street level.',
      'Cuts total lung particulate deposition by up to 48%.'
    ]
  },
  {
    id: 'eco-transit-carpool',
    title: 'Switch Commute to Metro / Shared Electric Transit',
    category: 'sustainable_alt',
    impactPmOffsetGrams: 140,
    co2SavedKg: 19.4,
    description: 'Leave personal internal combustion car parked. Opt for electrified underground metro or neighborhood pooled ride.',
    difficulty: 'Easy',
    effectiveness: 'Very High',
    implemented: false,
    steps: [
      'Use underground metro stations where air is filtered and separated from surface vehicular exhaust.',
      'Eliminates 12 kg of CO2 and stops localized tire/brake dust from entering neighborhood breathing zones.'
    ]
  },
  {
    id: 'clean-stovetop-protocol',
    title: 'Low-Emission Cooking Protocol (Cover & Induction)',
    category: 'indoor_hack',
    impactPmOffsetGrams: 45,
    co2SavedKg: 5.1,
    description: 'Indoor cooking on winter days without ventilation spikes indoor PM2.5 above 300 µg/m³. Switch to lids-on & induction.',
    difficulty: 'Easy',
    effectiveness: 'High',
    implemented: false,
    steps: [
      'Keep tight-fitting lids on all frying and boiling pans.',
      'Substitute open gas flame cooking with portable induction cookers or electric air fryers during red-alert days.',
      'Never open windows while outdoor AQI > 200; use internal recirculating cooker hoods with active carbon.'
    ]
  },
  {
    id: 'no-idle-school-zone',
    title: 'Community "Engine Off" School Drop-Off Pledge',
    category: 'community',
    impactPmOffsetGrams: 180,
    co2SavedKg: 24.0,
    description: 'Promote 0-idling zones outside local schools and community daycares during winter morning pick-ups.',
    difficulty: 'Proactive',
    effectiveness: 'Critical',
    implemented: false,
    steps: [
      'Turn off engine immediately upon parking or waiting at school gates.',
      'Share digital flyers with school parent groups on child-height PM2.5 concentrations near idling tailpipes.',
      'Protects developing lungs from direct exposure during peak inversion hours.'
    ]
  }
];
