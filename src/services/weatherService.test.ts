import { describe, it, expect } from 'vitest';
import { SUPPORTED_CITIES, fetchLiveWeatherData } from './weatherService';

describe('Feature 7: Weather Service & Station Data Integrity', () => {
  it('has comprehensive hotspot station definitions for each supported city', () => {
    expect(SUPPORTED_CITIES.length).toBeGreaterThanOrEqual(6);

    const delhi = SUPPORTED_CITIES.find(c => c.key === 'delhi-ncr');
    expect(delhi).toBeDefined();
    expect(delhi?.stations.length).toBeGreaterThanOrEqual(5);

    const anandVihar = delhi?.stations.find(s => s.id === 'anand-vihar');
    expect(anandVihar?.aqi).toBeGreaterThan(400);
    expect(anandVihar?.dominantSource).toContain('Diesel');

    const mumbai = SUPPORTED_CITIES.find(c => c.key === 'mumbai');
    expect(mumbai).toBeDefined();
    expect(mumbai?.stations.length).toBeGreaterThanOrEqual(4);
  });

  it('connects to Open-Meteo Air Quality & Weather API or handles fallback gracefully', async () => {
    const delhi = SUPPORTED_CITIES.find(c => c.key === 'delhi-ncr')!;
    const res = await fetchLiveWeatherData(delhi.lat, delhi.lng);

    expect(res).toBeDefined();
    if (res.success && res.air && res.air.current) {
      expect(res.air.current.us_aqi).toBeDefined();
      expect(res.air.current.pm2_5).toBeDefined();
      expect(res.weather.current.temperature_2m).toBeDefined();
    }
  });
});
