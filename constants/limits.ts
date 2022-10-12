import { BalanceCurrency } from "../types";

export const offerMaxLimit: { [k in BalanceCurrency]: number } = {
  USDC: 10000,
  XNL: 500000,
};

export const withdrawMinLimit: { [k: string]: number } = {
  USDC: 1,
  XNL: 1,
  USDC_BANK: 26,
};

export const withdrawMaxLimit: { [k: string]: number } = {
  USDC: 10000,
  USDC_BANK: 10000,
  XNL: 500000,
};
