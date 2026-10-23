import { apiClient } from '../client';

export const newsService = {
  getArticles: async (params?: any) => {
    return apiClient.get('/news', params);
  },
  
  getArticle: async (slug: string) => {
    return apiClient.get(`/news/${slug}`);
  },

  createArticle: async (data: any) => {
    return apiClient.post('/news', data);
  },

  updateArticle: async (id: number, data: any) => {
    return apiClient.put(`/news/${id}`, data);
  },

  deleteArticle: async (id: number) => {
    return apiClient.delete(`/news/${id}`);
  },

  getCategories: async () => {
    return apiClient.get('/news/categories');
  },

  createCategory: async (data: any) => {
    return apiClient.post('/news/categories', data);
  },
  
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/media/upload', formData);
  },

  getTags: async () => {
    return apiClient.get('/news/categories');
  }
};
