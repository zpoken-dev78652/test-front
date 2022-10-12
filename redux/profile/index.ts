import { createSlice } from "@reduxjs/toolkit";
import { globalActions, RootState } from "..";
import { apiAuth, URLS } from "../../api";
import { ItemDetail, User } from "../../types";
import { AppDispatch } from "../store";
import {
  errors,
  infoMessages,
  setingsNotification,
  walletTabs,
} from "../../constants";
import { EMAIL_NOT_VERIFIED } from "../../components/modals/ItemBoughtErrorModal/data";
import { fingerprint, replaceOldArr } from "../../helpers";
import CookieService from "../../services/CookieService";
import { login, logout } from "../auth";
import { toast } from "react-toastify";
import { IconCheckSquare } from "../../public/icons";
import {
  profileInitType,
  ProfileModalsKeyType,
  InitialProfileModalType,
  SelectWolletType,
  TabsWalletModalType,
} from "./profile.types";

const USER_DATA = (data: User): User => {
  if (!process.browser) {
    return data;
  }

  const userJson = localStorage.getItem("user");

  if (userJson) {
    const userData = JSON.parse(userJson);
    return { ...userData, isAuth: true };
  }

  return data;
};

const initialeModals = {
  wallet: false,
  deposit: false,
  withdraw: false,
  history: false,
};

const initialProfileModal: InitialProfileModalType = {
  selectWallet: "",
  seletTabModal: walletTabs[0],
  ...initialeModals,
};

const userInit = {
  birthday: null,
  email: "",
  fullName: "",
  id: "",
  phone: "",
  username: "",
  followers: 0,
  following: 0,
  selling: 0,
  registered_at: "",
  status: null,
  logo: null,
  isAuth: false,
  circle_status: "",
  is_email_verified: false,
  is_totp_active: false,
  is_onfido_passed: false,
  is_phone_verified: false,
  onfido_status: null,
  phone_last_digits: "",
};

