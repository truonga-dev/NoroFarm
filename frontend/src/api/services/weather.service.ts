import { apiClient } from '../client';

export const weatherService = {
  getForecast: async (locationCode: string) => {
    const response = await apiClient.get(`/weather/forecasts/${locationCode}`);
    return response.data;
  },
  
  getLocations: async () => {
    const response = await apiClient.get('/weather/locations');
    return response.data;
  },

  getAlerts: async (locationCode: string) => {
    const response = await apiClient.get(`/weather/alerts/${locationCode}`);
    return response.data;
  },

  getCurrentWeather: async (city?: string, lat?: number, lon?: number) => {
    const params: any = {};
    if (city) params.city = city;
    if (lat !== undefined && lon !== undefined) {
      params.lat = lat;
      params.lon = lon;
    }
    const response = await apiClient.get('/weather/current', params);
    return response.data;
  }
};
