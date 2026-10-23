import { apiClient } from '../client';

export type MarketPost = {
  id: number;
  post_type: 'BUY' | 'SELL';
  title: string;
  description?: string | null;
  price: number;
  quantity: number;
  unit: string;
  location?: string | null;
  contact_phone?: string | null;
  created_at: string;
  commodity?: { name: string } | null;
  user?: { profile?: { full_name?: string | null } | null } | null;
};

export type MarketPostList = {
  items: MarketPost[];
  total: number;
  page: number;
  pages: number;
};

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
    return apiClient.get<{ data: MarketPostList }>('/market', params);
  },

  getMyPosts: async (params?: { page?: number; size?: number; post_type?: string; status?: string }) => {
    return apiClient.get('/market/me', params);
  },

  adminGetPosts: async (params?: { page?: number; size?: number; status?: string; search?: string }) => {
    return apiClient.get('/admin/market-posts', params);
  },

  getPostById: async (id: number) => {
    return apiClient.get<{ data: MarketPost }>(`/market/${id}`);
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
