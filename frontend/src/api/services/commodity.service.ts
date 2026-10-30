import { apiClient } from '../client';

export const commodityService = {
  getCommodities: async (params?: any) => {
    return apiClient.get('/commodities', params);
  },
  
  getCommodity: async (id: string) => {
    return apiClient.get(`/commodities/${id}`);
  },

  getCategories: async () => {
    return apiClient.get('/commodity-categories');
  },

  getPrices: async (id: string, params?: any) => {
    return apiClient.get(`/commodities/${id}/prices`, params);
  },

  bulkAddPrices: async (data: { prices: Array<{ commodity_id: number, price: number, currency?: string, location?: string }> }) => {
    return apiClient.post('/commodities/bulk-prices', data);
  },

  getWorldDomesticBoard: async () => {
    return apiClient.get('/commodities/world-domestic-board');
  }
};
