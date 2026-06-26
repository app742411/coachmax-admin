import axios from "axios";

// Create custom Axios instance
const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || "https://api.example.com/v1",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Interceptor for adding Auth token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for global error handling (e.g. token expiration)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (e.g., redirect to login or clear storage)
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
