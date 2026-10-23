import { apiClient } from '../client';

type MarketPostInput = {
  title: string;
  description: string;
  post_type: 'BUY' | 'SELL';
  commodity_id: number;
  price: number;
  quantity: number;
  unit: string;
  location: string;
  contact_phone: string;
};

export const marketService = {
  getPosts: async (params?: { page?: number; size?: number; post_type?: string; commodity_id?: number; search?: string }) => {
    return apiClient.get('/market', params);
  },

  getMyPosts: async (params?: { page?: number; size?: number; post_type?: string; status?: string }) => {
    return apiClient.get('/market/me', params);
  },

  adminGetPosts: async (params?: { page?: number; size?: number; status?: string; search?: string }) => {
    return apiClient.get('/admin/market-posts', params);
  },

  getPostById: async (id: number) => {
    return apiClient.get(`/market/${id}`);
  },

  createPost: async (data: MarketPostInput) => {
    return apiClient.post('/market', data);
  },

  updatePost: async (id: number, data: any) => {
    return apiClient.put(`/market/${id}`, data);
  },

  deletePost: async (id: number) => {
    return apiClient.delete(`/market/${id}`);
  },

  moderatePost: async (id: number, status: string) => {
    return apiClient.patch(`/market/${id}/status?status=${status}`);
  },

  getMarketTrends: async (params?: any) => {
    return apiClient.get('/market', params);
  }
};
