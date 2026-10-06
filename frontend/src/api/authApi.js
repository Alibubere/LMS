import apiClient from './client';

export const authApi = {
  register: async (credentials) => {
    // credentials: { name, email, password, role }
    const response = await apiClient.post('/api/v1/auth/register', credentials);
    return response.data;
  },

  login: async (credentials) => {
    // credentials: { email, password }
    const response = await apiClient.post('/api/v1/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/api/v1/auth/logout');
    return response.data;
  },
};

export default authApi;
