import React, { useEffect, useState } from "react";
import { BalanceCurrency, StoreItem } from "../../../types";
import { transformPrice } from "../../../helpers";
import { CustomButton, DetailRow, LogoCard, PriceInput, Timer } from "../..";
import { errors, Routes } from "../../../constants";
import s from "./CardModal.module.scss";
import {
  AlertIcon,
  ArrowRightIcon,
  CreditCardIcon,
  CrossIcon,
  GiftIcon,
  LinkIcon,
} from "../../Icons";
import { useRedux } from "../../../hooks";
import {
  selectBalance,
  selectBoughtError,
  selectInfoMessage,
  selectLoading,
} from "../../../redux";

type CardModalProps = {
  data: any;
  //TODO add type
  onClose?: () => void;
  setPrice?: (e: number) => void;
  handleBuy?: (data: StoreItem, price?: number) => void;
  userId?: string;
  type?: "store" | "trade" | "auction";
};

export const CardModal: React.FC<CardModalProps> = ({
  data,
  onClose,
  handleBuy,
  setPrice,
  userId,
  type,
}) => {
  const [select] = useRedux();

  const [bid, setBid] = useState<any>(
    data?.top_bid ? data?.top_bid + data?.bid_step : data?.default_price?.value
  );

  const balance = select(selectBalance);
  const loading = select(selectLoading);
  const infoMessage = select(selectInfoMessage);
  const error = select(selectBoughtError);

  useEffect(() => {
    if (setPrice && bid && error !== errors.WRONG_VALUE_BID) {
      setPrice(bid);
    }
  }, [bid, setPrice, error]);

  const isAuction = data?.finish_datetime;
  const FREE = data?.default_price?.value === 0 && !isAuction;

  const handleBid = (e: any) => {
    setBid(+e.target.value.replaceAll(" ", ""));
  };

  const disableAuctionBtn = () => {
    //Check is auction
    //Сheck whether there is enough on the balance
    if (
      balance[data?.default_price?.currency as BalanceCurrency] < bid &&
      isAuction
    )
      return true;
    //Check that the bid is not less than the top bid
    if (data?.top_bid && bid < data?.top_bid + data?.bid_step && isAuction)
      return true;
    if (!data?.top_bid && bid < (data?.default_price?.value || 0) && isAuction)
      return true;

    if (
      type === "trade" &&
      balance[data?.default_price?.currency as BalanceCurrency] <
        (data?.default_price?.value || 0)
    ) {
      return true;
    }

    return false;
  };

  if (!data) return <></>;

  const errorMesage = isAuction
    ? "You need to top up your wallet to place this bid amount"
    : `You need to top up your wallet to buy this ${
        type === "store" ? "item" : "nft"
      }`;

  return (
    <div className={s.container}>
      <LogoCard item={data} className={s.img} free={FREE} hideTime />
      <div className={s.content}>
        <div className={s.name}>{data.name || data.item_name}</div>
        <div className={s.descriptions}>
          <div className={s.item}>
            <DetailRow title="IP owner" value={data.ipowner} type="text" />
          </div>
          <div className={s.item}>
            <DetailRow title="Franchise" value={data.franchise} type="text" />
          </div>
          <div className={s.item}>
            <DetailRow
              title="Collection"
              value={
                <CustomButton
                  theme="link"
                  icon={<LinkIcon />}
                  linkTo={
                    userId
                      ? `${Routes.PROFILE}/${userId}/collection/${data.collection_id}`
                      : "#"
                  }
                  value={data.collection_name}
                />
              }
              type="link"
            />
          </div>
          <div className={s.item}>
            <DetailRow
              title="Collectible"
              value={`#${data.num_in_collection} - ${
                data.name || data.item_name
              }`}
              type="text"
            />
          </div>
          <div className={s.item}>
            <DetailRow title="Rarity" value={data.rarity} type="text" />
          </div>
          {isAuction ? (
            <>
              <div className={s.item}>
                <DetailRow
                  title="Ends in"
                  value={<Timer lastDate={isAuction} />}
                  type="text"
                />
              </div>
              <div className={s.item}>
                <DetailRow title="Bids" value={data?.bids_count} type="text" />
              </div>
              <div className={s.item}>
                <DetailRow
                  title="Starting Bid"
                  value={transformPrice(data.default_price.value)}
                  type="price"
                  valueCurrency={data.default_price.currency}
                />
              </div>
              <div className={s.item}>
                <DetailRow
                  title="Top Bid"
                  value={transformPrice(data?.top_bid || 0)}
                  type="price"
                  valueCurrency={data.default_price.currency}
                />
              </div>
              {data?.top_bid_username && (
                <div className={s.item}>
                  <DetailRow
                    title="Top Bidder"
                    value={
                      <div>
                        {data?.top_bid_username}
                        {userId === data?.top_bid_user_id && (
                          <span style={{ opacity: 0.5 }}> (You)</span>
                        )}
                      </div>
                    }
                    type="price"
                  />
                </div>
              )}
              <div className={s.itemInput}>
                <PriceInput
                  startTest={data.default_price.currency}
                  placeholder="0.00"
                  title="your bid"
                  name="your bid card modal"
                  message={`min ${data.default_price.currency} ${transformPrice(
                    data?.top_bid
                      ? data?.top_bid + data?.bid_step
                      : data?.default_price?.value
                  )}`}
                  value={bid}
                  onChange={handleBid}
                  maskOptions={{
                    prefix: "",
                  }}
                  errorMessage={
                    balance[data?.default_price?.currency as BalanceCurrency] <
                    bid
                      ? errorMesage
                      : ""
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div className={s.item}>
                <DetailRow
                  title="Quantity"
                  value={data?.total_nft_num?.toLocaleString("RU-ru")}
                  type="text"
                />
              </div>
              {data?.drop_chance ? (
                <div className={s.item}>
                  <DetailRow
                    title="Drop Chance"
                    value={`${data?.drop_chance}%`}
                    type="text"
                  />
                </div>
              ) : (
                <div className={s.item}>
                  <DetailRow
                    title="Price"
                    value={
                      FREE ? "FREE" : transformPrice(data.default_price.value)
                    }
                    type="price"
                    valueCurrency={
                      FREE ? undefined : data.default_price.currency
                    }
                  />
                </div>
              )}
            </>
          )}

          {type === "trade" &&
            balance[data?.default_price?.currency as BalanceCurrency] <
              data?.default_price?.value && (
              <div className={s.tipError}>
                <AlertIcon className={s.icon} /> {errorMesage}
              </div>
            )}
        </div>
        <div className={s.btnList}>
          {onClose && (
            <CustomButton
              theme="transparent"
              icon={<CrossIcon />}
              value="Cancel"
              onClick={onClose}
              style={{ height: "32px" }}
            />
          )}
          {handleBuy && (
            <CustomButton
              theme={FREE ? "turquoise" : "violet"}
              icon={
                FREE ? (
                  <GiftIcon fill="#0f1010" />
                ) : isAuction ? (
                  <CreditCardIcon />
                ) : (
                  <ArrowRightIcon />
                )
              }
              value={FREE ? "get" : isAuction ? "BID" : "Buy"}
              onClick={() => handleBuy(data, isAuction && bid)}
              disabled={disableAuctionBtn()}
              style={{ height: "32px" }}
              loading={loading || !!infoMessage.length}
            />
          )}
        </div>
      </div>
    </div>
  );
};
