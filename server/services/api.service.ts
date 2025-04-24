import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { logger } from "../utils/logger";

export class ApiService {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.baseURL = baseURL;
    const apiKey = config?.headers?.Authorization as string | undefined;

    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      ...config,
    });

    if (apiKey) {
      this.instance.defaults.headers.common["Authorization"] = apiKey;
    }

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const outboundAuth = (config.headers as any)["authorization"];
        logger.info(
          `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
          { params: config.params }
        );
        return config;
      },
      (error) => {
        logger.error(`Request error: ${error.message}`, error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        logger.info(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: AxiosError) {
    if (error.response) {
      const { status, data, config } = error.response;
      logger.error(`API Error ${status}: ${config.url}`, { status, data, url: config.url });
      return {
        status,
        data,
        message: `API Error (${status}): ${error.message}`,
        code: `API_ERROR_${status}`
      };
    }
    if (error.request) {
      logger.error(`Network Error: ${error.message}`, error);
      return { status: 500, message: "No response received from server", code: "NETWORK_ERROR" };
    }
    logger.error(`Request Setup Error: ${error.message}`, error);
    return { status: 500, message: `Request error: ${error.message}`, code: "REQUEST_ERROR" };
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }
}

export default ApiService
