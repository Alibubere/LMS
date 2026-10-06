import apiClient from './client';

export const userApi = {
  getUserById: async (id) => {
    const response = await apiClient.get(`/api/v1/users/${id}`);
    return response.data;
  },

  updateUser: async (id, data) => {
    // data: { name, bio, avatarUrl }
    const response = await apiClient.put(`/api/v1/users/${id}`, data);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await apiClient.get('/api/v1/users');
    return response.data;
  },
};

export default userApi;
