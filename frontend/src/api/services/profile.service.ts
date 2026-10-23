import { apiClient } from '../client';

export const profileService = {
  getProfile: async () => {
    return apiClient.get('/users/me');
  },

  updateProfile: async (data: {
    full_name?: string;
    phone_number?: string;
    avatar_url?: string;
  }) => {
    return apiClient.patch('/users/me', data);
  },

  changePassword: async (data: any) => {
    return apiClient.patch('/users/me/password', data);
  },

  getWatchlist: async () => {
    return apiClient.get('/users/me/watchlist');
  },

  addToWatchlist: async (commodityId: number) => {
    return apiClient.post(`/users/me/watchlist/${commodityId}`);
  },

  removeFromWatchlist: async (commodityId: number) => {
    return apiClient.delete(`/users/me/watchlist/${commodityId}`);
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/media/upload', formData);
  }
};
