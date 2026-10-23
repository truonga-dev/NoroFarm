import { apiClient } from '../client';

export const contactService = {
  createContact: async (data: { name: string; email: string; phone?: string; subject: string; message: string }) => {
    return apiClient.post('/contacts', data);
  },

  adminGetContacts: async (params?: { page?: number; size?: number; is_replied?: boolean }) => {
    return apiClient.get('/contacts/admin', params);
  },

  adminReplyContact: async (id: number, reply_content: string) => {
    return apiClient.post(`/contacts/admin/${id}/reply`, { reply_content });
  }
};
