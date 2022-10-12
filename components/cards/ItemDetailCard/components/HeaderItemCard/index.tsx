import cn from "classnames";
import { useRouter } from "next/router";
import React, { FC, useEffect, useMemo, useState } from "react";
import { CustomButton, PriceInput } from "../../../..";
import { Routes, errors } from "../../../../../constants";
import { transformPrice } from "../../../../../helpers";
import { useRedux } from "../../../../../hooks";
import {
  postAuctionClaimAsync,
  selectBalance,
  selectLoading,
  selectProfileData,
  selectUserData,
  storeActions,
  tradeActions,
} from "../../../../../redux";
import { BalanceCurrency, ButtonThemes } from "../../../../../types";
import {
  AlertIcon,
  ArrowRightIcon,
  CreditCardIcon,
  CrossCircleIcon,
  CrossIcon,
  EditIcon,
  GiftIcon,
  TagIcon,
  UploadIcon,
} from "../../../../Icons";
import { DELETE_LISTING } from "../../../../modals/ItemBoughtErrorModal/data";
import s from "./HeaderItemCard.module.scss";

type HeaderItemCardProps = {
  item: any;
  name: string;
  type: "item" | "nft" | "trade" | "auction";
  userId: string;
  endedAuction: boolean;
  free: boolean;
  handleOnBuyClick?: (item: any, price?: number) => void;
  setOpenModalEditTrade: (e: boolean) => void;
  setOpenModalTrade: (e: boolean) => void;
  setPrice?: (e: number) => void;
  handleWithdraw?: () => void;
};

