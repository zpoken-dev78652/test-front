import {
  Balance,
  BalanceCurrency,
  CollectionItems,
  Franchise,
  GenericPaginationType,
  ItemDetail,
  NotificatioType,
  SummaryItem,
  User,
  WalletHistoryResponseType,
} from "../../types";

export type BlockchainType = {
  [key in BalanceCurrency]: string;
};

export type profileInitType = {
  user: User;
  userProfile: Omit<User, "isAuth">;
  balance: Balance;
  withdrawableBalance: Omit<Balance, "noWallet">;
  summaryItem: SummaryItem;
  franchises: Franchise[];
  types: string[];
  //need change
  cards: any[];
  selectedNft: null | ItemDetail;
  collections: CollectionItems;
  upholdRedirect: boolean;
  loading: boolean;
  blockchainMethods: BlockchainType;
  circleKey: {
    keyId: string;
    publicKey: string;
  };
  qr: {
    link: string;
    secret: string;
  };
  error: string;
  onfidoSdkKey: string;
  verifyPhone: string;
  walletHistory: WalletHistoryResponseType;
  infoMessage: string[];
  walletError: string | null;
  unread: number;
  notifications: GenericPaginationType<NotificatioType>;
  profileModals: InitialProfileModalType;
  withdrawFee: {
    fee: number;
    withdraw_after_fee: number;
  } | null;
};

export type TabsWalletModalType = "deposit" | "withdraw" | "history";
export type ProfileModalsKeyType = TabsWalletModalType | "wallet";
export type SelectWolletType = BalanceCurrency | "";
export type SelectTabType = BalanceCurrency | "";

export type ProfileModalsType = {
  [key in ProfileModalsKeyType]: boolean;
};

export type ProfileModalsTabType = {
  selectWallet: SelectWolletType;
  seletTabModal: TabsWalletModalType;
};

export type InitialProfileModalType = ProfileModalsTabType & ProfileModalsType;
