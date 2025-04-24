import axios, { AxiosError } from "axios";

const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || "");
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error || "");
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || "");
  }
};

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    logger.info(`Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params
    });
    return config;
  },
  (error) => {
    logger.error(`Request error: ${error.message}`);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    logger.info(`Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const responseData = error.response.data as { error?: { message?: string } };
      logger.error(`Response error: ${error.response.status} ${error.config?.url}`, {
        status: error.response.status,
        data: error.response.data
      });

      return Promise.reject({
        message: responseData?.error?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    }

    if (error.request) {
      logger.error("Network error - no response received", error);
      return Promise.reject({
        message: "Network error - no response received",
        status: 0
      });
    }

    logger.error(`Request setup error: ${error.message}`);
    return Promise.reject({
      message: error.message,
      status: 0
    });
  }
);

export default api;
