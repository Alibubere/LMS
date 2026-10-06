import apiClient from './client';

export const categoryApi = {
  getAllCategories: async () => {
    const response = await apiClient.get('/api/v1/categories');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await apiClient.get(`/api/v1/categories/${id}`);
    return response.data;
  },

  createCategory: async (data) => {
    const response = await apiClient.post('/api/v1/categories', data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await apiClient.put(`/api/v1/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/api/v1/categories/${id}`);
    return response.data;
  },
};

export default categoryApi;
