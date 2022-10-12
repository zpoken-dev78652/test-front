import React, { useEffect, useMemo } from "react";
import { SelectCard } from "../SelectCard";
import { useRedux } from "../../../../hooks";
import {
  getUserCardsAsync,
  postStripeSecretAsync,
  selectitemForBuy,
  selectCards,
  selectProfileInfoMessage,
} from "../../../../redux";
import s from "./SavedCards.module.scss";
import { CardsVioletIcon } from "../../../Icons";
import { infoMessages } from "../../../../constants";
import { ClipLoader } from "react-spinners";

interface ISavedCards {
  card: any;
  item: any;
  type: string;
  handleCard: (e: any) => void;
}

export const SavedCards = ({ handleCard, card, item, type }: ISavedCards) => {
  const [select, dispatch] = useRedux();

  const cards = select(selectCards);
  const infoMessage = select(selectProfileInfoMessage);

  useEffect(() => {
    dispatch(getUserCardsAsync());

    if (item?.client_secret) return;
    dispatch(
      postStripeSecretAsync({
        id: item?.id,
        default_price: {
          value: item.default_price.value,
          currency: "USDC",
        },
        type,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(
    () =>
      cards.map((el: any) => ({
        value: el.id,
        label: `**** ${el.card.last4}`,
        icon: el.card.brand,
      })),
    [cards]
  );

  useEffect(() => {
    if (!card) {
      handleCard(data[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    return () => {
      handleCard(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return infoMessage.some((info) => info === infoMessages.LOADING_CARDS) ? (
    <div className={s.spiner}>
      {" "}
      <ClipLoader color={"#fff"} size={60} />
    </div>
  ) : cards?.length ? (
    <SelectCard
      value={card}
      onChange={handleCard}
      options={data}
      label={card}
    />
  ) : (
    <div className={s.noCardsWrap}>
      <CardsVioletIcon size={100} className={s.noCardsIcon} />
      <h4 className={s.noCardsTitle}>No cards saved yet</h4>
      <p className={s.noCardsDesc}>
        Please go back to “Pay with card tab” and check “Save for future
        payments” as you pay to have the card saved here.
      </p>
    </div>
  );
};
