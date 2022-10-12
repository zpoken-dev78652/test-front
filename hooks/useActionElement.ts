/* eslint-disable react-hooks/exhaustive-deps */
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useRedux } from ".";
import {
  EMAIL_NOT_VERIFIED,
  PAYMENT_ERROR,
} from "../components/modals/ItemBoughtErrorModal/data";
import { errors, infoMessages } from "../constants";
import {
  getNftWebhookAsync,
  globalActions,
  postPreBuyAsync,
  postAuctionBidAsync,
  postStripeSecretAsync,
  selectBoughtError,
  storeActions,
  selectItemForBuy,
  selectInfoMessage,
  selectUserData,
  postBuyWithWalletAsync,
  selectProfileError,
} from "../redux";

type ActionElementProps = {
  type: "Item" | "MysteryBox" | "Offer" | "Auction";
};

type ModalsKey = "duplicate" | "info" | "buy" | "error";

const modals = {
  duplicate: false,
  info: false,
  buy: false,
  error: false,
};

export const useActionElement = ({ type }: ActionElementProps) => {
  const [select, dispatch] = useRedux();
  const stripe: any = useStripe();
  const elements: any = useElements();

  const [modalsState, setModalsState] = useState(modals);
  const [card, setCard] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [waitingPayment, setWaitingPayment] = useState(false);
  const [selectItemIdForLocal, setSelectItemIdForLocal] = useState("");

  const itemForBuy = select(selectItemForBuy);
  const user = select(selectUserData);
  const storeError = select(selectBoughtError);
  const profileError = select(selectProfileError);
  const storeInfoMessage = select(selectInfoMessage);
  const formData = select((state) => state.form.saveCard);

  const { setSelectItemForBuy, setError, removeInfoMessage, setLoading } =
    storeActions;

  const handleSelectItem = (item: any) => {
    if (user.id && !user.is_email_verified)
      return dispatch(setError(EMAIL_NOT_VERIFIED));

    if (!user.id) return dispatch(setError("Unauthorized"));

    dispatch(setSelectItemForBuy({ ...item, type_card: type }));
    handleOpenModalByKey("info");
  };

  const handleAllCancel = () => {
    setModalsState(modals);
    dispatch(setSelectItemForBuy(null));
    setSelectItemIdForLocal("");
    dispatch(globalActions.removeFetchingGlobal());
  };

  const handleOpenModalByKey = (key: ModalsKey) => {
    setModalsState({ ...modals, [key]: true });
  };

  const handleBuyClick = (item: any, price?: number) => {
    if (type === "Auction" && !storeError) {
      return dispatch(setError(errors.CONFIRM_BID));
    }

    if (
      type === "Auction" &&
      (storeError === errors.CONFIRM_BID ||
        storeError === errors.WRONG_VALUE_BID)
    ) {
      dispatch(
        postAuctionBidAsync(item.id, {
          value: Number(price),
          currency: item?.default_price?.currency,
        })
      );
      return;
    }

    if (type === "Item" || type === "MysteryBox" || type === "Offer") {
      setSelectItemIdForLocal(item?.id);

      dispatch(
        postPreBuyAsync({
          item,
          default_price: { ...item.default_price },
          type,
        })
      );
    }
  };

  const handleRetry = (ev: any) => {
    buyWithStripe(ev);
    dispatch(setError(null));
  };

  const handleClosePayError = () => {
    dispatch(setError(null));
    handleAllCancel();
  };

  const handleCloseWarningModal = () => {
    dispatch(setError(null));
    dispatch(setLoading(null));
    dispatch(removeInfoMessage("full"));
    handleAllCancel();
  };

  const onBuyAnywayClick = () => {
    dispatch(setSelectItemForBuy({ ...itemForBuy, duplicate: false }));
    handleOpenModalByKey("buy");
  };

  const payStripe = async () => {
    const pi = [
      itemForBuy?.client_secret?.split("_")[0],
      itemForBuy?.client_secret.split("_")[1],
    ].join("_");

    let payload: any;
    try {
      payload = await stripe.confirmCardPayment(itemForBuy.client_secret, {
        payment_method: card
          ? card.value
          : { card: elements.getElement(CardElement) },
        ...(!card &&
          formData?.values &&
          formData?.values["Save for future payments"] && {
            setup_future_usage: "off_session",
          }),
      });
    } catch (error) {}

    if (payload?.error?.code === "card_declined") {
      setWaitingPayment(false);
      dispatch(setError(PAYMENT_ERROR));
      return;
    }

    dispatch(globalActions.setFetchingGlobal());

    if (payload?.paymentIntent?.status === "succeeded") {
      setPayment(pi);
    }
  };

  const buyWithStripe = async (ev: any) => {
    ev.preventDefault();

    if (!itemForBuy) {
      return;
    }

    setWaitingPayment(true);

    if (card && (type === "Item" || type === "MysteryBox")) {
      dispatch(
        postStripeSecretAsync({
          id: itemForBuy.id,
          default_price: {
            value: itemForBuy.default_price.value,
            currency: "USDC",
          },
          type,
          payment_method: card?.value,
        })
      );
      return;
    }

    payStripe();
  };

  const buyWithWallet = () => {
    dispatch(
      postBuyWithWalletAsync(
        itemForBuy.id,
        itemForBuy.default_price,
        type,
        itemForBuy?.coupon
      )
    );
  };

  useEffect(() => {
    if (!payment) return;

    const interval: any = setInterval(() => {
      dispatch(getNftWebhookAsync(payment));
    }, 3000);

    return () => clearInterval(interval);
  }, [payment]);

  useEffect(() => {
    if (
      storeInfoMessage.some(
        (info) => info === infoMessages.CREATE_STRIPE_SECRET_WITH_PM
      )
    ) {
      payStripe();
      dispatch(removeInfoMessage(infoMessages.CREATE_STRIPE_SECRET_WITH_PM));
    }
  }, [storeInfoMessage]);

  useEffect(() => {
    if (typeof itemForBuy?.duplicate !== "boolean") return;

    if (typeof itemForBuy?.duplicate === "boolean" && itemForBuy?.duplicate) {
      handleOpenModalByKey("duplicate");
      return;
    }

    if (
      itemForBuy?.id === selectItemIdForLocal &&
      !itemForBuy?.duplicate &&
      Object.values(modals).every((el) => !el)
    ) {
      handleOpenModalByKey("buy");
    }
  }, [itemForBuy?.duplicate]);

  useEffect(() => {
    if (
      (storeError === PAYMENT_ERROR ||
        storeError === "Your card was declined.") &&
      itemForBuy?.id === selectItemIdForLocal
    ) {
      setModalsState((prevState) => ({ ...prevState, error: true }));
      dispatch(globalActions.removeFetchingGlobal());
      return;
    }

    if (storeError === errors.NO_VERIFY_PHONE) {
      handleAllCancel();
    }
  }, [storeError]);

  return {
    itemForBuy,
    card,
    modalsState,
    waitingPayment,
    setCard,
    handleRetry,
    handleClosePayError,
    handleBuyClick,
    onBuyAnywayClick,
    buyWithStripe,
    handleSelectItem,
    handleAllCancel,
    buyWithWallet,
    handleCloseWarningModal,
  };
};