const init: profileInitType = {
  user: USER_DATA(userInit),
  userProfile: {
    birthday: null,
    email: "",
    fullName: "",
    id: "",
    phone: "",
    username: "",
    followers: 0,
    following: 0,
    selling: 0,
    registered_at: "",
    status: null,
    logo: null,
    circle_status: "",
    is_email_verified: false,
    is_totp_active: false,
    is_onfido_passed: false,
    is_phone_verified: false,
    onfido_status: null,
    phone_last_digits: "",
  },
  balance: {
    USDC: 0,
    XNL: 0,
    noWallet: false,
    isFeatched: false,
  },
  withdrawableBalance: {
    USDC: 0,
    XNL: 0,
    isFeatched: false,
  },
  summaryItem: {
    full_set: 0,
    items: 0,
    unique: 0,
  },
  cards: [],
  franchises: [],
  types: [],
  selectedNft: null,
  circleKey: {
    keyId: "",
    publicKey: "",
  },
  qr: {
    link: "",
    secret: "",
  },
  collections: {
    data: [],
    num_pages: 0,
    page_number: 0,
    page_size: 0,
    total_results: 0,
  },
  upholdRedirect: false,
  walletHistory: {
    data: [],
    num_pages: 0,
    page_number: 0,
    page_size: 0,
    total_results: 0,
  },
  loading: false,
  blockchainMethods: {
    USDC: "",
    XNL: "",
  },
  error: "",
  verifyPhone: "",
  onfidoSdkKey: "",
  infoMessage: [],
  walletError: "",
  unread: 0,
  notifications: {
    data: [],
    num_pages: 0,
    page_number: 0,
    page_size: 0,
    total_results: 0,
  },
  profileModals: initialProfileModal,
  withdrawFee: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: init,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.user,
        },
      };
    },
    setCollection: (state, action) => ({
      ...state,
      collections: {
        ...state.collections,
        num_pages: action.payload.num_pages,
        page_number: action.payload.page_number,
        page_size: action.payload.page_size,
        total_results: action.payload.total_results,
        data: [...action.payload?.data],
      },
    }),
    setMyNft: (state, action) => ({
      ...state,
      selectedNft: action.payload,
    }),
    setSelectWallet: (state, action: { payload: SelectWolletType }) => ({
      ...state,
      profileModals: {
        ...state.profileModals,
        selectWallet: action.payload,
      },
    }),
    setSelectTab: (state, action: { payload: TabsWalletModalType }) => ({
      ...state,
      profileModals: {
        ...state.profileModals,
        seletTabModal: action.payload,
      },
    }),
    setVerifyPhone: (state, action) => ({
      ...state,
      verifyPhone: action.payload,
    }),
    setWithdrawFee: (state, action) => ({
      ...state,
      withdrawFee: action.payload,
    }),
    setUserProfile: (state, action) => ({
      ...state,
      userProfile: {
        ...state.userProfile,
        ...action.payload.user,
      },
    }),
    setProfileModalByKey: (
      state,
      action: { payload: ProfileModalsKeyType }
    ) => ({
      ...state,
      profileModals: {
        ...state.profileModals,
        ...initialeModals,
        [action.payload]: true,
      },
    }),
    closeAllProfileModal: (state) => ({
      ...state,
      profileModals: {
        ...state.profileModals,
        ...initialeModals,
      },
    }),
    setWithdrawableBalance: (state, action) => ({
      ...state,
      withdrawableBalance: action.payload,
    }),
    setBalance: (state, action) => ({
      ...state,
      balance: action.payload,
    }),
    setTypes: (state, action) => ({
      ...state,
      types: action.payload,
    }),
    setCards: (state, action) => ({
      ...state,
      cards: action.payload,
    }),
    setLoading: (state, action) => ({
      ...state,
      loading: action.payload,
    }),
    setFranchises: (state, action) => ({
      ...state,
      franchises: action.payload,
    }),
    setWalletHistory: (state, action) => ({
      ...state,
      walletHistory: {
        ...state.walletHistory,
        num_pages: action.payload.num_pages,
        page_number: action.payload.page_number,
        page_size: action.payload.page_size,
        total_results: action.payload.total_results,
        data: [...action.payload?.data],
      },
    }),
    setSummaryItem: (state, action) => ({
      ...state,
      summaryItem: {
        ...state.summaryItem,
        ...action.payload,
      },
    }),
    setUserData: (state, action) => ({
      ...state,
      user: {
        ...state.user,
        ...(action.payload.name && { username: action.payload.name }),
        ...(action.payload.logo && { logo: action.payload.logo }),
      },
    }),
    resetWallet: (state) => ({
      ...state,
      walletHistory: {
        data: [],
        num_pages: 0,
        page_number: 0,
        page_size: 0,
        total_results: 0,
      },
    }),
    resetNotification: (state) => ({
      ...state,
      walletHistory: {
        data: [],
        num_pages: 0,
        page_number: 0,
        page_size: 0,
        total_results: 0,
      },
    }),
    resetNft: (state) => ({
      ...state,
      selectedNft: null,
    }),
    resetCollection: (state) => ({
      ...state,
      collections: {
        data: [],
        num_pages: 0,
        page_number: 0,
        page_size: 0,
        total_results: 0,
      },
    }),
    setRedirectUphold: (state, action) => ({
      ...state,
      upholdRedirect: action.payload,
    }),
    setBlockchainMethods: (state, action) => ({
      ...state,
      blockchainMethods: action.payload,
    }),
    setCircleKey: (state, action) => ({
      ...state,
      circleKey: action.payload,
    }),
    setError: (state, action) => ({
      ...state,
      error: action.payload,
    }),
    setWalletError: (state, action) => ({
      ...state,
      walletError: action.payload,
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
    setOnfidoSdkKey: (state, action) => ({
      ...state,
      onfidoSdkKey: action.payload,
    }),
    setUnread: (state, action) => ({
      ...state,
      unread: action.payload,
    }),
    setNotifications: (state, action) => ({
      ...state,
      notifications: {
        ...state.notifications,
        num_pages: action.payload.num_pages,
        page_number: action.payload.page_number,
        page_size: action.payload.page_size,
        total_results: action.payload.total_results,
        data: [...action.payload?.data],
      },
    }),
    setQr: (state, action) => ({
      ...state,
      qr: action.payload,
    }),
    resetProfile: () => ({ ...init, user: userInit }),
  },
});

