/* eslint-disable no-useless-catch */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ErrorResponse } from '../types';
import { tokenManager } from '../utils/tokenManager';

// Base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Creates and configures an Axios instance for API calls
 */
export class ApiClient {
  private api: AxiosInstance;
  
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor for adding auth token
    this.api.interceptors.request.use(
      (config) => {
        // Get token from tokenManager
        const token = tokenManager.getToken();
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Transform error into a standardized format
        const errorResponse: ErrorResponse = {
          error: error.response?.data?.message || 'An unknown error occurred',
          code: error.response?.status || 500,
          details: error.response?.data?.details,
        };
        
        return Promise.reject(errorResponse);
      }
    );
  }

  /**
   * Set the authentication token for all subsequent requests
   */
  setAuthToken(token: string, expiryInSeconds?: number): void {
    tokenManager.setToken(token, expiryInSeconds);
  }

  /**
   * Clear the authentication token
   */
  clearAuthToken(): void {
    tokenManager.clearToken();
  }

  /**
   * Make a GET request to the API
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.api.get(url, config);
      return this.formatResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make a POST request to the API
   */
  async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.api.post(url, data, config);
      return this.formatResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make a PUT request to the API
   */
  async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.api.put(url, data, config);
      return this.formatResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make a PATCH request to the API
   */
  async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.api.patch(url, data, config);
      return this.formatResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make a DELETE request to the API
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.api.delete(url, config);
      return this.formatResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Format the API response
   */
  private formatResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data?.data || response.data,
      status: response.status,
      message: response.data?.message || 'Success',
      success: response.status >= 200 && response.status < 300,
    };
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

export default apiClient;