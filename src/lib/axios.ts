import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "https://api.truthbox.app";

const API_BASE_URL = "http://localhost:3000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.authorization = `USER ${token}`;
  return config;
});

// Response interceptor expired token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //ignore  login and refresh-token endpoints
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    const isTokenExpired =
      error.response?.status === 401 ||
      error.response?.data?.error === "jwt expired";

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // order new Access Token  from our  Refresh Token
        const response = await axios.post(
          "/auth/refresh-token",
          {},
          {
            headers: { Authorization: `USER ${refreshToken}` },
          }
        );

        const newAccessToken = response.data.data.credentials.accessToken;
        localStorage.setItem("authToken", newAccessToken);

        // repeat the original request with new Access Token
        originalRequest.headers.authorization = `USER ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh token is invalid or expired - logout the user
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