export const profileActions = profileSlice.actions;

const {
  setUser,
  setBalance,
  setSummaryItem,
  setFranchises,
  setTypes,
  setUserProfile,
  setCards,
  setMyNft,
  setCollection,
  setRedirectUphold,
  setLoading,
  setBlockchainMethods,
  setCircleKey,
  setError,
  setOnfidoSdkKey,
  setWalletHistory,
  setInfoMessage,
  setWalletError,
  setUnread,
  setNotifications,
  setQr,
  removeInfoMessage,
  setWithdrawableBalance,
  setWithdrawFee,
  closeAllProfileModal,
} = profileActions;

export default profileSlice.reducer;

export const changeUserData =
  ({ user, localOff }: { user: Partial<User>; localOff?: boolean }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    const storeUser = getStore().profile.user;

    if (!localOff) {
      localStorage.setItem("user", JSON.stringify({ ...storeUser, ...user }));
    }

    dispatch(setUser({ user: { ...storeUser, ...user } }));
  };

export const getOwnerUserDataAsync =
  (user: User) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      dispatch(changeUserData({ user: { ...user, isAuth: true } }));
    } catch (error) {
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getWithdrawFeeAsync =
  ({ withdraw_amount }: { withdraw_amount: number }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_WITHDRAW_FEE));
      const { data } = await apiAuth.post(`${URLS.withdrawFee}`, {
        withdraw_amount,
      });

      dispatch(setWithdrawFee(data));
    } catch (error) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_WITHDRAW_FEE));
    }
  };

export const getUserProfileData =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const { data } = await apiAuth.get(`${URLS.userProfileData}/${id}`);
      dispatch(setUserProfile(data));
    } catch (error) {
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getBalanceAsync =
  () => async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_BALANCE));

      const { data } = await apiAuth.get(`${URLS.userWallet}`);
      dispatch(
        setBalance({
          ...getStore().profile.balance,
          ...data.balance,
          isFeatched: true,
        })
      );
    } catch (error) {
      dispatch(
        setBalance({
          ...getStore().profile.balance,
          noWallet: true,
          isFeatched: true,
        })
      );
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_BALANCE));
    }
  };

export const getWithdrawableBalanceAsync =
  () => async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_WITHDRAWABLE_BALANCE));

      const { data } = await apiAuth.get(`${URLS.withdrawableBalance}`);
      dispatch(setWithdrawableBalance(data));
      dispatch(
        setWithdrawableBalance({
          ...getStore().profile.withdrawableBalance,
          ...data.result,
          isFeatched: true,
        })
      );
    } catch (error) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_WITHDRAWABLE_BALANCE));
    }
  };

export const getUserCardsAsync = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setInfoMessage(infoMessages.LOADING_CARDS));
    const { data } = await apiAuth.get(URLS.userCards);
    dispatch(setCards(data.data));
  } catch (error) {
  } finally {
    dispatch(removeInfoMessage(infoMessages.LOADING_CARDS));
  }
};

export const setUserDataAsync =
  ({
    name,
    file,
    logo_link,
  }: {
    name?: string;
    file?: any;
    logo_link?: string;
  }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      const body =
        name || logo_link
          ? {
              ...(name && { username: name }),
              ...(logo_link && { logo_link }),
            }
          : file;
      const profileUser = getStore().profile.userProfile;
      const myUser = getStore().profile.user;

      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const { data } = await apiAuth.put(
        URLS.myProfileData,
        body,
        file && config
      );

      if (data) {
        dispatch(
          changeUserData({
            user: {
              ...(data?.username && { username: data?.username }),
              ...(data?.logo && { logo: data?.logo }),
            },
          })
        );
      }

      if (profileUser?.id === myUser?.id) {
        dispatch(
          setUserProfile({
            user: {
              ...(data?.username && { username: data?.username }),
              ...(data?.logo && { logo: data?.logo }),
            },
          })
        );
      }
    } catch (error) {}
  };

