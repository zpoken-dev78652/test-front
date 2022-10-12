import { createSlice } from "@reduxjs/toolkit";
import { getBalanceAsync, globalActions, RootState } from "..";
import { api, apiAuth, URLS } from "../../api";
import {
  itemForBuy,
  AllItemsCollectionByIDResponseType,
  BidType,
  BoughtItem,
  CollectionById,
  CollectionResponseType,
  ItemCommunitySalesType,
  MysteryBoxItem,
  NFTDuplicateType,
  PaginationType,
  PriceType,
  StoreItem,
  StoreItems,
  TradeHistoryResponseType,
} from "../../types";
import { AppDispatch } from "../store";
import { errors, infoMessages, setingsNotification } from "../../constants";
import { replaceOldArr } from "../../helpers";
import { toast } from "react-toastify";
import { IconCheckSquare } from "../../public/icons";
import { checkNotificationUpdate } from "../profile";
import { ResponseQuery, SetItemsByKeyProps } from "./store.types";

export type StoreSliceAuth = {
  chronicleStore: StoreItems;
  featuredItems: StoreItems;
  userItems: StoreItems;
  selectItemForBuy: any;
  NFTTransferoutHistory: any;
  itemCommunitySales: ItemCommunitySalesType;
  chronicleItemById: StoreItem | null;
  boughtChronicleById: BoughtItem | null;
  error: string | null;
  itemById: StoreItem | null;
  collectionById: CollectionById;
  itemForBuy: null | itemForBuy;
  loading: boolean;
  duplicateItem: null | NFTDuplicateType[];
  bids: BidType[];
  infoMessage: string[];
  tradeHistory: TradeHistoryResponseType;
  collections: CollectionResponseType;
  allItemsCollectionById: AllItemsCollectionByIDResponseType;
  mysteryBoxItems: PaginationType & { data: MysteryBoxItem[] };
  commonMysteryBoxItems: PaginationType & { data: MysteryBoxItem[] };
};

const pagination = {
  num_pages: 0,
  page_number: 0,
  page_size: 0,
  total_results: 0,
};

const initAuth: StoreSliceAuth = {
  mysteryBoxItems: {
    data: [],
    ...pagination,
  },
  chronicleStore: {
    data: [],
    ...pagination,
  },
  userItems: {
    data: [],
    ...pagination,
  },
  featuredItems: {
    data: [],
    ...pagination,
  },
  NFTTransferoutHistory: {
    data: [],
    ...pagination,
  },
  itemCommunitySales: {
    entities: [],
    ...pagination,
  },
  collections: {
    data: [],
    ...pagination,
  },
  allItemsCollectionById: {
    collection: {
      banner: {
        desktop: "",
        main: "",
        mobile: "",
      },
      id: "",
      name: "",
    },
    data: [],
    ...pagination,
  },
  commonMysteryBoxItems: {
    data: [],
    ...pagination,
  },
  bids: [],
  chronicleItemById: null,
  boughtChronicleById: null,
  error: null,
  loading: false,
  itemById: null,
  collectionById: {} as CollectionById,
  itemForBuy: null,
  duplicateItem: null,
  infoMessage: [],
  tradeHistory: {
    data: [],
    ...pagination,
  },
  selectItemForBuy: null,
};

