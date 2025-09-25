import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? 'http://localhost:8000': "/",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});