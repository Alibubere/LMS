import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: add JWT Bearer token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response data or format backend errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'UNKNOWN_ERROR';
    let errorDetails = null;

    if (error.response) {
      const responseData = error.response.data;
      if (responseData && responseData.error) {
        errorCode = responseData.error.code || errorCode;
        errorMessage = responseData.error.message || errorMessage;
        errorDetails = responseData.error.details || null;
      } else if (responseData && responseData.message) {
        errorMessage = responseData.message;
      } else if (error.response.status === 401) {
        errorMessage = 'Authentication required or session expired. Please log in again.';
        errorCode = 'UNAUTHORIZED';
      } else if (error.response.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
        errorCode = 'FORBIDDEN';
      } else if (error.response.status === 404) {
        errorMessage = 'The requested resource was not found.';
        errorCode = 'RESOURCE_NOT_FOUND';
      }
    } else if (error.request) {
      errorMessage = 'Unable to connect to the LMS server. Please check your network or server status.';
      errorCode = 'NETWORK_ERROR';
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.code = errorCode;
    enhancedError.details = errorDetails;
    enhancedError.status = error.response ? error.response.status : null;
    enhancedError.originalError = error;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;
