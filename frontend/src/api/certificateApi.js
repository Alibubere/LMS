import apiClient from './client';

export const certificateApi = {
  getCertificate: async (courseId) => {
    const response = await apiClient.get(`/api/v1/courses/${courseId}/certificate`);
    return response.data;
  },

  generateCertificate: async (courseId) => {
    const response = await apiClient.post(`/api/v1/courses/${courseId}/certificate`);
    return response.data;
  },
};

export default certificateApi;
