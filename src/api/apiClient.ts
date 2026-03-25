import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
});


apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers["ngrok-skip-browser-warning"] = "true";   //  ADD THIS

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//  Auto Logout on 401
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      if (!window.location.pathname.includes("/signin")) {
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
