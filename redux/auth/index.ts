import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api, URLS } from "../../api";
import { AppDispatch } from "../store";
import { fingerprint } from "../../helpers/fingerprint";
import { profileActions, RootState } from "..";
import CookieService from "../../services/CookieService";
import { errors, infoMessages } from "../../constants";
import { VERIFY_200 } from "../../components/modals/ItemBoughtErrorModal/data";
import { User } from "../../types";
import { changeUserData } from "../profile";

type TypeAuth = {
  isLogin: boolean;
  isUniqueUserName: boolean | null;
  error: string;

  stepRegistration: number;
  infoMessage: string[];
  loginImg: string;
};

const initAuth: TypeAuth = {
  isLogin: false,

  isUniqueUserName: null,
  error: "",
  loginImg: "",
  stepRegistration: 1,
  infoMessage: [],
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState: initAuth,
  reducers: {
    changeAuthStatus: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLogin: action.payload,
    }),

    removeUser: (state) => ({
      ...state,
    }),
    setUniqueUserName: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isUniqueUserName: action.payload,
    }),
    setError: (state, action: PayloadAction<string>) => ({
      ...state,
      error: action.payload,
    }),
    setInfoMessage: (state, action) => ({
      ...state,
      infoMessage: state.infoMessage.some((el) => el === action.payload)
        ? [...state.infoMessage]
        : [...state.infoMessage, action.payload],
    }),
    removeInfoMessage: (state, action) => ({
      ...state,
      infoMessage:
        action.payload === "full"
          ? []
          : state.infoMessage.some((el) => el === action.payload)
          ? state.infoMessage.filter((info) => info !== action.payload)
          : [...state.infoMessage],
    }),
    setStepRegistration: (state, action) => ({
      ...state,
      stepRegistration: action.payload,
    }),
    setLoginImg: (state, action) => ({
      ...state,
      loginImg: action.payload,
    }),
    resetAuth: () => initAuth,
  },
});

export const authActions = AuthSlice.actions;
export const {
  changeAuthStatus,
  resetAuth,
  removeUser,
  setUniqueUserName,
  setError,
  setInfoMessage,
  setLoginImg,
  removeInfoMessage,
} = AuthSlice.actions;

export default AuthSlice.reducer;

export const login =
  (user: User, token: any, loginIsTotpActive?: boolean) =>
  (dispatch: AppDispatch) => {
    localStorage.removeItem("userIdToken");
    localStorage.setItem("refresh_token", token.refresh_token);
    CookieService.set("token", token.access_token, { path: "/" });

    if (loginIsTotpActive) {
      dispatch(
        changeUserData({
          user: { ...user, isAuth: false },
          localOff: true,
        })
      );
      return;
    }

    dispatch(changeUserData({ user: { ...user, isAuth: true } }));
  };

export const logout =
  (info: string, onlyLogin?: boolean) => async (dispatch: AppDispatch) => {
    try {
      if (!onlyLogin) {
        await api.post(URLS.logout, {
          refresh_token: localStorage.getItem("refresh_token"),
          fingerprint: fingerprint(),
        });
      }

      const { resetProfile } = profileActions;

      localStorage.removeItem("user");
      localStorage.removeItem("refresh_token");
      CookieService.remove("token");

      dispatch(resetProfile());

      if (!onlyLogin) {
        dispatch(setError("logout success"));
      }

      console.log(`logout after ${info}`);
    } catch (error) {}
  };

export const authAsync = (dataForm: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setInfoMessage(infoMessages.LOADING_AUTH_DATA));

    const res = await api.post(URLS.auth, { ...dataForm });
    if (res?.data?.error) {
      return dispatch(setError(res?.data.error));
    }

    const { setError: setProfileError } = profileActions;

    dispatch(
      login(
        res?.data.user,
        res?.data?.accessToken,
        res?.data.user.is_totp_active
      )
    );

    if (!res?.data.user.is_totp_active) {
      dispatch(setProfileError(errors.NO_TWO_FA));
    }
  } catch (error) {
    if (
      error?.response?.data?.error === errors.EMAIL_NOT_VERIFIED ||
      error?.response?.data?.error === errors.EMAIL_HAS_BEEN_SENT
    ) {
      localStorage.setItem("userIdToken", dataForm.idToken);
      localStorage.setItem("emailForSignIn", dataForm.email);
      dispatch(setError(error?.response?.data?.error));
    }
  } finally {
    dispatch(removeInfoMessage(infoMessages.LOADING_AUTH_DATA));
  }
};

export const verifyEmailAsunc =
  ({ uid, fingerprint }: { uid: string; fingerprint: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      await api.post(URLS.verifyEmail, { uid, fingerprint });

      dispatch(setError(VERIFY_200));
    } catch (error) {
      if (error?.response?.data?.error === errors.EMAIL_NOT_VERIFIED) {
        dispatch(setError(error?.response?.data?.error));
      }
    }
  };

export const isUserNameIsUnique =
  (username: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_UNIQ_NAME));
      const { data } = await api.get(
        `${URLS.isUserNameUnique}?username=${username}`
      );

      dispatch(setUniqueUserName(data.is_unique));
    } catch (error) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_UNIQ_NAME));
    }
  };
export const getLoginImgAsync = () => async (dispatch: AppDispatch) => {
  try {
    const { data } = await api.get(`${URLS.loginBanner}`);
    dispatch(setLoginImg(data.banner));
  } catch (error) {}
};

export const selectIsLogin = (state: RootState) => state.auth.isLogin;
export const selectIsUnique = (state: RootState) => state.auth.isUniqueUserName;
export const selectAuthInfoMessage = (state: RootState) =>
  state.auth.infoMessage;
export const selectAuthError = (state: RootState) => state.auth.error;

export const selectStepRegistration = (state: RootState) =>
  state.auth.stepRegistration;
export const selectLoginImg = (state: RootState) => state.auth.loginImg;
