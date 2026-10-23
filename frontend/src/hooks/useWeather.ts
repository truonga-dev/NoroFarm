import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../api/services/weather.service';

export const useWeather = () => {
  const useLocations = () => {
    return useQuery({
      queryKey: ['weather-locations'],
      queryFn: () => weatherService.getLocations(),
    });
  };

  const useForecast = (locationCode: string) => {
    return useQuery({
      queryKey: ['weather-forecast', locationCode],
      queryFn: () => weatherService.getForecast(locationCode),
      enabled: Boolean(locationCode),
    });
  };

  const useAlerts = (locationCode: string) => {
    return useQuery({
      queryKey: ['weather-alerts', locationCode],
      queryFn: () => weatherService.getAlerts(locationCode),
      enabled: Boolean(locationCode),
    });
  };

  return {
    useLocations,
    useForecast,
    useAlerts,
  };
};
