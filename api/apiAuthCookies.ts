import axios, { AxiosInstance } from "axios";
import { api, URLS } from ".";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { fingerprint } from "../helpers";
import { login, logout, store, storeActions } from "../redux";
import https from "https";

export const apiAuthCookies: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/`,
  timeout: 1000 * 20,
  headers: {
    "Content-Type": "application/json",
  },
});

// request hendler
apiAuthCookies.interceptors.request.use(
  (request) => {
    request.headers = { "Content-Type": "application/json" };
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
    store.dispatch(login(data.user, data.accessToken));
    return Promise.resolve();
  } catch (error) {
    if (config.url.split("/").includes("pre_buy")) {
      store.dispatch(storeActions.setError(data.message || data.error));
    }
    store.dispatch(logout("refresh auth cookies"));
    return Promise.reject(error);
  }
};

createAuthRefreshInterceptor(apiAuthCookies, refreshAuthLogic, {
  statusCodes: [401],
});