export const getOnfidoStatusAsync = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setInfoMessage(infoMessages.LOADING_ONFIDO_STATUS));

    const { data } = await apiAuth.get(URLS.onfidoStatus);
    dispatch(
      changeUserData({
        user: {
          onfido_status: data?.result?.onfido_status,
        },
      })
    );
  } catch (error) {
  } finally {
    dispatch(removeInfoMessage(infoMessages.LOADING_ONFIDO_STATUS));
  }
};

export const getSummaryItemAsync =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.get(
        URLS.summaryItem.replace("<id>", `${id}`)
      );
      dispatch(setSummaryItem(data));
    } catch (error) {}
  };

export const getFranchiseCollectionAsync =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.get(
        URLS.franchises.replace("<id>", `${id}`)
      );
      dispatch(setFranchises(data.stores));
    } catch (error) {}
  };

export const getTypesCollectionAsync =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.get(URLS.types.replace("<id>", `${id}`));
      dispatch(setTypes(data.types));
    } catch (error) {}
  };

export const getNftByIdAsync =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.get(URLS.nftById.replace("<id>", `${id}`));
      dispatch(setMyNft(data));
    } catch (error) {}
  };

export const getUserUpholdAsync =
  (code: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.post(URLS.userUphold, { code });

      data.status && dispatch(setRedirectUphold(true));
    } catch (error) {}
  };

export const getCollectionsAsync =
  ({
    url = "",
    page = 1,
    perPage = 15,
    id,
  }: {
    url?: string;
    page?: number;
    perPage?: number;
    id: string;
  }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    dispatch(setLoading(true));
    try {
      const { data } = await apiAuth.get(
        `/users/${id}/collections?page_size=${perPage}&page_number=${page}${url}`
      );

      const newData = replaceOldArr({
        oldArr: getStore().profile.collections.data,
        newArr: data.collections,
        key: "id",
      });

      dispatch(setCollection({ ...data, data: newData }));
    } catch (error) {
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteOfferNft =
  (nft: ItemDetail) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.delete(
        `${URLS.offersById.replace("<id>", `${nft?.offer_id}`)}`
      );

      if (data) {
        dispatch(getNftByIdAsync(nft?.fk_nft_id));
      }
    } catch (error) {}
  };

export const postCreateOffers =
  (props: any) => async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      const { item, ...rest } = props;
      dispatch(setInfoMessage(infoMessages.LOADING_CREATE_OFFER));
      const { data } = await apiAuth.post(`${URLS.offers}`, rest);
      if (data) {
        dispatch(setMyNft({ ...item, ...data, ...{ createdTrade: true } }));
      }
    } catch (error) {
      if (error?.response?.data?.error === "Wallet is missing") {
        dispatch(setError(errors.NO_ONFIDO_ID));
        return;
      }
      dispatch(setError(error?.response?.data?.error));
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_CREATE_OFFER));
    }
  };

export const getBlockchainMethodsAsync =
  () => async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_BLOCKCHAIN_METHODS));

      const { data } = await apiAuth.get(URLS.blockchainMethods);
      dispatch(setBlockchainMethods(data?.result));
    } catch (error) {
      if (
        error.response.data.error === errors.NO_ONFIDO_ID ||
        error.response.data.error === errors.PENDING_ONFIDO ||
        error.response.data.error === errors.DECLINED_BY_ONFIDO ||
        error.response.data.error === errors.NO_LOCATION_ONFIDO ||
        error.response.data.error === errors.CIRCLE_WALLET_RESTRICTED ||
        error.response.data.error === errors.PAYMENT_METHOD_DECLINED
      ) {
        dispatch(setError(error.response.data.error));
      }

      if (
        error.response.data.error === "User has not verified the email address"
      ) {
        dispatch(setError(EMAIL_NOT_VERIFIED));
      }
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_BLOCKCHAIN_METHODS));
    }
  };

