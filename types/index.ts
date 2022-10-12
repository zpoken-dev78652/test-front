export type PaginationType = {
  num_pages: number;
  page_number: number;
  page_size: number;
  total_results: number;
};

export type PriceType = { currency: BalanceCurrency; value: number };

type GeneralType = {
  collection_id: number;
  collection_name: string;
  id: string;
  name: string;
  item_name?: string;
  num_in_collection: number;
  total_nft_num: number;
};

type AuctionItem = {
  auction_id: number;
  bid_step: number;
  bids_count: number;
  buyer_id: number;
  collection_id: number;
  collection_name: string;
  finish_datetime: string;
  for_sale: boolean;
  ipowner_royalties: any;
  is_visible: boolean;
  item_id: number;
  top_bid: number;
  name: string;
  num_in_collection: number;
  royalty: number;
  sold_nft_num: number;
  sold_price: any;
  status: string;
  total_nft_num: number;
  top_bid_user_id: number;
  top_bid_username: string;
};

export type StoreItem = GeneralType &
  AuctionItem & {
    created_at: string;
    default_price: { currency: string; value: number };
    description: string;
    franchise: string;
    logo: string;
    logo_preview: string;
    nft: any;
    rarity: string;
    seller_id: number;
    seller_name: string;
    release_datetime?: string;
    nft_counter?: number;
    nft_index?: number;
    nft_token: number;
    already_have: number;
    ipowner: string;
    type: string;
    user_id: string;
    username: string;
  };

export type EntitiesCommunitySalesType = {
  buyer_id: number;
  created_at: string;
  currency: string;
  item_id: number;
  nft_id: number;
  seller_id: number;
  trade_id: number;
  value: number;
};

export type ItemDetail = GeneralType & {
  collection_id: number;
  collection_name: string;
  created_at: string;
  current_owner_id: number;
  default_price: { currency: string; value: number };
  description: string;
  expiration_date?: string;
  fk_item_id: number;
  fk_nft_id: string;
  franchise: string;
  ipowner: string;
  item_id: string;
  item_name: string;
  logo: string;
  logo_preview: string;
  nft_index?: number;
  nft_token?: number;
  num_in_collection: number;
  offer_id: number;
  rarity: string;
  seller_id: number;
  seller_name: string;
  status?: string;
  total_nft_num: number;
  type: string;
  duplicates?: {
    nft_index: number;
    nft_token: string;
  }[];
  createdTrade?: boolean;
  trade_history: any[];
};

export type Collection = {
  created_at: string;
  current_num: number;
  description: string;
  full_num: number;
  id: string;
  logo: string;
  name: string;
};

export type CollectionCounter = {
  current_num: number;
  current_num_unique: number;
  full_num: number;
};

export type CollectionById = PaginationType & {
  collection_counter: CollectionCounter;
  collection_name: string;
  collection_banner: {
    desktop: string;
    mobile: string;
  };
  collection_id: string;
  data: StoreItem[];
};

export type BoughtItem = GeneralType & {
  item_rarity: string;
  nft_index: number;
  nft_local_id: number;
  ipowner: string;
  logo: string;
  nft_token: number | null;
  owner_id: number;
  rarity: string;
};

export type StoreItems = PaginationType & {
  data: StoreItem[];
};

export type ItemCommunitySalesType = PaginationType & {
  entities: EntitiesCommunitySalesType[];
};

export type CollectionItems = PaginationType & {
  data: Collection[];
};

export type OnfidoStatises =
  | null
  | "restricted"
  | "pending"
  | "consoder"
  | "clear";

export type User = {
  birthday: any;
  email: string;
  fullName: null | string;
  id: string;
  phone: string;
  username: string;
  followers: number;
  following: number;
  selling: number;
  registered_at: string;
  status: null | string;
  logo: null | string;
  isAuth: boolean;
  circle_status: string;
  is_email_verified: boolean;
  is_totp_active: boolean;
  is_onfido_passed: boolean;
  is_phone_verified: boolean;
  onfido_status: OnfidoStatises;
  phone_last_digits: string;
};

export type Balance = {
  USDC: number;
  XNL: number;
  isFeatched: boolean;
  noWallet: boolean;
};

export type BalanceCurrency = "USDC" | "XNL";
export type FullCurrency = BalanceCurrency | "USD";

export type MyNft = {
  collection_id: number;
  collection_name: string;
  current_owner_id: number;
  description: string;
  duplicates: {
    nft_index: number;
    nft_token: string;
  }[];
  item_id: number;
  item_name: string;
  logo: string;
  nft_index: number;
  num_in_collection: number;
  rarity: string;
  total_nft_num: number;
  trade_history: any[];
};

