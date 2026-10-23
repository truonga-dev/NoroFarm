import { apiClient } from '../client';

export const authService = {
  login: async (data: any) => {
    // Backend accepts JSON body with email + password
    return apiClient.post('/auth/login', {
      email: data.email,
      password: data.password,
    });
  },
  
  register: async (data: any) => {
    return apiClient.post('/auth/register', data);
  },

  getMe: async () => {
    return apiClient.get('/users/me');
  },

  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  forgotPassword: async (email: string) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (data: { token: string; new_password: string }) => {
    return apiClient.post('/auth/reset-password', data);
  },

  verifyEmail: async (token: string) => {
    return apiClient.post('/auth/verify-email', { token });
  }
};