const store = createSlice({
  name: "store",
  initialState: initAuth,
  reducers: {
    setItemsByKey: (state, action: { payload: SetItemsByKeyProps<any> }) => ({
      ...state,
      [action.payload.key]: {
        ...state[action.payload.key],
        num_pages: action.payload.num_pages,
        page_number: action.payload.page_number,
        page_size: action.payload.page_size,
        total_results: action.payload.total_results,
        data: [...action.payload?.data],
      },
    }),
    setMysteryBoxItems: (state, action) => ({
      ...state,
      mysteryBoxItems: {
        ...state.mysteryBoxItems,
        num_pages: action.payload.num_pages,
        page_number: action.payload.page_number,
        page_size: action.payload.page_size,
        total_results: action.payload.total_results,
        data: action.payload?.data,
      },
    }),

    setCommonMysteryBoxItems: (state, action) => ({
      ...state,
      commonMysteryBoxItems: {
        ...state.commonMysteryBoxItems,
        num_pages: action.payload.num_pages,
        page_number: action.payload.page_number,
        page_size: action.payload.page_size,
        total_results: action.payload.total_results,
        data: [...state.commonMysteryBoxItems.data, ...action.payload?.data],
      },
    }),
    setAllItemsCollectionById: (state, action) => ({
      ...state,
      allItemsCollectionById: {
        ...state.allItemsCollectionById,
        num_pages: action.payload.num_pages,
        page_number: action.payload.page_number,
        page_size: action.payload.page_size,
        total_results: action.payload.total_results,
        data: [...action.payload?.data],
        collection: action.payload?.collection,
      },
    }),

    setItemCommunitySales: (state, action) => ({
      ...state,
      itemCommunitySales: {
        ...state.itemCommunitySales,
        num_pages: action.payload.num_pages,
        page_number: action.payload.page_number,
        page_size: action.payload.page_size,
        total_results: action.payload.total_results,
        entities: [
          ...state.itemCommunitySales.entities,
          ...action.payload.items,
        ],
      },
    }),
    setStoreFeatureds: (state, action) => ({
      ...state,
      featureds: action.payload,
    }),
    setChronicleItemById: (state, action) => ({
      ...state,
      chronicleItemById: action.payload,
    }),
    setBoughtChronicleStoreById: (state, action) => ({
      ...state,
      boughtChronicleById: action.payload,
    }),
    setError: (state, action) => ({
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
    setItemById: (state, action) => ({
      ...state,
      itemById: action.payload,
    }),

    setCollectionById: (state, action) => ({
      ...state,
      collectionById: action.payload,
    }),
    setLoading: (state, action) => ({
      ...state,
      loading: action.payload,
    }),
    setItemForBuy: (state, action) => ({
      ...state,
      itemForBuy: action.payload,
    }),
    setDuplicateItem: (state, action) => ({
      ...state,
      duplicateItem: action.payload,
    }),
    setSelectItemForBuy: (state, action) => ({
      ...state,
      selectItemForBuy: action.payload,
    }),
    setBids: (state, action) => ({
      ...state,
      bids: action.payload,
    }),
    resetChronicleStore: (state, action) => ({
      ...state,
      chronicleStore: {
        data: [],
        num_pages: 0,
        page_number: 0,
        page_size: 0,
        total_results: 0,
      },
    }),
    resetCollectionByID: (state) => {
      return {
        ...state,
        collectionById: {
          ...state.collectionById,
          data: initAuth.collectionById.data,
          num_pages: 0,
          page_number: 0,
          page_size: 0,
          total_results: 0,
        },
      };
    },
    resetAuth: (state) => {
      const { boughtChronicleById, infoMessage, ...rest } = initAuth;
      return {
        boughtChronicleById: state.boughtChronicleById,
        infoMessage: state.infoMessage,
        ...rest,
      };
    },
  },
});

export const storeActions = store.actions;

export default store.reducer;

const {
  setItemCommunitySales,
  setChronicleItemById,
  setBoughtChronicleStoreById,
  setItemById,
  setError,
  setLoading,
  setCollectionById,
  setDuplicateItem,
  setBids,
  setInfoMessage,
  removeInfoMessage,
  setAllItemsCollectionById,
  setMysteryBoxItems,
  setCommonMysteryBoxItems,
  setSelectItemForBuy,
  setItemsByKey,
} = storeActions;

export const getChronicleStoreAsync =
  ({
    id,
    url,
    page,
    perPage,
    type,
  }: {
    id: string;
    url: string;
    page: number;
    perPage: number;
    type: string;
  }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    dispatch(setLoading(true));
    const isAuction = type === "auction";
    if (isAuction) {
      dispatch(setInfoMessage(infoMessages.LOADING_AUCTIONS));
    }

    const urlNoAuth = isAuction ? URLS.auction : URLS.storeItems;
    const urlAuth = isAuction ? URLS.usersAuctions : URLS.myItems;

    const fullUrl = `?page_size=${perPage}&page_number=${page}${url}`;

    try {
      const { data } = !id
        ? await api.get(`${urlNoAuth}${fullUrl}`)
        : await apiAuth.get(`${urlAuth.replace("<id>", `${id}`)}${fullUrl}`);

      const newData = replaceOldArr({
        oldArr: getStore().store.chronicleStore.data,
        newArr: data.data,
        key: "id",
      });

      dispatch(
        setItemsByKey({ ...data, data: newData, key: "chronicleStore" })
      );
    } catch (error) {
    } finally {
      dispatch(setLoading(false));
      dispatch(removeInfoMessage(infoMessages.LOADING_AUCTIONS));
    }
  };

export const getUserItems =
  ({
    id,
    url,
    page,
    perPage,
  }: {
    id: string;
    url: string;
    page: number;
    perPage: number;
  }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_USER_ITEMS));

      const { data } = await apiAuth.get(
        `${URLS.myItems.replace(
          "<id>",
          `${id}`
        )}?page_size=${perPage}&page_number=${page}${url}`
      );

      const newData = replaceOldArr({
        oldArr: getStore().store.userItems.data,
        newArr: data.data,
        key: "id",
      });

      dispatch(setItemsByKey({ ...data, data: newData, key: "userItems" }));
    } catch (error) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_USER_ITEMS));
    }
  };