export const getCircleKey = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await apiAuth.get(URLS.circleKey);
    dispatch(setCircleKey(data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const postTopUpWithCircle =
  (info: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const { data } = await apiAuth.post(URLS.topUpWithCircle, {
        ...info,
        verificationSuccessUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/3dsecure/success`,
        verificationFailureUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/3dsecure/failure`,
      });

      if (data) {
        window.location.replace(data);
      }

      toast.success("Pay created", {
        icon: IconCheckSquare,
        ...setingsNotification,
      });
      dispatch(setLoading(false));
    } catch (error) {
      if (error.response.data.error === errors.NO_ONFIDO_ID) {
        dispatch(setError(errors.NO_ONFIDO_ID));
      }
      if (error.response.data.error === errors.PENDING_ONFIDO) {
        dispatch(setError(errors.PENDING_ONFIDO));
      }
      if (error.response.data.error === errors.DECLINED_BY_ONFIDO) {
        dispatch(setError(errors.DECLINED_BY_ONFIDO));
      }
      if (error.response.data.error === errors.LIMIT_OF_TOP_UPS) {
        dispatch(setError(errors.LIMIT_OF_TOP_UPS));
      }
      if (error.response.data.error === errors.NO_LOCATION_ONFIDO) {
        dispatch(setError(errors.NO_LOCATION_ONFIDO));
      }
      if (error.response.data.error === errors.PAYMENT_METHOD_DECLINED) {
        dispatch(setError(errors.PAYMENT_METHOD_DECLINED));
      }
      if (
        error.response.data.error === "User has not verified the email address"
      ) {
        dispatch(setError(EMAIL_NOT_VERIFIED));
      }
      dispatch(setLoading(false));
    }
  };

export const postOnfidoSgkKey =
  (info: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const { data } = await apiAuth.post(URLS.onfidoSdkKey, info);
      dispatch(setOnfidoSdkKey(data.token));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.response.data.error));
      dispatch(setLoading(false));
    }
  };

export const postOnfidoCkeck = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    await apiAuth.post(URLS.onfidoCheck);
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const postOnfidoToken = (info: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await apiAuth.post(URLS.onfidoToken, info);
    dispatch(setOnfidoSdkKey(data.token));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const getCircleTransactionStatus =
  ({ transaction_id }: { transaction_id: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      const url = `${URLS.circleTransactionStatus}?transaction_id=${transaction_id}`;

      const { data } = await apiAuth.get(url);
      if (data?.pop_up) {
        dispatch(setError(errors.PENDING_TOPUP));
      }

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

export const postWithdrawWithCircle =
  (info: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_WITHDROW));
      await apiAuth.post(URLS.withdrawWithCircle, info);
      toast.success("Pay created", {
        icon: IconCheckSquare,
        ...setingsNotification,
      });
      dispatch(getBalanceAsync());
      dispatch(setLoading(false));
      dispatch(setInfoMessage(infoMessages.WITHDRAW_SUCCESS));
    } catch (error) {
      toast.error("Pay errored", {
        ...setingsNotification,
      });
      dispatch(setInfoMessage(errors.WITHDRAW_ERROR));
      dispatch(setWalletError(error?.response?.data?.error));
      dispatch(setLoading(false));
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_WITHDROW));
    }
  };

export const postWithdraw = (info: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setInfoMessage(infoMessages.LOADING_WITHDROW));
    await apiAuth.post(URLS.withdraw, info);
    toast.success("Pay created", {
      icon: IconCheckSquare,
      ...setingsNotification,
    });
    dispatch(getBalanceAsync());
    dispatch(setLoading(false));
    dispatch(setInfoMessage(infoMessages.WITHDRAW_SUCCESS));
  } catch (error) {
    toast.error("Pay errored", {
      ...setingsNotification,
    });
    dispatch(setInfoMessage(errors.WITHDRAW_ERROR));
    dispatch(setWalletError(error?.response?.data?.error));
  } finally {
    dispatch(removeInfoMessage(infoMessages.LOADING_WITHDROW));
  }
};

export const getWalletHistory =
  ({ page, perPage, url }: { page: number; perPage: number; url: string }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_HISTORY));

      const { data } = await apiAuth.get(
        `${URLS.walletHistory}?page_size=${perPage}&page_number=${page}${url}`
      );

      const newData = replaceOldArr({
        oldArr: getStore().profile.walletHistory.data,
        newArr: data.data,
        key: "id",
      });

      dispatch(setWalletHistory({ ...data, data: newData }));
    } catch (error) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_HISTORY));
    }
  };

