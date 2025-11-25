import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.data?.message) {
      const wrapped = new Error(error.response.data.message);
      wrapped.status = error.response.status;
      throw wrapped;
    }
    if (error?.response) {
      const wrapped = new Error(`Request failed with status ${error.response.status}`);
      wrapped.status = error.response.status;
      throw wrapped;
    }
    return Promise.reject(error);
  }
);