export const getFeaturedItemsAsync =
  ({ url, page, perPage }: { url: string; page: number; perPage: number }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    dispatch(setInfoMessage(infoMessages.LOADING_FEATURED_ITEMS));

    try {
      const { data }: { data: ResponseQuery<any> } = await api.get(
        `${URLS.storeItems}?featured=True&purpose=store&page_size=${perPage}&page_number=${page}${url}`
      );

      const newData = replaceOldArr({
        oldArr: getStore().store.featuredItems.data,
        newArr: data.data,
        key: "id",
      });

      dispatch(setItemsByKey({ ...data, data: newData, key: "featuredItems" }));
    } catch (error) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_FEATURED_ITEMS));
    }
  };

export const getNFTWithdrawalHistoryAsync =
  ({ url, page, perPage }: { url: string; page: number; perPage: number }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    dispatch(setInfoMessage(infoMessages.LOADING_NFT_TRANSFEROUT_HISTORY));

    try {
      const { data }: { data: ResponseQuery<any> } = await apiAuth.get(
        `${URLS.nftWithdrawalHistory}?page_size=${perPage}&page_number=${page}${url}`
      );

      const newData = replaceOldArr({
        oldArr: getStore().store.NFTTransferoutHistory.data,
        newArr: data.data,
        key: "id",
      });

      dispatch(
        setItemsByKey({ ...data, data: newData, key: "NFTTransferoutHistory" })
      );
    } catch (error) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_NFT_TRANSFEROUT_HISTORY));
    }
  };

export const getTopAuctionsAsync =
  ({ page_number = 1, size = 5 }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    dispatch(setLoading(true));
    dispatch(setInfoMessage(infoMessages.LOADING_AUCTIONS));
    try {
      const { data } = await api.get(
        `${URLS.auction}?page_size=${size}&page_number=${page_number}&release_datetime_=desc&status=active`
      );

      const { data: allAuctions } = await api.get(
        `${URLS.auction}?page_size=${size}&page_number=${page_number}&status=archived&finish_datetime_=desc`
      );

      const newData = replaceOldArr({
        oldArr: getStore().store.chronicleStore.data,
        newArr: [...data.data, ...allAuctions.data].slice(0, 5),
        key: "id",
      });

      dispatch(
        setItemsByKey({ ...data, data: newData, key: "chronicleStore" })
      );
    } catch (error) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_AUCTIONS));

      dispatch(setLoading(false));
    }
  };

export const getItemCommunitySalesAsync =
  ({
    itemId,
    sortField,
    sortDirection,
    page_number = 1,
    page_size = 20,
  }: any) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    const urls =
      sortField && sortDirection ? `&${sortField}=${sortDirection}` : "";
    const num_pages = getStore().store.itemCommunitySales.num_pages;

    if (num_pages && num_pages < page_number) return;

    try {
      const { data } = await api.get(
        `${URLS.itemsHistory.replace(
          "<id>",
          `${itemId}`
        )}?page_size=${page_size}&page_number=${page_number}${urls}`
      );

      dispatch(setItemCommunitySales(data));
    } catch (error) {}
  };

