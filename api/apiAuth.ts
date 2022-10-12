import axios, { AxiosInstance } from "axios";
import https from "https";
import { api, URLS } from ".";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { fingerprint } from "../helpers";
import { login, logout, store, storeActions } from "../redux";
import CookieService from "../services/CookieService";

export const apiAuth: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/`,
  timeout: 1000 * 20,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = () => CookieService.get("token") || "";

// request hendler
apiAuth.interceptors.request.use(
  (request) => {
    request.headers = {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    };
    request.httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshAuthLogic = async (error: any) => {
  const { data, config } = error.response;

  const refreshToken = localStorage.getItem("refresh_token") || "";

  try {
    const { data } = await api.post(URLS.refreshTokens, {
      refresh_token: refreshToken,
      fingerprint: fingerprint(),
    });
    store.dispatch(login(data.user, data.accessToken) as any);
    return Promise.resolve();
  } catch (error) {
    if (config.url.split("/").includes("pre_buy")) {
      store.dispatch(storeActions.setError(data.message || data.error));
    }
    store.dispatch(logout("refresh auth") as any);
    return Promise.reject(error);
  }
};

createAuthRefreshInterceptor(apiAuth, refreshAuthLogic, {
  statusCodes: [401],
});
