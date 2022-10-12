export type GlobalInit = {
  fetchingGlobal: boolean;
  openMenu: boolean;
  countInifinityPage: number;
  settingsModal: SettingsModalType;
};

export enum GlobalModals {
  phone = "phone",
  totp = "totp",
  profile = "profile",
  resetTotp = "resetTotp",
  nftWithdrawHistory = "nftWithdrawHistory",
}

type SettingsModalType = {
  [k in GlobalModals]: boolean;
};
