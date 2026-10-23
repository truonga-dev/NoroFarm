import { useQuery } from '@tanstack/react-query';
import { commodityService } from '../api/services/commodity.service';

export const useCommodity = () => {
  const useCommodities = (params?: any) => {
    return useQuery({
      queryKey: ['commodities', params],
      queryFn: () => commodityService.getCommodities(params),
    });
  };

  const useCategories = () => {
    return useQuery({
      queryKey: ['commodity-categories'],
      queryFn: () => commodityService.getCategories(),
    });
  };

  const useCommodityDetail = (id: string) => {
    return useQuery({
      queryKey: ['commodity', id],
      queryFn: () => commodityService.getCommodity(id),
      enabled: !!id,
    });
  };

  const useCommodityPrices = (id: string, params?: any) => {
    return useQuery({
      queryKey: ['commodity-prices', id, params],
      queryFn: () => commodityService.getPrices(id, params),
      enabled: !!id,
    });
  };

  return {
    useCommodities,
    useCategories,
    useCommodityDetail,
    useCommodityPrices,
  };
};
