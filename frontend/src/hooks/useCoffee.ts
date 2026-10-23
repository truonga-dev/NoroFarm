import { useQuery } from '@tanstack/react-query';
import { coffeeService } from '../api/services/coffee.service';

export const useCoffee = () => {
  const useCoffeeData = (params?: any) => {
    return useQuery({
      queryKey: ['coffee', params],
      queryFn: () => coffeeService.getCoffeeData(params),
    });
  };

  const useCoffeePrices = (id: string, params?: any) => {
    return useQuery({
      queryKey: ['coffee-prices', id, params],
      queryFn: () => coffeeService.getCoffeePrices(id, params),
      enabled: !!id,
    });
  };

  return {
    useCoffeeData,
    useCoffeePrices,
  };
};
