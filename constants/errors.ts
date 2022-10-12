export const errors = {
  SOMETHING_WENT_WRONG: "SOMETHING_WENT_WRONG",

  //TODO: ONFIDO
  NO_ONFIDO_ID: "You have to pass Onfido's checks",
  NO_LOCATION_ONFIDO:
    "Unfortunately, Chronicle does not provide service in your location",
  PENDING_ONFIDO: "Please wait for Onfido response",
  DECLINED_BY_ONFIDO:
    "Your documents were declined by Onfido. Try again and then contact the support team",

  //TODO: BIDS
  CONFIRM_BID: "confirm bid",
  WRONG_VALUE_BID: "Wrong value of a bid",

  //TODO OFFERS
  CONFIRM_OFFERS: "confirm offers",
  OFFER_NO_CONTENT: "There is no content",

  //TODO: WALLET
  PENDING_TOPUP: "PENDING_TOPUP",
  CONFIRM_TOPUP: "CONFIRM_TOPUP",
  PAYMENT_METHOD_DECLINED: "Your payment method was declined",
  LIMIT_OF_TOP_UPS: "You've reached the limit of top ups via credit card",
  CIRCLE_WALLET_RESTRICTED: "Your Circle wallet is temporarily restricted",
  WITHDRAW_ERROR: "WITHDRAW_ERROR",
  MAXIMUM_NUM_AVAILABLE_WITHDRAWALS:
    "Maximum num of available withdrawals is one per user per day",

  //PROFILE
  EMAIL_NOT_VERIFIED: "Email is not verified",
  EMAIL_HAS_BEEN_SENT: "The email has been already sent",
  PHONE_ALREADY_REGISTERED: "This phone is already registered",
  NO_TWO_FA: "NO_TWO_FA",
  NO_VERIFY_PHONE: "User has not verified the phone",
  NO_VERIFY_TOTP: "NO_VERIFY_TOTP",
  NO_VERIFY_KYC: "NO_VERIFY_KYC",
  START_TWO_FA: "START_TWO_FA",
  SMS_MANY_REQUSTS:
    "HTTP 429 error: Unable to create record: Too many requests",
  SPAM_SMS:
    "HTTP 429 error: Unable to create record: Max send attempts reached",
  SPAM_EMAIL: "Spam check failed",
  NO_VERIFY_PS: "NO_VERIFY_PS", // PS: PERSONAL SETINGS
  REMOVE_ACCOUNT: "REMOVE_ACCOUNT",

  //AUTH
  INVALID_ACTION_CODE: "auth/invalid-action-code",
  INVALID_PHONE_CODE: "The code you provided was denied",
  INVALID_PHONE_NUMBER: "The phone number is already registered",
  INVALID_TOTP_CODE: "Bad TOTP code",
  USER_NOT_FOUND: "User not found",

  //STORE
  COUPON_IS_NOT_VALID: "Coupon is not valid",
  WITHDRAW_NOT_NFT: "You are not the owner of this NFT",
};
