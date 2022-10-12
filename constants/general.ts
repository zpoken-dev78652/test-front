import Hedera from "../public/img/currency/hedera.png";
import Tron from "../public/img/currency/tron.png";
import Stellar from "../public/img/currency/stellar.png";
import Ethereum from "../public/img/currency/ethereum.png";
import Solana from "../public/img/currency/solana.png";

import { ToastOptions } from "react-toastify";
import { TabsWalletModalType } from "../redux/profile/profile.types";
import { BalanceCurrency } from "../types";

export const mobileWidth = 599.98;

export const walletTabs: TabsWalletModalType[] = [
  "deposit",
  "withdraw",
  "history",
];

export const icons: { [key: string]: any } = {
  HBAR: Hedera,
  TRX: Tron,
  XLM: Stellar,
  SOL: Solana,
  "USDC (ERC-20)": Ethereum,
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const dropdownItems = [
  {
    id: 1,
    title: "My Collection",
    link: `/profile/<id>/collection`,
  },
];

export const rangePriceBtn = [
  {
    id: 1,
    max: 10,
  },
  {
    id: 2,
    min: 10,
    max: 50,
  },
  {
    id: 3,
    min: 50,
    max: 100,
  },
  {
    id: 4,
    min: 100,
    max: 200,
  },
  {
    id: 5,
    min: 200,
    max: 500,
  },
  {
    id: 6,
    min: 500,
    max: 1000,
  },
  {
    id: 7,
    min: 1000,
  },
];

export const creditCardMask = [
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];
export const dateYearMask = [/\d/, /\d/, "/", /\d/, /\d/];
export const cvvMask = [/\d/, /\d/, /\d/];

export const setingsNotification: ToastOptions = {
  position: "bottom-center",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "colored",
};