export const getChronicleStoreByIdAsync =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await api.get(`${URLS.storeItems}/${id}`);
      dispatch(setChronicleItemById(data));
    } catch (error) {}
  };

export const postWithdrawNftAsync =
  ({
    address,
    nft_id,
    totp_code,
  }: {
    address: string;
    nft_id: string;
    totp_code: string;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_WITHDRAW_NFT));

      const data = await apiAuth.post(`${URLS.withdrawNft}`, {
        address,
        nft_id,
        totp_code,
      });

      if (data) {
        dispatch(setInfoMessage(infoMessages.WITHDRAW_NFT_SUCCESS));
        toast.success("Withdraw success", {
          icon: IconCheckSquare,
          ...setingsNotification,
        });
      }
    } catch (error) {
      if (error?.response?.data?.error)
        dispatch(setError(error?.response?.data?.error));
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_WITHDRAW_NFT));
    }
  };

export const getChronicleStoreAuctionByIdAsync =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await api.get(`${URLS.auction}/${id}`);
      dispatch(setChronicleItemById(data));
    } catch (error) {}
  };

export const getBidsAuctionByIdAsync =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await api.get(
        URLS.auctionGetBids.replace("<id>", `${id}`)
      );
      dispatch(setBids(data));
    } catch (error) {}
  };

export const postAuctionBidAsync =
  (id: string, default_price: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(removeInfoMessage("full"));

      await apiAuth.post(URLS.auctionCreateBid.replace("<id>", `${id}`), {
        default_price,
      });
      toast.success("bid created", {
        icon: IconCheckSquare,
        ...setingsNotification,
      });
      dispatch(setInfoMessage("bid created"));
      dispatch(getBalanceAsync());
      dispatch(getBidsAuctionByIdAsync(id));
      dispatch(setError(null));
      dispatch(setLoading(false));
    } catch (error) {
      if (error?.response?.data?.error === errors.WRONG_VALUE_BID) {
        dispatch(setError(errors.WRONG_VALUE_BID));
        dispatch(setInfoMessage("bid errored"));
      }
      dispatch(setLoading(false));
    }
  };

export const postPreBuyAsync =
  ({
    item,
    default_price,
    duplicate,
    type,
  }: {
    item: any;
    default_price: any;
    duplicate?: any;
    type: "Item" | "MysteryBox" | "Offer";
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.post(URLS.preBuy, {
        default_price,
        intent_id: item?.id,
        intent_model: type,
      });

      if (duplicate) {
        dispatch(setSelectItemForBuy({ ...item, ...data, duplicate: false }));
        return;
      }

      if (!default_price.value) {
        dispatch(setBoughtChronicleStoreById({ ...item, ...data }));
      } else {
        dispatch(setSelectItemForBuy({ ...item, ...data }));
      }
    } catch (error) {
      if (error?.response?.data?.error)
        dispatch(setError(error?.response?.data?.error));
    }
  };

export const postBuyWithWalletAsync =
  (id: string, default_price: PriceType, type: string, coupon?: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_BUY_WITH_WALLET));
      dispatch(globalActions.setFetchingGlobal());

      const { data } = await apiAuth.post(URLS.buyWithWallet, {
        default_price,
        intent_id: id,
        intent_model: type,
        ...(coupon && { coupon_name: coupon }),
      });
      dispatch(setBoughtChronicleStoreById(data));
      dispatch(checkNotificationUpdate(false));
    } catch (error) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_BUY_WITH_WALLET));
      dispatch(globalActions.removeFetchingGlobal());
    }
  };