export const HeaderItemCard: FC<HeaderItemCardProps> = ({
  item,
  name,
  type,
  userId,
  endedAuction,
  free,
  handleOnBuyClick,
  setOpenModalEditTrade,
  setOpenModalTrade,
  handleWithdraw,
  setPrice = () => {},
}) => {
  const [select, dispatch] = useRedux();
  const { push } = useRouter();

  const [bid, setBid] = useState<number>(
    item?.top_bid ? item?.top_bid + item?.bid_step : item?.default_price?.value
  );

  const { setError } = tradeActions;
  const { setError: setErrorStore } = storeActions;

  const balance = select(selectBalance);
  const loading = select(selectLoading);

  const isAuction = type === "auction";
  const isMyItem = item?.top_bid_user_id === userId;
  const mySellerCard = item?.seller_id === userId;
  const balanceAmount =
    balance[item?.default_price?.currency as BalanceCurrency];
  const isBalance = balance.isFeatched;
  const isIOwner = item?.current_owner_id === userId;

  const auctionInfoList = [
    `Your bid will be deducted from your ${item?.default_price?.currency} balance so long as you are the top bidder`,
    "If your bid is overtaken your funds are immediately returned to your account",
  ];

  const handleBid = (e: any) => {
    setBid(+e.target.value.replaceAll(" ", ""));
  };

  const handleAuctionClaim = (id: string) => {
    dispatch(postAuctionClaimAsync(id));
  };

  useEffect(() => {
    setPrice(bid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bid]);

  const disableBtn = () => {
    //Сheck whether there is enough on the balance

    if (
      userId &&
      balanceAmount < bid &&
      !endedAuction &&
      (isAuction || item?.current_owner_id)
    )
      return true;

    //Check that the bid is not less than the top bid
    if (item?.top_bid && bid < item?.top_bid + item?.bid_step) return true;

    if (!item?.top_bid && bid < item?.default_price?.value) return true;

    return false;
  };

  const handleClick = (item: any) => {
    if (!handleOnBuyClick && item?.current_owner_id === userId && !isAuction)
      return setOpenModalTrade(true);

    if (
      (!handleOnBuyClick && item?.current_owner_id !== userId) ||
      !userId ||
      item.purpose === "mystery_box"
    )
      return push(`${Routes.STORE}`);

    if (isAuction && handleOnBuyClick && !endedAuction) {
      return dispatch(setErrorStore(errors.CONFIRM_BID));
    }

    if (item?.is_redeem_only) return push(Routes?.REDEEM_CODE);

    if (isAuction && endedAuction && isMyItem)
      return handleAuctionClaim(item.id);

    if (item.purpose === "not_set") return undefined;

    if (handleOnBuyClick && !item?.is_sold_out) return handleOnBuyClick(item);
  };

  const [icon, value, theme] = useMemo<
    [JSX.Element | null, string, ButtonThemes]
  >(() => {
    if (!handleOnBuyClick && item?.current_owner_id === userId)
      return [<TagIcon key="1" />, "Market", "violet"];

    if ((!handleOnBuyClick && item?.current_owner_id !== userId) || !userId)
      return [<TagIcon key="2" />, "Back to store", "violet"];

    if (item?.is_redeem_only) return [null, "Redeem", "violet"];

    if (isAuction && !endedAuction)
      return [<CreditCardIcon key="3" />, "Bid", "violet"];

    if (endedAuction && isMyItem && isAuction)
      return [null, "Obtain", "violet"];

    if (item.is_sold_out || free) {
      return free
        ? [<GiftIcon fill="#0f1010" key="4" />, "GET", "turquoise"]
        : [null, "sold out", "red"];
    }

    if (item.purpose === "mystery_box")
      return [<CreditCardIcon key="5" />, "mystery box", "violet"];

    if (item.purpose === "not_set")
      return [<CrossIcon key="6" />, "Not available", "transparent"];

    return [<CreditCardIcon key="7" />, "buy", "violet"];
  }, [
    handleOnBuyClick,
    item?.current_owner_id,
    item.is_sold_out,
    item.purpose,
    item?.is_redeem_only,
    userId,
    isAuction,
    endedAuction,
    isMyItem,
    free,
  ]);

  useEffect(() => {
    setBid(
      item?.top_bid
        ? item?.top_bid + item?.bid_step
        : item?.default_price?.value
    );
  }, [item?.bid_step, setBid, item?.top_bid, item?.default_price?.value]);

  const errorMesage = isAuction
    ? "You need to top up your wallet to place this bid amount"
    : `You need to top up your wallet to buy this ${
        type === "trade" ? "nft" : "item"
      }`;

  return (
    <div className={s.boughtDesc}>
      <div>
        {mySellerCard && !isAuction && (
          <div className={s.topPrice}>
            <TagIcon size={12} className={s.topPriceIcon} />
            {(item?.default_price?.currency || item?.default_price?.value) && (
              <div className={s.price}>
                <span className={s.triceTitle}>Price for sale:</span>{" "}
                <span className={item?.default_price?.currency}>
                  {item?.default_price?.currency}{" "}
                </span>
                <span>{transformPrice(item?.default_price?.value)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={s.header}>
        <div className={s.name}>{name}</div>
        {!isAuction && handleOnBuyClick && !mySellerCard && (
          <div className={s.price}>
            {item?.default_price?.value === 0 ? (
              <span>FREE</span>
            ) : (
              <>
                <span className={item?.default_price?.currency}>
                  {item?.default_price?.currency}
                </span>{" "}
                <span>{transformPrice(item?.default_price?.value)}</span>
              </>
            )}
          </div>
        )}
        {isAuction && (
          <div className={s.priceAuction}>
            <p className={cn([s.title], { [s.noTopBid]: !item?.top_bid })}>
              {item?.top_bid
                ? "Top Bid"
                : "No bids yet, yours will be the first one!"}
            </p>
            {item?.top_bid && (
              <div className={s.fullPrice}>
                <span
                  className={cn([s.currency, item?.default_price?.currency])}
                >
                  {item?.default_price?.currency}
                </span>{" "}
                {transformPrice(item?.top_bid)}
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        {isAuction && userId && !endedAuction && (
          <div className={s.itemInput}>
            <PriceInput
              startTest={item?.default_price?.currency}
              placeholder="0.00"
              title="your bid"
              name="your bid"
              message={`min ${item?.default_price?.currency} ${transformPrice(
                item?.top_bid
                  ? item?.top_bid + item?.bid_step
                  : item?.default_price?.value
              )}`}
              value={bid}
              onChange={handleBid}
              maskOptions={{
                prefix: "",
              }}
              {...(isBalance && {
                errorMessage: balanceAmount < bid ? errorMesage : "",
              })}
            />
          </div>
        )}
      </div>
      <div
        className={cn([s.btns], {
          [s.isThreeBtn]: (!handleOnBuyClick || mySellerCard) && mySellerCard,
        })}
      >
        {((!handleOnBuyClick && item?.current_owner_id === userId) ||
          mySellerCard) &&
          !isAuction && (
            <CustomButton
              theme="transparent"
              value="view listings "
              onClick={() =>
                push({
                  pathname: `/profile/${userId}/collection`,
                  query: { tab: "listings" },
                })
              }
              icon={<ArrowRightIcon />}
            />
          )}

        {/* {handleWithdraw &&
          item?.is_withdrawable &&
          !mySellerCard &&
          isIOwner && (
            <CustomButton
              theme="transparent"
              value="withdraw"
              onClick={handleWithdraw}
              icon={<UploadIcon />}
            />
          )} */}

        {mySellerCard && !isAuction ? (
          <>
            <CustomButton
              theme="transparent"
              value="Change listing"
              onClick={() => setOpenModalEditTrade(true)}
              icon={<EditIcon />}
            />
            <CustomButton
              theme="red"
              value="stop listing"
              onClick={() => dispatch(setError(DELETE_LISTING))}
              icon={<CrossCircleIcon />}
            />
          </>
        ) : item.is_sold_out || (endedAuction && !isMyItem && isAuction) ? (
          <div className={s.soldOutBtn}>
            {endedAuction ? "finished" : "sold out"}
          </div>
        ) : (
          <>
            <CustomButton
              theme={theme}
              value={value}
              icon={icon}
              onClick={() => {
                handleClick(item);
              }}
              disabled={disableBtn()}
              loading={loading}
            />
          </>
        )}
      </div>

      <div>
        {isAuction && (
          <div className={s.auctionInfoList}>
            {auctionInfoList.map((info, i) => (
              <p className={s.auctionInfo} key={i}>
                {info}
              </p>
            ))}
          </div>
        )}
      </div>
      {type === "trade" &&
        !mySellerCard &&
        isBalance &&
        userId &&
        balanceAmount < item?.default_price?.value && (
          <div className={s.tipError}>
            <AlertIcon className={s.icon} /> {errorMesage}
          </div>
        )}
    </div>
  );
};
