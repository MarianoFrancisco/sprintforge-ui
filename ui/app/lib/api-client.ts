import axios, { AxiosError, type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir token JWT (cuando se implemente)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('accessToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const message = error.message || 'Error en la solicitud';
    throw new ApiError(message, status, error.response?.data);
  }
);

export const apiClient = {
  async get<T>(endpoint: string, params?: unknown): Promise<T> {
    const response = await api.get<T>(endpoint, { params });
    return response.data;
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await api.put<T>(endpoint, data);
    return response.data;
  },

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await api.patch<T>(endpoint, data);
    return response.data;
  },

  async delete(endpoint: string): Promise<void> {
    await api.delete(endpoint);
  },
};
