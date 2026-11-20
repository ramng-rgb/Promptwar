export interface AreaStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25: number;
  pm10: number;
  status: string;
  dominantSource: string;
}

export interface CityConfig {
  key: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  stations: AreaStation[];
}

export const SUPPORTED_CITIES: CityConfig[] = [
  {
    key: 'delhi-ncr',
    name: 'Delhi-NCR',
    region: 'Indo-Gangetic Basin, India',
    lat: 28.6139,
    lng: 77.2090,
    stations: [
      { id: 'anand-vihar', name: 'Anand Vihar', lat: 28.6473, lng: 77.3153, aqi: 442, pm25: 395, pm10: 512, status: 'Hazardous Smog', dominantSource: 'Interstate Diesel Buses & Inversion' },
      { id: 'ito', name: 'ITO Intersection', lat: 28.6289, lng: 77.2407, aqi: 368, pm25: 310, pm10: 420, status: 'Severe', dominantSource: 'Vehicular Tailpipe Exhaust' },
      { id: 'rk-puram', name: 'R.K. Puram', lat: 28.5660, lng: 77.1767, aqi: 320, pm25: 260, pm10: 380, status: 'Severe', dominantSource: 'Urban Stagnation' },
      { id: 'punjabi-bagh', name: 'Punjabi Bagh', lat: 28.6692, lng: 77.1258, aqi: 385, pm25: 330, pm10: 460, status: 'Hazardous', dominantSource: 'Ring Road Freight Traffic' },
      { id: 'noida-sec62', name: 'Noida Sector 62', lat: 28.6271, lng: 77.3621, aqi: 340, pm25: 285, pm10: 410, status: 'Severe', dominantSource: 'Construction & Industrial Perimeter' },
      { id: 'gurugram-cybercity', name: 'Gurugram Cyber City', lat: 28.4950, lng: 77.0895, aqi: 295, pm25: 235, pm10: 340, status: 'Very Unhealthy', dominantSource: 'Highway Dust & Diesel Gensets' }
    ]
  },
  {
    key: 'mumbai',
    name: 'Mumbai',
    region: 'Konkan Coast, India',
    lat: 19.0760,
    lng: 72.8777,
    stations: [
      { id: 'bkc', name: 'Bandra Kurla Complex', lat: 19.0657, lng: 72.8687, aqi: 185, pm25: 98, pm10: 165, status: 'Unhealthy', dominantSource: 'Commercial Traffic & Metro Construction' },
      { id: 'colaba', name: 'Colaba Coastal', lat: 18.9067, lng: 72.8147, aqi: 112, pm25: 42, pm10: 88, status: 'Moderate', dominantSource: 'Marine Breeze Dispersion' },
      { id: 'chembur', name: 'Chembur East', lat: 19.0622, lng: 72.8997, aqi: 220, pm25: 125, pm10: 210, status: 'Very Unhealthy', dominantSource: 'Refinery & Industrial Corridor' },
      { id: 'andheri', name: 'Andheri West', lat: 19.1136, lng: 72.8397, aqi: 165, pm25: 84, pm10: 152, status: 'Unhealthy', dominantSource: 'Arterial Congestion' }
    ]
  },
  {
    key: 'lahore',
    name: 'Lahore',
    region: 'Punjab Plains, Pakistan',
    lat: 31.5497,
    lng: 74.3436,
    stations: [
      { id: 'mall-road', name: 'Mall Road', lat: 31.5580, lng: 74.3270, aqi: 450, pm25: 410, pm10: 530, status: 'Hazardous', dominantSource: 'Dense Trapped Smog' },
      { id: 'gulberg', name: 'Gulberg III', lat: 31.5120, lng: 74.3500, aqi: 395, pm25: 350, pm10: 480, status: 'Hazardous', dominantSource: 'Vehicular & Low Ventilation' },
      { id: 'dha-phase5', name: 'DHA Phase 5', lat: 31.4650, lng: 74.4050, aqi: 340, pm25: 290, pm10: 420, status: 'Severe', dominantSource: 'Suburban Haze' }
    ]
  },
  {
    key: 'salt-lake-city',
    name: 'Salt Lake City',
    region: 'Wasatch Front Basin, USA',
    lat: 40.7608,
    lng: -111.8910,
    stations: [
      { id: 'downtown-slc', name: 'Downtown SLC', lat: 40.7608, lng: -111.8910, aqi: 168, pm25: 88, pm10: 115, status: 'Unhealthy', dominantSource: 'Basin Thermal Inversion' },
      { id: 'sugar-house', name: 'Sugar House', lat: 40.7230, lng: -111.8600, aqi: 152, pm25: 78, pm10: 102, status: 'Unhealthy', dominantSource: 'Residential Wood Smoke' },
      { id: 'west-valley', name: 'West Valley', lat: 40.6917, lng: -111.9391, aqi: 175, pm25: 94, pm10: 128, status: 'Unhealthy', dominantSource: 'Industrial & Highway 215' }
    ]
  },
  {
    key: 'bakersfield',
    name: 'Central Valley (Bakersfield)',
    region: 'San Joaquin Valley, USA',
    lat: 35.3733,
    lng: -119.0187,
    stations: [
      { id: 'calif-ave', name: 'California Ave', lat: 35.3680, lng: -119.0250, aqi: 158, pm25: 72, pm10: 105, status: 'Unhealthy', dominantSource: 'Valley Stagnant Tule Fog' },
      { id: 'airport-rd', name: 'Meadowood / North', lat: 35.4200, lng: -119.0400, aqi: 142, pm25: 58, pm10: 89, status: 'Sensitive Groups', dominantSource: 'Agricultural Dust' }
    ]
  },
  {
    key: 'london',
    name: 'London',
    region: 'Greater London, UK',
    lat: 51.5074,
    lng: -0.1278,
    stations: [
      { id: 'marylebone', name: 'Marylebone Road', lat: 51.5225, lng: -0.1546, aqi: 75, pm25: 22, pm10: 38, status: 'Moderate', dominantSource: 'Roadside NO2 & Diesel' },
      { id: 'hyde-park', name: 'Hyde Park', lat: 51.5073, lng: -0.1657, aqi: 48, pm25: 12, pm10: 20, status: 'Good', dominantSource: 'Urban Canopy Dispersion' },
      { id: 'canary-wharf', name: 'Canary Wharf', lat: 51.5054, lng: -0.0235, aqi: 62, pm25: 18, pm10: 30, status: 'Moderate', dominantSource: 'Commercial Transit' }
    ]
  }
];

export async function fetchLiveWeatherData(lat: number, lng: number) {
  try {
    const [airRes, weatherRes] = await Promise.all([
      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm2_5,pm10,us_aqi&forecast_days=1`
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
      )
    ]);

    const airData = await airRes.json();
    const weatherData = await weatherRes.json();

    return {
      success: true,
      air: airData,
      weather: weatherData,
    };
  } catch (error) {
    console.error('Error fetching live weather & AQI:', error);
    return {
      success: false,
      error
    };
  }
}
