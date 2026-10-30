import { apiClient } from '../client';

export const commoditiesService = {
  getCommodities: async (params?: any) => {
    return apiClient.get('/commodities', params);
  },

  getOverview: async () => {
    return apiClient.get('/commodities/overview');
  },
  
  getCommodity: async (id: number) => {
    return apiClient.get(`/commodities/${id}`);
  },
  
  createCommodity: async (data: any) => {
    return apiClient.post('/commodities', data);
  },
  
  updateCommodity: async (id: number, data: any) => {
    return apiClient.put(`/commodities/${id}`, data);
  },
  
  deleteCommodity: async (id: number) => {
    return apiClient.delete(`/commodities/${id}`);
  },

  getCommodityPrices: async (id: number, params?: any) => {
    return apiClient.get(`/commodities/${id}/prices`, params);
  },

  addCommodityPrice: async (id: number, data: any) => {
    return apiClient.post(`/commodities/${id}/prices`, data);
  },

  bulkAddPrices: async (data: { prices: Array<{ commodity_id: number, price: number, currency?: string }> }) => {
    return apiClient.post('/commodities/bulk-prices', data);
  },

  getPriceHistory: async (id: number, days: number = 30) => {
    return apiClient.get(`/commodities/${id}/price-history`, { days });
  },

  getTopMovers: async (limit: number = 10) => {
    return apiClient.get('/commodities/top-movers', { limit });
  },

  getRealtimePrices: async (limit: number = 50, sync: boolean = false) => {
    return apiClient.get('/commodities/realtime', { limit, sync });
  },

  crawlLive: async () => {
    return apiClient.post('/commodities/crawl-live');
  }
};
