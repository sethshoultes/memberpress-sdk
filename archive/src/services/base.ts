import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SDKConfig } from '../types';
import { RateLimiter } from '../utils/rate-limiter';
import { Cache } from '../utils/cache';

export class BaseService {
  protected client: AxiosInstance;
  protected rateLimiter: RateLimiter;
  protected cache: Cache;

  constructor(config: SDKConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    this.rateLimiter = new RateLimiter(config.rateLimitRequests || 100);
    this.cache = new Cache(config.cacheTimeout || 300000); // 5 minutes default

    this.setupInterceptors(config.debug || false);
  }

  private setupInterceptors(debug: boolean): void {
    this.client.interceptors.request.use(
      async (config) => {
        await this.rateLimiter.acquire();
        if (debug) {
          console.log('Request:', config);
        }
        return config;
      },
      (error) => {
        if (debug) {
          console.error('Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        if (debug) {
          console.log('Response:', response);
        }
        return response;
      },
      (error) => {
        if (debug) {
          console.error('Response Error:', error);
        }
        return Promise.reject(error);
      }
    );
  }

  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    const cacheKey = `${config.method}-${config.url}-${JSON.stringify(config.params || {})}`;
    const cachedResponse = this.cache.get<T>(cacheKey);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const response = await this.client.request<T>(config);
      this.cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      switch (status) {
        case 401:
          throw new Error('Unauthorized: Invalid API key');
        case 403:
          throw new Error('Forbidden: Insufficient permissions');
        case 404:
          throw new Error('Not Found: Resource does not exist');
        case 429:
          throw new Error('Too Many Requests: Rate limit exceeded');
        default:
          throw new Error(
            `API Error: ${data?.message || error.message || 'Unknown error occurred'}`
          );
      }
    }

    throw error;
  }
}