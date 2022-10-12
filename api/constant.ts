export const URLS = {
  isUserNameUnique: "users/signup/username_uniqueness",
  storeItems: "items",
  myProfileData: "/users/me",
  userWallet: "store/wallet/balance",
  userUphold: "/users/me/linkUphold",
  userCards: "store/payment_methods",
  userProfileData: "/users",
  myItems: "/users/<id>/items",
  summaryItem: "/users/<id>/items_count_summary",
  franchises: "/users/<id>/stores",
  types: "/users/<id>/types",
  nftById: "/nft/<id>",
  nftWebhookById: "/nft/webhook/<id>",
  itemById: "/items/<id>",
  itemByIdMyNfts: "/items/<id>/my_nfts",
  userCollection: "/users/<id>/collections",
  collectionById: "/users/<userId>/collections/<collectionId>",
  itemsHistory: "items/<id>/trade_history",
  nftHistory: "nft/<id>/trade_history",
  carousels: "carousels",
  itemsTradeHistory: "items/<id>/trade_history",
  nftTradeHistory: "nft/<id>/trade_history",
  collections: "collections",
  collectionsById: "collections/<id>",
  notificationsUpdate: "notifications/fetch_updates",
  notifications: "notifications",
  loginBanner: "login_banners",
  withdrawNft: "store/wallet/nft_withdraw",
  nftWithdrawalHistory: "nft/withdrawal_history",

  //PROFILE
  deleteAccount: "users/me/terminate_account",

  //STORE
  preBuy: "store/pre_buy",
  stripeSecret: "store/stripe_secret",
  applyCoupon: "store/apply_coupon",
  applyRedeemCoupon: "/store/redeem_code",
  buyWithWallet: "store/buy_with_wallet",

  //AUTH
  auth: "auth",
  logout: "logout",
  refreshTokens: "auth/refresh_tokens",
  authTwoFa: "auth/two_fa",
  verifyEmail: "users/me/security/verify_email",
  verifyPhoneNumber: "users/me/security/verify_phone_number",
  setupTwoFa: "users/me/security/setup_totp",
  resetPassword: "users/me/security/reset_password",
  resetTotp: "users/me/security/reset_totp",
  unsubscribe: "users/me/emails_unsubscribe",

  //CIRCLE
  circleKey: "store/circle/key",
  circleTransactionStatus: "store/circle/transaction_status",

  // WALLET
  walletHistory: "/store/wallet/history",
  withdrawableBalance: "/store/wallet/available_withdraw_amount",
  blockchainMethods: "/store/wallet/topup_blockchain_methods",
  withdrawFee: "store/wallet/withdraw_fee",
  topUpWithCircle: "store/wallet/top_up",
  withdrawWithCircle: "store/wallet/wire_withdraw",
  withdraw: "store/wallet/withdraw",

  //ONFIDO
  onfidoSdkKey: "onfido",
  onfidoCheck: "onfido/check",
  onfidoToken: "onfido/token",
  onfidoStatus: "users/me/onfido_status",

  //TRADES
  offers: "offers",
  offersById: "offers/<id>",
  offersListings: "users/<id>/offers",

  //AUCTION
  auction: "auctions",
  auctionCreateBid: "store/auctions/<id>/make_bid",
  auctionGetBids: "auctions/<id>/bids",
  auctionsClaim: "store/auctions/<id>/claim",
  usersAuctions: "users/<id>/auctions",

  //Mystery Boxes
  mysteryBoxes: "mystery_boxes",
};