export const postStripeSecretAsync =
  ({
    id,
    default_price,
    type,
    payment_method,
  }: {
    id: string;
    default_price: PriceType;
    type: string;
    payment_method?: string;
  }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_STRIPE_SECRET));
      const coupon = getStore().store.selectItemForBuy.coupon;
      const { data } = await apiAuth.post(URLS.stripeSecret, {
        default_price,
        intent_id: id,
        intent_model: type,
        ...(coupon && { coupon_name: coupon }),
        ...(payment_method && { payment_method: payment_method }),
      });

      dispatch(
        setSelectItemForBuy({
          ...getStore().store.selectItemForBuy,
          ...data,
        })
      );

      if (payment_method) {
        dispatch(setInfoMessage(infoMessages.CREATE_STRIPE_SECRET_WITH_PM));
      }
    } catch (error) {
      if (error?.response?.data?.error)
        dispatch(setError(error?.response?.data?.error));
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_STRIPE_SECRET));
    }
  };

export const postApplyCouponAsync =
  (id: string, default_price: any, type: string, coupon: string) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_APPLY_COUPON));
      const { data } = await apiAuth.post(URLS.applyCoupon, {
        default_price,
        intent_id: id,
        intent_model: type,
        coupon_name: coupon,
      });

      if (data) {
        dispatch(
          setSelectItemForBuy({
            ...getStore().store.selectItemForBuy,
            ...data,
            coupon,
          })
        );
      }

      if (data && data?.default_price?.value) {
        dispatch(
          postStripeSecretAsync({
            id,
            default_price: {
              value: data.default_price.value,
              currency: "USDC",
            },
            type,
          })
        );
      }
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(errors?.COUPON_IS_NOT_VALID));
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_APPLY_COUPON));
    }
  };

export const postApplyRedeemCouponAsync =
  (coupon_name: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_APPLY_COUPON));
      const { data } = await apiAuth.post(URLS.applyRedeemCoupon, {
        coupon_name,
      });

      if (data) {
        dispatch(setError(null));
        dispatch(setBoughtChronicleStoreById(data));
      }
    } catch (error) {
      dispatch(setError(errors?.COUPON_IS_NOT_VALID));
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_APPLY_COUPON));
    }
  };

export const getNftWebhookAsync =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.get(
        URLS.nftWebhookById.replace("<id>", `${id}`)
      );

      dispatch(setBoughtChronicleStoreById(data));
      dispatch(globalActions.removeFetchingGlobal());
      dispatch(checkNotificationUpdate(false));
    } catch (e) {}
  };

export const putBuyItemChronicleAsync =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setBoughtChronicleStoreById(data));
      dispatch(globalActions.removeFetchingGlobal());
    } catch (e) {
      if (!e) return;
      dispatch(globalActions.removeFetchingGlobal());
    }
  };

export const getCollectionyIdAsync =
  ({
    collectionId,
    userId,
    page,
    perPage,
  }: {
    collectionId: string;
    userId: string;
    page: number;
    perPage: number;
  }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      dispatch(setLoading(true));
      const { data } = await apiAuth.get(
        `${URLS.collectionById
          .replace("<userId>", `${userId}`)
          .replace(
            "<collectionId>",
            `${collectionId}`
          )}?page_size=${perPage}&page_number=${page}`
      );
      const { items, ...rest } = data;

      const newData = replaceOldArr({
        oldArr: getStore()?.store?.collectionById?.data || [],
        newArr: items,
        key: "id",
      });

      dispatch(setCollectionById({ ...rest, data: newData }));

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

export const getItemDuplicateByIdAsync =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.get(
        URLS.itemByIdMyNfts.replace("<id>", `${id}`)
      );
      dispatch(setDuplicateItem(data));
    } catch (error) {}
  };

export const postAuctionClaimAsync =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(globalActions.setFetchingGlobal());
      const { data } = await apiAuth.post(
        URLS.auctionsClaim.replace("<id>", `${id}`)
      );

      dispatch(setBoughtChronicleStoreById(data));
      dispatch(globalActions.removeFetchingGlobal());
    } catch (e) {}
  };