export const getNotifications =
  ({ page, perPage }: { page: number; perPage: number }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      const { data } = await apiAuth.get(
        `${URLS.notifications}?page_size=${perPage}&page_number=${page}`
      );
      const newData = replaceOldArr({
        oldArr: getStore().profile.notifications.data,
        newArr: data.data,
        key: "id",
      });

      dispatch(setNotifications({ ...data, data: newData }));
      dispatch(checkNotificationUpdate(true));
    } catch (error) {}
  };

export const getNotificationsIsNew =
  ({ page, perPage }: { page: number; perPage: number }) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.get(
        `${URLS.notifications}?page_size=${perPage}&page_number=${page}`
      );

      dispatch(setNotifications({ ...data }));
    } catch (error) {}
  };

export const checkNotificationUpdate =
  (isOpenDropdown: boolean) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.get(URLS.notificationsUpdate);
      dispatch(setUnread(data.unread));

      if (data.unread && !isOpenDropdown) {
        dispatch(globalActions.setCountInfinityPage(1));
        dispatch(getNotificationsIsNew({ page: 1, perPage: 3 }));
      }
    } catch (error) {}
  };

export const readNotification =
  (notification_ids?: string) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      const { data } = await apiAuth.put(URLS.notifications, {
        notification_ids,
      });

      dispatch(setUnread(data.unread));

      const notifications = getStore().profile.notifications;
      const notificationsData = notifications.data.map((i) => {
        if (!notification_ids)
          return {
            ...i,
            is_read: true,
          };

        if (i.id !== notification_ids) return i;
        return {
          ...i,
          is_read: true,
        };
      });

      dispatch(
        setNotifications({
          ...notifications,
          data: notificationsData,
        })
      );
    } catch (error) {}
  };

export const verifyPhoneNumberAsync =
  ({ phone, code }: { phone: string; code?: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_VERIFY_PHONE_NUMBER));

      const body = {
        phone,
        ...(code && { code }),
      };

      const res = await apiAuth.post(`${URLS.verifyPhoneNumber}`, body);

      if (res.data.status === "Verified") {
        dispatch(
          changeUserData({
            user: {
              is_phone_verified: true,
              phone_last_digits: phone.slice(-3),
            },
          })
        );
      }
    } catch (error) {
      dispatch(setError(error.response.data.error));
    } finally {
      dispatch(setInfoMessage(infoMessages.CLEAR_AUTH_CODE));
      dispatch(removeInfoMessage(infoMessages.LOADING_VERIFY_PHONE_NUMBER));
    }
  };

export const setupTwoFaAsync =
  ({ code }: { code?: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await apiAuth.post(`${URLS.setupTwoFa}`, { totp_code: code });

      if (!code) {
        dispatch(setInfoMessage(infoMessages.LOADING_TWO_FA));
      }

      if (res?.data?.link) {
        dispatch(setQr(res.data));
        dispatch(removeInfoMessage(infoMessages.LOADING_TWO_FA));
        return;
      }

      if (res?.data?.status === "Success") {
        dispatch(setError(""));
        dispatch(removeInfoMessage(infoMessages.LOADING_TWO_FA));
        dispatch(setInfoMessage(infoMessages.TWO_FA_SUCCESS));
        dispatch(changeUserData({ user: { is_totp_active: true } }));
      }
    } catch (error) {
      dispatch(setError(error.response.data.error));
      dispatch(removeInfoMessage(infoMessages.LOADING_TWO_FA));
    }
  };

export const verifyTotpAsyc =
  ({ code }: { code?: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_TOTP));

      const res = await apiAuth.post(`${URLS.authTwoFa}`, {
        totp_code: code,
        refresh_token: localStorage.getItem("refresh_token"),
        fingerprint: fingerprint(),
      });

      if (res?.data?.user) {
        localStorage.setItem(
          "refresh_token",
          res?.data.accessToken.refresh_token
        );
        localStorage.setItem("user", JSON.stringify(res?.data.user));
        CookieService.set("token", res?.data.accessToken.access_token, {
          path: "/",
        });
        dispatch(changeUserData({ user: { ...res?.data.user, isAuth: true } }));
      }
    } catch (error) {
      dispatch(setError(error.response.data.error));
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_TOTP));
    }
  };

