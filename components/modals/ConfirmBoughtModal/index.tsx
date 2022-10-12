/* eslint-disable react-hooks/exhaustive-deps */
import { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import React, { useState, useEffect } from "react";
import { CustomTabs, DetailRow, LogoCard, CustomInput } from "../..";
import { transformPrice } from "../../../helpers";
import { useRedux } from "../../../hooks";
import {
  postApplyCouponAsync,
  postBuyWithWalletAsync,
  selectBalance,
  selectBoughtError,
  selectCards,
  selectInfoMessage,
  storeActions,
} from "../../../redux";
import { CustomButton } from "../../CustomButton";
import { CreditCardIcon, CrossIcon, GiftIcon } from "../../Icons";
import { NewCard } from "./NewCard";
import { SavedCards } from "./SavedCards";
import { Wallet } from "./Wallet";
import s from "./ConfirmBoughtModal.module.scss";
import { errors, infoMessages } from "../../../constants";
import { BeatLoader } from "react-spinners";
import { BalanceCurrency } from "../../../types";

type ConfirmBoughtModalProps = {
  item: any; //TODO add type
  card?: any;
  type?: "MysteryBox" | "Item";
  handleNevermindClick: () => void;
  buyWithStripe: (e: any) => void;
  buyWithWallet: () => void;
  handleCard?: (e: any) => void;
  waitingPayment: boolean;
};

export const ConfirmBoughtModal: React.FC<ConfirmBoughtModalProps> = ({
  type = "Item",
  item,
  card,
  waitingPayment,
  buyWithStripe,
  handleNevermindClick,
  buyWithWallet,
  handleCard = () => {},
}) => {
  const tabs = [
    "wallet",
    ...(item?.default_price?.currency !== "XNL"
      ? ["pay with card", "my saved cards"]
      : []),
  ];

  const [select, dispatch] = useRedux();
  const [isConfirmCard, setIsConfirmCard] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [isDisabledBtn, setDisabledBtn] = useState(true);
  const [selectedTab, setSelectedTab] = useState(
    tabs[item.default_price.value === 0 ? 1 : 0]
  );

  const { setError } = storeActions;
  const infoMessage = select(selectInfoMessage);
  const cards: any = select(selectCards);
  const error = select(selectBoughtError);
  const balance = select(selectBalance);

  const currency =
    selectedTab === "wallet"
      ? (item.default_price.currency as BalanceCurrency)
      : "USD";

  const handleChangeTab = (tab: string) => setSelectedTab(tab);
  useEffect(() => {
    if (selectedTab === "pay with card") {
      setDisabledBtn(isConfirmCard);
    } else if (selectedTab === "my saved cards") {
      setDisabledBtn(Boolean(cards.length));
      setIsConfirmCard(false);
    } else if (selectedTab === "wallet") {
      setDisabledBtn(
        balance[item.default_price.currency as BalanceCurrency] >=
          (item?.default_price?.value || 0)
      );
      setIsConfirmCard(false);
    }
  }, [cards, isConfirmCard, selectedTab, balance, item?.default_price?.value]);

  const handleValueCard = (e: StripeCardElementChangeEvent) =>
    setIsConfirmCard(e.complete);

  const handleCoupon = () =>
    dispatch(postApplyCouponAsync(item?.id, item?.default_price, type, coupon));

  const handlePayNowClick = (e: any) => {
    if (selectedTab !== "wallet") buyWithStripe(e);
    else buyWithWallet();
  };

  useEffect(() => {
    return () => {
      if (error === errors?.COUPON_IS_NOT_VALID) {
        dispatch(setError(null));
      }
    };
  }, []);
  useEffect(() => {
    if (item.default_price.value === 0) {
      setSelectedTab(tabs[0]);
    }
  }, [item.default_price.value]);

  return (
    <div className={s.container}>
      <div className={s.header}>
        {type === "Item"
          ? "Your order"
          : `${
              item.mystery_box_type === "common" ? "Common" : "Unique"
            }  mystery box`}
      </div>
      <div className={s.content}>
        <div className={s.transaction}>
          <LogoCard item={item} className={s.img} hideBurn />

          <div className={s.detail}>
            <div className={s.item}>
              <DetailRow
                title={type === "Item" ? "Collectible" : "Mystery box"}
                value={
                  type === "Item"
                    ? `#${item.num_in_collection} - ${item.name}`
                    : item.name
                }
                type="text"
              />
            </div>
            {type === "MysteryBox" && (
              <div className={s.item}>
                <DetailRow
                  title="Items inside"
                  value={item.items_count}
                  type="text"
                />
              </div>
            )}
            <div className={s.item}>
              <DetailRow
                title="Price"
                value={transformPrice(item?.default_price?.value)}
                type="price"
                valueCurrency={currency}
              />
            </div>
            <div className={s.item}>
              <DetailRow
                title="Service charge"
                value={transformPrice(
                  selectedTab === "wallet" ? 0 : item?.full_price?.fee
                )}
                type="price"
                loading={infoMessage.some(
                  (info) => info === infoMessages.LOADING_STRIPE_SECRET
                )}
                valueCurrency={currency}
              />
            </div>
            <div className={s.row}>
              <div className={s.total}>Total</div>
              <div className={s.totalValue}>
                {infoMessage.some(
                  (info) => info === infoMessages.LOADING_STRIPE_SECRET
                ) ? (
                  <BeatLoader color={"#fff"} size={6} />
                ) : (
                  <>
                    <span className={currency}>{currency}</span>{" "}
                    {transformPrice(
                      selectedTab === "wallet"
                        ? item?.default_price?.value
                        : item?.full_price?.total
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={s.tabs}>
          <CustomTabs
            tabs={tabs}
            selectTab={selectedTab}
            onChange={(e: string) => handleChangeTab(e)}
            disableTabs={[
              ...(item.default_price.value === 0
                ? ["pay with card", "my saved cards"]
                : []),
            ]}
            name="confirmBought"
          />
        </div>

        {selectedTab === "wallet" && (
          <Wallet itemCurrency={item?.default_price?.currency} />
        )}

        {selectedTab === "pay with card" && (
          <NewCard
            handleChangeCardField={handleValueCard}
            item={item}
            type={type}
          />
        )}
        {selectedTab === "my saved cards" && (
          <SavedCards
            handleCard={handleCard}
            card={card}
            item={item}
            type={type}
          />
        )}

        {!(selectedTab === "my saved cards" && !card) &&
          !(selectedTab === "wallet" && balance?.noWallet) && (
            <div className={s.couponWrap}>
              <CustomInput
                name="coupon"
                placeholder="Coupon"
                value={coupon}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCoupon(e?.target?.value)
                }
                errorMessage={
                  error === errors?.COUPON_IS_NOT_VALID ? error : ""
                }
              />
              <CustomButton
                value="apply"
                onClick={handleCoupon}
                loading={infoMessage.some(
                  (info) => info === infoMessages.LOADING_APPLY_COUPON
                )}
              />
            </div>
          )}
      </div>
      <div className={s.buttonsConfirm}>
        <CustomButton
          theme="transparent"
          icon={<CrossIcon />}
          value="nevermind"
          onClick={handleNevermindClick}
          disabled={waitingPayment}
        />
        <CustomButton
          theme={item?.default_price?.value ? "violet" : "turquoise"}
          icon={
            item?.default_price?.value ? (
              <CreditCardIcon />
            ) : (
              <GiftIcon fill="#0f1010" />
            )
          }
          disabled={!isDisabledBtn}
          value={item?.default_price?.value ? "Pay now" : "get"}
          onClick={handlePayNowClick}
          loading={waitingPayment}
        />
      </div>
    </div>
  );
};
