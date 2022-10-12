import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { GlobalInit, GlobalModals } from "./global.types";

const initialModalState = {
  phone: false,
  totp: false,
  profile: false,
  resetTotp: false,
  nftWithdrawHistory: false,
};

const init: GlobalInit = {
  fetchingGlobal: false,
  openMenu: false,
  settingsModal: initialModalState,
  countInifinityPage: 0,
};

const global = createSlice({
  name: "global",
  initialState: init,
  reducers: {
    setFetchingGlobal: (state) => ({
      ...state,
      fetchingGlobal: true,
    }),
    removeFetchingGlobal: (state) => ({
      ...state,
      fetchingGlobal: false,
    }),
    setOpenMenu: (state, action) => ({
      ...state,
      openMenu: action.payload,
    }),
    setSelectStoreTab: (state, action) => ({
      ...state,
      selectStoreTab: action.payload,
    }),
    setSettingsModas: (state, action) => ({
      ...state,
      settingsModal: {
        ...state.settingsModal,
        ...action.payload,
      },
    }),
    setSettingsModalByKey: (state, action: { payload: GlobalModals }) => ({
      ...state,
      settingsModal: {
        ...initialModalState,
        [action.payload]: true,
      },
    }),
    closeAllSettingsModal: (state) => ({
      ...state,
      settingsModal: {
        ...initialModalState,
      },
    }),
    setCountInfinityPage: (state, action) => ({
      ...state,
      countInifinityPage: action.payload,
    }),
  },
});

export const globalActions = global.actions;

export default global.reducer;

export const selectGlobal = (state: RootState) => state.global;
export const selectCountInfinityPage = (state: RootState) =>
  state.global.countInifinityPage;
export const selectSettingsModal = (state: RootState) =>
  state.global.settingsModal;
