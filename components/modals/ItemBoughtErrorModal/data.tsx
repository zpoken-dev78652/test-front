import React, { useMemo } from "react";
import { errors } from "../../../constants";
import {
  IconBadSmile,
  IconBigLock,
  IconBigLockRed,
  IconBigPay,
  IconBigPhoneRed,
  IconCardRed,
  IconCards,
  IconDuplicate,
  IconEmail,
  IconError,
  IconImage,
  IconPrice,
  IconRefreshWhite,
  IconServer,
} from "../../../public/icons";
import { ButtonThemes } from "../../../types";
import { ArrowLeftIcon, ArrowRightIcon, TrashIcon } from "../../Icons";

interface IData {
  icon: JSX.Element;
  title: string;
  desc: string | React.ReactNode;
  button: string;
  secondButton?: string;
  iconBtn?: JSX.Element;
  buttonIcon?: JSX.Element;
  buttonTheme?: ButtonThemes;
  listWithTitle?: { title: string; value: string }[];
  list?: string[];
  titleList?: string;
}

export const VERIFY_REGISTER = "VERIFY_REGISTER";
export const EMAIL_NOT_VERIFIED = "Email is not verified";
export const VERIFY_200 = "VERIFY_200";
export const VERIFY_TOO_MANY_REQUESTS = "VERIFY_TOO_MANY_REQUESTS";
export const FREE_NFT_DUPLICATE = "Free NFT duplicate";
export const NO_AVALIBLE_NFTS = "No available nfts to buy";
export const ITEM_DUPLICATE = "Item Duplicate";
export const PAYMENT_ERROR = "Payment error";
export const DELETE_LISTING = "Delete listing";
export const DISCARD_CHANGES = "Discard changes";
export const CAN_NOT_BUY_NFT = "You can not buy your nft";
export const SOMETHING_WENT_WRONG = "Something went wrong";
export const USER_BAN = "USER_BAN";
export const TOP_BIDDER = "You are not available to make two bids in a row";

