import axios from "axios";
import { baseURL } from "../utils/baseUrl";
/**
 * Axios defaults
 */
const { VITE_BACKEND_URL } = import.meta.env;
axios.defaults.baseURL = baseURL;

// Headers
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common.Accept = "application/json";

/**
 * Request Interceptor
 */
axios.interceptors.request.use(
  async (inputConfig) => {
    const config = inputConfig;

    // Check for and add the stored Auth Token to the header request
    let token = "";
    try {
      token = localStorage.getItem("@Auth:token");
    } catch (error) {
      /* Nothing */
    }
    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    throw error;
  }
);

export default axios;
