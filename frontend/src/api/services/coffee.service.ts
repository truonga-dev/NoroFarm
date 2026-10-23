import { commodityService } from './commodity.service';

// Coffee is a specific commodity, we can alias it or add specific logic
export const coffeeService = {
  getCoffeeData: async (params?: any) => {
    // Assuming category_id for coffee is known, or fetched from categories
    return commodityService.getCommodities({ ...params, category: 'coffee' });
  },
  
  getCoffeePrices: async (id: string, params?: any) => {
    return commodityService.getPrices(id, params);
  }
};
