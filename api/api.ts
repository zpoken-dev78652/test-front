import axios, { AxiosInstance } from "axios";
import https from "https";

export const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/`,
  timeout: 1000 * 20,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

api.interceptors.request.use((request) => {
  request.headers = { "Content-Type": "application/json" };
  request.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });
  return request;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
