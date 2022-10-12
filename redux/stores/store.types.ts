import { PaginationType } from "../../types";

export type ItemsKey =
  | "featuredItems"
  | "collections"
  | "tradeHistory"
  | "chronicleStore"
  | "userItems"
  | "NFTTransferoutHistory";

export type ResponseQuery<T> = PaginationType & { data: T };

export type SetItemsByKeyProps<T> = ResponseQuery<T> & {
  key: ItemsKey;
};
