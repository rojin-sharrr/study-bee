import axios from "axios";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

const axiosInstance = axios.create({
  baseURL: `${BASE_API}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