export const getTradeHistory =
  ({
    id,
    url,
    page,
    perPage,
    type,
  }: {
    id: string;
    url: string;
    page: number;
    perPage: number;
    type: string;
  }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_TRADE_HISTORY));
      const typeQuery = (
        type === "item" ? URLS.itemsTradeHistory : URLS.nftTradeHistory
      ).replace("<id>", `${id}`);

      const { data } = await apiAuth.get(
        `${typeQuery}?page_size=${perPage}&page_number=${page}${url}`
      );

      const newData = replaceOldArr({
        oldArr: getStore().store.tradeHistory.data,
        newArr: data.data,
        key: "trade_id",
      });

      dispatch(setItemsByKey({ ...data, data: newData, key: "tradeHistory" }));
    } catch (e) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_TRADE_HISTORY));
    }
  };

export const getMysteryBoxItemsById =
  (id: string, perPage: number, page: number) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiAuth.get(
        `mystery_boxes/${id}/items?page_size=${perPage}&page_number=${page}`
      );
      dispatch(setMysteryBoxItems(data));
    } catch (e) {}
  };

export const getCollections =
  ({ url, page, perPage }: { url: string; page: number; perPage: number }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_COLLECTIONS));
      const { data } = await api.get(
        `${URLS.collections}?page_size=${perPage}&page_number=${page}${url}`
      );

      const { collections, ...paginapion } = data;

      const newData = replaceOldArr({
        oldArr: getStore().store.collections.data,
        newArr: collections,
        key: "id",
      });

      dispatch(
        setItemsByKey({ ...paginapion, data: newData, key: "collections" })
      );
    } catch (e) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_COLLECTIONS));
    }
  };

export const getCommonMysteryBoxItem =
  ({
    url,
    page,
    perPage,
    id,
  }: {
    url: string;
    page: number;
    perPage: number;
    id: string;
  }) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      const { data } = await apiAuth.get(
        `mystery_boxes/${id}/items?page_size=${perPage}&page_number=${page}`
      );

      dispatch(setCommonMysteryBoxItems({ ...data }));
    } catch (e) {}
  };

export const getCollectionByID =
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
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_COLLECTIONS_BY_ID));
      const { data } = await api.get(
        `${URLS.collectionsById.replace(
          "<id>",
          `${id}`
        )}?page_size=${perPage}&page_number=${page}${url}`
      );

      const { collection, data: items, ...paginapion } = data;

      const newData = replaceOldArr({
        oldArr: getStore().store.allItemsCollectionById?.data,
        newArr: items,
        key: "id",
      });

      dispatch(
        setAllItemsCollectionById({ ...paginapion, collection, data: newData })
      );
    } catch (e) {
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_COLLECTIONS_BY_ID));
    }
  };

export const selectChronicleStore = (state: RootState) =>
  state.store.chronicleStore;
export const selectFeauteredItems = (state: RootState) =>
  state.store.featuredItems;
export const selectUserItems = (state: RootState) => state.store.userItems;
export const selectTradeHistoryItem = (state: RootState) =>
  state.store.tradeHistory;
export const selectCollectionsItem = (state: RootState) =>
  state.store.collections;
export const selectAllitemsCollections = (state: RootState) =>
  state.store.allItemsCollectionById;
export const selectItemCommunitySales = (state: RootState) =>
  state.store.itemCommunitySales;
export const selectChronicleStoreById = (state: RootState) =>
  state.store.chronicleItemById;
export const selectBoughtChronicleById = (state: RootState) =>
  state.store.boughtChronicleById;
export const selectBoughtError = (state: RootState) => state.store.error;
export const selectItemById = (state: RootState) => state.store.itemById;
export const selectCollectionById = (state: RootState) =>
  state.store.collectionById;
export const selectitemForBuy = (state: RootState) => state.store.itemForBuy;
export const selectLoading = (state: RootState) => state.store.loading;

export const selectDuplicateItem = (state: RootState) =>
  state.store.duplicateItem;
export const selectBids = (state: RootState) => state.store.bids;
export const selectInfoMessage = (state: RootState) => state.store.infoMessage;
export const selectMysteryBoxItems = (state: RootState) =>
  state.store.mysteryBoxItems;
export const selectCommonMysteryBoxItems = (state: RootState) =>
  state.store.commonMysteryBoxItems;
export const selectItemForBuy = (state: RootState) =>
  state.store.selectItemForBuy;
export const selectNftTransferoutHistory = (state: RootState) =>
  state.store.NFTTransferoutHistory;
