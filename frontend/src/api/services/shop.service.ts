import { apiClient } from '../client';

export const shopService = {
  // Categories
  getCategories: async () => {
    return apiClient.get('/shop/categories');
  },
  createCategory: async (data: any) => {
    return apiClient.post('/shop/categories', data);
  },

  // Products
  getProducts: async (params?: { page?: number; size?: number; category_id?: number; search?: string }) => {
    return apiClient.get('/shop/products', params);
  },
  getProductById: async (id: number) => {
    return apiClient.get(`/shop/products/${id}`);
  },

  // Orders (User)
  createOrder: async (data: any) => {
    return apiClient.post('/shop/orders', data);
  },
  createStripeSession: async (orderId: number) => {
    return apiClient.post(`/shop/orders/${orderId}/stripe-session`);
  },
  getMyOrders: async (params?: { page?: number; size?: number }) => {
    return apiClient.get('/shop/orders/me', params);
  },
  cancelOrder: async (id: number) => {
    return apiClient.patch(`/shop/orders/me/${id}/cancel`);
  },

  // Admin API
  adminCreateProduct: async (data: any) => {
    return apiClient.post('/admin/products', data);
  },
  adminUpdateProduct: async (id: number, data: any) => {
    return apiClient.put(`/admin/products/${id}`, data);
  },
  adminGetOrders: async (params?: { page?: number; size?: number; status?: string }) => {
    return apiClient.get('/admin/orders', params);
  },
  adminUpdateOrderStatus: async (id: number, status: string) => {
    return apiClient.patch(`/admin/orders/${id}/status?status=${status}`);
  }
};