export const modal = (error: string | null | undefined) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useMemo((): IData => {
    switch (error) {
      case "Proce changed":
        return {
          icon: <IconPrice />,
          title: "Whoah! The price have changed...",
          desc: "As long as we can see displayed price is wrong. Please reload the page to see actual prices.",
          button: "Okay, will do",
        };
      case NO_AVALIBLE_NFTS:
        return {
          icon: <IconImage />,
          title: "Oops... No items left",
          desc: "You've been off for a while and since then all copies of the item have been sold... Sorry, but please take a look at other items.",
          button: "Okay, got it",
        };
      case EMAIL_NOT_VERIFIED:
        return {
          icon: <IconEmail />,
          title: "Email not verified",
          desc: "To acquire full access to Chronicle’s features please click the “Verify” button in My Collection and follow the email instructions.",
          button: "Okay, got it",
        };
      case VERIFY_200:
        return {
          icon: <IconEmail />,
          title: "New email has been sent",
          desc: "We have just sent a new confirmation email. Сheck it in email and follow the instructions.",
          button: "Okay, got it",
        };
      case VERIFY_TOO_MANY_REQUESTS:
        return {
          icon: <IconEmail />,
          title: "Email has already been sent",
          desc: "We have already sent a confirmation email to your email address. Check it and follow the instructions.(If not check your spam folder)",
          button: "Okay, got it",
        };
      case USER_BAN:
        return {
          icon: <IconEmail />,
          title: "You have been banned from Chronicle",
          desc: (
            <>
              You cannot sell or buy items anymore but you can contact with us
              by email:{" "}
              <a href="mailto: help@chronicle.com">help@chronicle.com</a>
            </>
          ),

          button: "oh... Okay",
          buttonTheme: "red",
          buttonIcon: <IconBadSmile />,
        };
      case VERIFY_REGISTER:
        return {
          icon: <IconEmail />,
          title: "Verify you email address.",
          desc: "Please click on the link that has just been sent to your email account to verify your email and finalize your registration process.",
          button: "Okay, got it",
        };
      case "server_error":
        return {
          icon: <IconServer />,
          title: "Server error...",
          desc: "Sorry, something went wrong on our side... Please retry the action later.",
          button: "Oh... Okay",
        };
      case errors.SOMETHING_WENT_WRONG:
        return {
          icon: <IconServer />,
          title: "Something went wrong",
          desc: "Sorry, something went wrong on our side... Please retry the action later.",
          button: "Oh... Okay",
        };
      case FREE_NFT_DUPLICATE:
        return {
          icon: <IconDuplicate />,
          title: "Hey, wait a minute!",
          desc: "You have already received this NFT.",
          button: "Oh... Okay",
        };
      case ITEM_DUPLICATE:
        return {
          icon: <IconDuplicate />,
          title: "Item duplicate",
          desc: "You already have one or more copies of this item. Do you want to buy it anyway?",
          button: "Buy anyway",
          secondButton: "Cancel purchase",
          iconBtn: <ArrowRightIcon />,
        };
      case PAYMENT_ERROR:
      case errors.WRONG_VALUE_BID:
        return {
          icon: <IconCardRed />,
          title: "Payment error",
          desc: "Please check your data input or contact your bank's representative",
          button: "retry",
          secondButton: "nevermind",
          iconBtn: <IconRefreshWhite />,
        };
      case DELETE_LISTING:
        return {
          icon: <IconImage />,
          title: "Delete listing?",
          desc: "Are you sure you want to delete this listing?",
          button: "delete it",
          secondButton: "nevermind",
          iconBtn: <TrashIcon />,
        };
      case DISCARD_CHANGES:
        return {
          icon: <IconError />,
          title: "Discard changes?",
          desc: "You have unsaved changes, do you really want to exit without saving?",
          button: "no, take me back",
          secondButton: "yes, discard",
          iconBtn: <ArrowLeftIcon />,
        };
      case errors.REMOVE_ACCOUNT:
        return {
          icon: <IconError />,
          title: "Delete account",
          desc: "Are you sure you want to delete your account? You will no longer be able to return your NFTs.",
          button: "delete",
          secondButton: "nevermind",
          iconBtn: <TrashIcon />,
        };
      case TOP_BIDDER:
        return {
          icon: <IconError />,
          title: "You are top bidder",
          desc: "You are not available to make two bids in a row",
          button: "Oh... Okay",
        };
      case CAN_NOT_BUY_NFT:
        return {
          icon: <IconError />,
          title: "Something went wrong",
          desc: CAN_NOT_BUY_NFT,
          button: "Close",
          iconBtn: <ArrowLeftIcon />,
        };
      case SOMETHING_WENT_WRONG:
        return {
          icon: <IconError />,
          title: "Something went wrong",
          desc: "Please try again later",
          button: "Close",
          iconBtn: <ArrowLeftIcon />,
        };

      case errors.CONFIRM_BID:
        return {
          icon: <IconBigPay />,
          title: "Are you sure you want to place a bid?",
          desc: "You have unsaved changes, do you really want to exit without saving?",
          button: "Bid",
          secondButton: "nevermind",
          iconBtn: <ArrowRightIcon />,
        };
      case errors.CONFIRM_OFFERS:
        return {
          icon: <IconBigPay />,
          title: "Are you sure you want to make a purchase?",
          desc: "You have unsaved changes, do you really want to exit without saving?",
          button: "Buy",
          secondButton: "nevermind",
          iconBtn: <ArrowRightIcon />,
        };
      case errors.NO_VERIFY_PHONE:
        return {
          icon: <IconBigPhoneRed />,
          title: "Verify your number",
          desc: "To get free NFT, verify your phone number with the code from message",
          button: "SET UP",
          secondButton: "SET UP LATER",
          iconBtn: <ArrowRightIcon />,
        };
      case errors.NO_VERIFY_TOTP:
        return {
          icon: <IconBigLockRed />,
          title: "Pass 2FA",
          desc: "To withdraw funds, you must set up 2-F authentication for your account",
          button: "VERIFY",
          secondButton: "VERIFY LATER",
          iconBtn: <ArrowRightIcon />,
        };
      case errors.NO_ONFIDO_ID:
        return {
          icon: <IconBigLockRed />,
          title: "Pass KYC",
          desc: "Sorry, you need to pass KYC to use following part of Chronicle",
          button: "SET UP",
          secondButton: "SET UP LATER",
          iconBtn: <ArrowRightIcon />,
        };
      case errors.CONFIRM_TOPUP:
        return {
          icon: <IconBigPay />,
          title: "Are you sure you want to make a top-up?",
          desc: "",
          button: "top up",
          secondButton: "nevermind",
          iconBtn: <ArrowRightIcon />,
        };
      case errors.WITHDRAW_ERROR:
        return {
          icon: <IconError />,
          title: "Something went wrong",
          desc: "",
          button: "Close",
          iconBtn: <ArrowLeftIcon />,
        };
      case errors.PENDING_TOPUP:
        return {
          icon: <IconBigPay />,
          title: "It may take some time to process your transaction",
          desc: "The amount you want to deposit to your account appears to be pretty big and it may take us up to 4 work days to process the transaction.",
          button: "Okay",
        };
      case errors.NO_LOCATION_ONFIDO:
        return {
          icon: <IconImage />,
          title: "Oops...",
          desc: "Unfortunately, Chronicle does not provide service in your location",
          button: "Okay",
        };
      case errors.PAYMENT_METHOD_DECLINED:
        return {
          icon: <IconPrice />,
          title: "Payment error",
          desc: "Your payment method was declined. Please check if your country is on the list of countries we provide services to.",
          button: "Okay",
        };
      case errors.LIMIT_OF_TOP_UPS:
        return {
          icon: <IconPrice />,
          title: "Please top USDC via crypto or try again later.",
          desc: "You have exceeded the maximum limit you can top up per [day/week/month] using a credit card",
          titleList: "Limits on credit cards apply:",
          list: [
            "USDC $3,000 per day",
            "USDC $5,000 per week",
            "USDC $20,000 per month",
          ],
          button: "Okay",
        };
      default:
        return {
          icon: <IconImage />,
          title: "Something went wrong",
          desc: "Something went wrong, please try again later",
          button: "oh... Okay",
        };
    }
  }, [error]);
