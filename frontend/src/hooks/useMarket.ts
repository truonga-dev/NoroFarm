import { useQuery } from '@tanstack/react-query';
import { marketService } from '../api/services/market.service';

export const useMarket = () => {
  const useMarketTrends = (params?: any) => {
    return useQuery({
      queryKey: ['market-trends', params],
      queryFn: () => marketService.getMarketTrends(params),
    });
  };

  return {
    useMarketTrends,
  };
};
