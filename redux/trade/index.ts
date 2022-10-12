import { createSlice } from "@reduxjs/toolkit";
import { api, apiAuth, URLS } from "../../api";
import { BoughtItem, ItemDetail, ItemDetails, PriceType } from "../../types";
import { AppDispatch } from "../store";
import { globalActions, profileActions, RootState } from "..";
import { replaceOldArr } from "../../helpers";
import { infoMessages, setingsNotification } from "../../constants";
import { checkNotificationUpdate } from "../profile";
import { toast } from "react-toastify";
import { IconCheckSquare } from "../../public/icons";

type getChronicleTradeAsyncProps = {
  id: string;
  url: string;
  page: number;
  perPage: number;
  type: string;
};

export type TypeTrade = {
  chronicleTrade: ItemDetails;
  error: string | null;
  infoMessage: string[];
  loading: boolean;
  chronicleItemById: ItemDetail | null;
  boughtChronicleById: BoughtItem | null;
};

const initTrade: TypeTrade = {
  chronicleTrade: {
    data: [],
    num_pages: 0,
    page_number: 0,
    page_size: 0,
    total_results: 0,
  },
  error: null,
  infoMessage: [],
  chronicleItemById: null,
  boughtChronicleById: null,
  loading: false,
};

const trade = createSlice({
  name: "trade",
  initialState: initTrade,
  reducers: {
    setChronicleTrade: (state, action) => ({
      ...state,
      chronicleTrade: {
        ...state.chronicleTrade,
        num_pages: action.payload.num_pages,
        page_number: action.payload.page_number,
        page_size: action.payload.page_size,
        total_results: action.payload.total_results,
        data: [...action.payload.data],
      },
    }),
    setChronicleItemTrade: (state, action) => ({
      ...state,
      chronicleTrade: {
        ...state.chronicleTrade,
        data: [...state.chronicleTrade.data, ...action.payload],
      },
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
    setChronicleItemById: (state, action) => ({
      ...state,
      chronicleItemById: action.payload,
    }),
    setLoading: (state, action) => ({
      ...state,
      loading: action.payload,
    }),

    setBoughtChronicleTradeById: (state, action) => ({
      ...state,
      boughtChronicleById: action.payload,
    }),
    resetTrade: (state) => {
      const { boughtChronicleById, ...rest } = initTrade;
      return {
        boughtChronicleById: state.boughtChronicleById,
        ...rest,
      };
    },
  },
});

export const tradeActions = trade.actions;

export default trade.reducer;

const {
  setChronicleTrade,
  setLoading,
  setChronicleItemById,
  setBoughtChronicleTradeById,
  setError,
  setInfoMessage,
  removeInfoMessage,
} = tradeActions;

export const getChronicleTradeAsync =
  ({ id, url, page, perPage }: getChronicleTradeAsyncProps) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    try {
      dispatch(setLoading(true));
      dispatch(setInfoMessage(infoMessages.LOADING_OFFERS));

      const { data } = id
        ? await apiAuth.get(
            `${URLS.offersListings.replace(
              "<id>",
              `${id}`
            )}?page_size=${perPage}&page_number=${page}${url}`
          )
        : await api.get(
            `${URLS.offers}?page_size=${perPage}&page_number=${page}${url}`
          );

      const { offers, ...pagination } = data;

      const newData = replaceOldArr({
        oldArr: getStore().trade.chronicleTrade.data,
        newArr: offers,
        key: "id",
      });

      dispatch(setChronicleTrade({ ...pagination, data: newData }));
      dispatch(setLoading(false));
      dispatch(removeInfoMessage(infoMessages.LOADING_OFFERS));
    } catch (error) {
    } finally {
    }
  };

export const getChronicleTradeByIdAsync =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await api.get(
        `${URLS.offersById.replace("<id>", `${id}`)}`
      );
      dispatch(setChronicleItemById(data));
    } catch (error) {}
  };

export const putEditOffers =
  (item: ItemDetail, props: any, nft?: boolean) =>
  async (dispatch: AppDispatch) => {
    const { setMyNft } = profileActions;

    try {
      dispatch(setInfoMessage(infoMessages.LOADING_EDIT_OFFER));
      const { data } = await apiAuth.put(
        `${URLS.offersById.replace("<id>", `${item.offer_id || item.id}`)}`,
        props
      );
      if (data) {
        const state = nft ? setMyNft : setChronicleItemById;

        dispatch(state({ ...item, ...data }));
        toast.success("listing created", {
          icon: IconCheckSquare,
          ...setingsNotification,
        });
        dispatch(setInfoMessage(infoMessages.EDDIDED_OFFER));
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.error));
    } finally {
      dispatch(removeInfoMessage(infoMessages.LOADING_EDIT_OFFER));
    }
  };

export const deleteOffer =
  (item: ItemDetail) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const { data } = await apiAuth.delete(
        `${URLS.offersById.replace("<id>", `${item?.id}`)}`
      );

      if (data) {
        dispatch(
          setChronicleItemById({
            ...item,
            ...{ offer_id: null, seller_id: null },
          })
        );
      }
    } catch (error) {
    } finally {
      dispatch(setLoading(false));
    }
  };

export const selectChronicleTrade = (state: RootState) =>
  state.trade.chronicleTrade;
export const selectChronicleTradeById = (state: RootState) =>
  state.trade.chronicleItemById;
export const selectTradeInfoMessage = (state: RootState) =>
  state.trade.infoMessage;
export const selectBoughtTradeById = (state: RootState) =>
  state.trade.boughtChronicleById;
export const selectChronicleTradeStatus = (state: RootState) => ({
  error: state.trade.error,
  loading: state.trade.loading,
  infoMessage: state.trade.infoMessage,
});
