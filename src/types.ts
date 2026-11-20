export interface AirQualityData {
  city: string;
  region: string;
  aqi: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Severe Smog / Hazardous';
  primaryPollutant: string;
  pm25: number; // ug/m3
  pm10: number; // ug/m3
  temperature: number; // °C
  humidity: number; // %
  inversionWarning: boolean;
  windSpeed: string;
  healthAdvisory: string;
  isLive?: boolean;
  lastUpdated?: string;
  gases?: {
    co?: number;
    no2?: number;
    so2?: number;
    o3?: number;
  };
  forecast: {
    time: string;
    aqi: number;
    suitableFor: string;
  }[];
}

export interface FamilyProfile {
  name: string;
  membersCount: number;
  hasChildren: boolean;
  hasElderly: boolean;
  hasAsthmaOrRespiratory: boolean;
  commuteType: 'car' | 'metro_transit' | 'bike_walk' | 'remote';
  livingType: 'apartment' | 'house';
  heatingType: 'wood_coal' | 'natural_gas' | 'electric_heatpump';
  airPurifierAvailable: boolean;
}

export interface SustainableAction {
  id: string;
  title: string;
  category: 'routine' | 'indoor_hack' | 'sustainable_alt' | 'community';
  impactPmOffsetGrams: number; // Particulate matter prevented (grams)
  co2SavedKg: number; // CO2 reduction
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Proactive';
  effectiveness: 'High' | 'Very High' | 'Critical';
  implemented: boolean;
  steps: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  suggestedAction?: SustainableAction;
}