export type ItemDetails = PaginationType & {
  data: StoreItem[];
};

export type SummaryItem = {
  full_set: number;
  items: number;
  unique: number;
};

export type Franchise = {
  id: string;
  name: string;
};

export type itemForBuy = {
  client_secret: string;
  duplicate: boolean;
  full_price: {
    fee: number;
    total: number;
  };
};

export type ButtonThemes =
  | "violet"
  | "transparent"
  | "red"
  | "link"
  | "simple"
  | "turquoise";

export type NFTDuplicateType = {
  nft_id: number;
  nft_index: number;
  nft_token: null | number;
};

export type BidType = {
  auction_id: number;
  bid_id: number;
  created_at: string;
  username: string;
  user_logo: string;
  user_id: string;
  value: number;
  currency: string;
};

export type TradeHistoryResponseType = PaginationType & {
  data: TradeHistoryType[];
};

export type TradeHistoryType = {
  buyer_id: number;
  buyer_username: string;
  created_at: string;
  currency: string;
  item_id: number;
  nft_id: number;
  nft_index: number;
  seller_id: number;
  seller_username: string;
  trade_id: number;
  value: number;
};

export type CollectionResponseType = PaginationType & {
  data: Collection[];
};

export type CollectionType = {
  banner: string;
  banner_main: string;
  banner_mobile: string;
  created_at: string;
  description: string;
  id: string;
  is_sold_out: boolean;
  logo: string;
  minted_items_num: number;
  name: string;
  num_of_auctions: number;
  release_datetime: string;
  store_id: number;
  store_name: string;
  tags: [];
  theme: string;
  facebook_link: string;
  twitter_link: string;
  website_link: string;
  youtube_link: string;
};

export type AllItemsCollectionByIDResponseType = PaginationType & {
  collection: CollectionByIDType;
  data: AllItemsCollectionByIDType[];
};

export type AllItemsCollectionByIDType = {
  default_price: { currency: string; value: number };
  description: string;
  id: string;
  ipowner: string;
  logo: string;
  logo_preview: string;
  name: string;
  nft: any;
  num_in_collection: number;
  rarity: string;
  release_datetime: string;
  seller_id: number;
  seller_name: string;
  is_sold_out: boolean;
  total_nft_num: number;
};

export type WalletHistoryType = {
  amount: number;
  created_at: string;
  destination_id: number;
  details: string;
  id: string;
  source_id: number;
  status: string;
  transaction_id: string;
  transaction_type: string;
  transaction_hash: string;
  text: string;
};

export type WalletHistoryResponseType = PaginationType & {
  data: WalletHistoryType[];
};

export type CollectionByIDType = {
  banner: {
    desktop: string;
    main: string;
    mobile: string;
  };
  id: string;
  name: string;
};

export type SelectOption = { label: string | number; value: string | number };

export type SelectOptions = SelectOption[];

export type GenericObject<T> = { [key: string]: T };

export type GenericPaginationType<T> = {
  data: T[];
  num_pages: number;
  page_number: number;
  page_size: number;
  total_results: number;
};

export type NotificatioType = {
  body: string;
  data: {
    price: PriceType;
    item_name?: string;
    balance: number;
    logo?: string;
  };
  delivered_at: string;
  favicon: string;
  id: string;
  is_read: boolean;
  title: string;
  type:
    | "bid_place"
    | "offer_purchase"
    | "top_up"
    | "withdrawal"
    | "bid_won"
    | "outbid"
    | "auction_ended";
};

export type MysteryBox = {
  bundle_id: null;
  bundle_price: number;
  bundle_quantity: null;
  collection_id: null;
  created_at: string;
  default_price: PriceType;
  description: string;
  id: string;
  is_visible: boolean;
  item_logo_previews: string[];
  items_count: number;
  logo: string;
  logo_preview: string;
  mystery_box_type: string;
  name: string;
  release_datetime: string;
  royalty: null;
  status: string;
  tags: [];
};

export type MysteryBoxItem = {
  brand_id: number;
  collection_id: number;
  collection_name: string;
  created_at: string;
  default_price: PriceType;
  description: string;
  drop_chance: number;
  featured: boolean;
  for_sale: boolean;
  franchise: string;
  id: string;
  ipowner: string;
  is_visible: true;
  logo: string;
  logo_preview: string;
  minting_rules: {};
  name: string;
  num_in_collection: number;
  purpose: string;
  rarity: string;
  release_datetime: string;
  royalty: number;
  sold_nft_num: number;
  store_id: number;
  tags: string[];
  total_nft_num: number;
  type: string;
  items_in_mystery_box: number;
};