export const resetPasswordAsync =
  ({ email }: { email: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_RESET_PASS));

      await apiAuth.post(`${URLS.resetPassword}`, { email });
      dispatch(setError(""));
    } catch (error) {
      dispatch(setError(error.response.data.error));
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_RESET_PASS));
    }
  };

export const deleteUserAsync =
  ({ totp }: { totp?: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_REMOVE_ACCOUNT));

      await apiAuth.post(`${URLS.deleteAccount}`, totp && { totp_code: totp });
      dispatch(closeAllProfileModal());
      dispatch(logout("remove account"));
    } catch (error) {
      dispatch(setError(error?.response?.data?.error));
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_REMOVE_ACCOUNT));
    }
  };

export const resetTotpAsync =
  ({ code }: { code?: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_RESET_TOTP));

      const res = await apiAuth.post(`${URLS.resetTotp}`, {
        ...(code && { phone_code: code }),
      });

      if (res?.data?.status !== "Waiting for confirmation code") {
        dispatch(setInfoMessage(infoMessages.RESET_TOTP));
        dispatch(removeInfoMessage(infoMessages.LOADING_RESET_TOTP));
        dispatch(changeUserData({ user: { is_totp_active: false } }));
      }

      if (code) {
        toast.success("Authenticator Reset", {
          icon: IconCheckSquare,
          ...setingsNotification,
        });
      }

      dispatch(setError(""));
    } catch (error) {
      dispatch(setError(error.response.data.error));
      dispatch(removeInfoMessage(infoMessages.LOADING_RESET_TOTP));
    }
  };

export const verifyEmailAsync =
  ({ email_code, fingerprint }: { email_code: string; fingerprint: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_VERIFY_EMAIL));

      const res = await apiAuth.post(`${URLS.verifyEmail}`, {
        email_code,
        fingerprint,
      });

      dispatch(login(res?.data.user, res?.data?.accessToken));
    } catch (error) {
      dispatch(setError(errors.INVALID_ACTION_CODE));
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_VERIFY_EMAIL));
    }
  };

export const selectUserData = (state: RootState) => state.profile.user;
export const selectIsAuth = (state: RootState) => state.profile.user.isAuth;
export const selectProfileData = (state: RootState) =>
  state.profile.userProfile;
export const selectSummaryItem = (state: RootState) =>
  state.profile.summaryItem;
export const selectFranchises = (state: RootState) => state.profile.franchises;
export const selectTypes = (state: RootState) => state.profile.types;
export const selectMyNft = (state: RootState) => state.profile.selectedNft;
export const selectCollections = (state: RootState) =>
  state.profile.collections;
export const selectUpholdRedirect = (state: RootState) =>
  state.profile.upholdRedirect;
export const selectCards = (state: RootState) => state.profile.cards;
export const selectOnfidoKey = (state: RootState) => state.profile.onfidoSdkKey;
export const selectProfileError = (state: RootState) => state.profile.error;
export const selectBalance = (state: RootState) => state.profile.balance;
export const selectQrData = (state: RootState) => state.profile.qr;
export const selectLoadingProfile = (state: RootState) => state.profile.loading;
export const selectBlockchainMethods = (state: RootState) =>
  state.profile.blockchainMethods;
export const selectCircleKey = (state: RootState) => state.profile.circleKey;
export const selectVerifyPhone = (state: RootState) =>
  state.profile.verifyPhone;
export const selectWalletHistory = (state: RootState) =>
  state.profile.walletHistory;
export const selectWalletError = (state: RootState) =>
  state.profile.walletError;
export const selectProfileInfoMessage = (state: RootState) =>
  state.profile.infoMessage;
export const selectUnreadNotification = (state: RootState) =>
  state.profile.unread;
export const selectNotifications = (state: RootState) =>
  state.profile.notifications;
export const selectWithdrawableBalance = (state: RootState) =>
  state.profile.withdrawableBalance;
export const selectProfileModalsInfo = (state: RootState) =>
  state.profile.profileModals;
export const selectWithdrawFee = (state: RootState) =>
  state.profile.withdrawFee;
