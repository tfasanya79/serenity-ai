import axios, { AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Base configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to retrieve auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear stored token
      try {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('refresh_token');
      } catch (clearError) {
        console.warn('Failed to clear auth tokens:', clearError);
      }
    }
    return Promise.reject(error);
  }
);

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API response handler
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// Generic API error handler
export const handleApiError = (error: AxiosError): never => {
  if (error.response) {
    // Server responded with error
    const errorData = error.response.data as any;
    const message = errorData?.error?.message || 
                   errorData?.message || 
                   'An error occurred';
    throw new ApiError(message, error.response.status, error.response.data);
  } else if (error.request) {
    // Network error
    throw new ApiError('Network error. Please check your connection.');
  } else {
    // Other error
    throw new ApiError(error.message || 'An unexpected error occurred');
  }
};

// API client wrapper functions
export const apiGet = async <T>(url: string): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

export const apiPost = async <T>(url: string, data?: any): Promise<T> => {
  try {
    const response = await apiClient.post<T>(url, data);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

export const apiPut = async <T>(url: string, data?: any): Promise<T> => {
  try {
    const response = await apiClient.put<T>(url, data);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  try {
    const response = await apiClient.delete<T>(url);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

export default apiClient;
