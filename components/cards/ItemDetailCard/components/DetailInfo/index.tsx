import moment from "moment";
import Link from "next/link";
import React, { FC } from "react";
import { CustomButton, DetailRow, Timer } from "../../../..";
import { Routes } from "../../../../../constants";
import { transformPrice } from "../../../../../helpers";
import { LinkIcon } from "../../../../Icons";
import s from "./DetailInfo.module.scss";

type DetailInfoProps = {
  item: any;
  userId: string;
  isAuction: boolean;
  hasOnBuyClick: boolean;
  endedAuction: boolean;
  name: string;
  setOpenModalCopies: (e: boolean) => void;
};

export const DetailInfo: FC<DetailInfoProps> = ({
  item,
  userId,
  isAuction,
  hasOnBuyClick,
  endedAuction,
  name,
  setOpenModalCopies,
}) => {
  return (
    <div className={s.detailsTab}>
      {item.description && (
        <div className={s.descriptions}>{item.description}</div>
      )}
      <div className={s.detailList}>
        <div className={s.item}>
          <DetailRow title="IP owner" value={item.ipowner} type="text" />
        </div>
        <div className={s.item}>
          <DetailRow title="Franchise" value={item?.franchise} type="text" />
        </div>

        <div className={s.item}>
          <DetailRow
            title="Collection"
            value={
              <CustomButton
                theme="link"
                icon={<LinkIcon size={12} />}
                linkTo={
                  userId
                    ? `${Routes.PROFILE}/${userId}/collection/${item.collection_id}`
                    : "#"
                }
                value={item.collection_name}
              />
            }
            type="link"
          />
        </div>
        <div className={s.item}>
          <DetailRow
            title="Collectible"
            value={`#${item.num_in_collection} - ${name}`}
            type="text"
          />
        </div>
        <div className={s.item}>
          <DetailRow title="Rarity" value={item.rarity} type="text" />
        </div>
        {!isAuction && (
          <div className={s.item}>
            <DetailRow
              title={hasOnBuyClick ? "Quantity" : "Your unique number"}
              value={
                hasOnBuyClick
                  ? `${item.total_nft_num}`
                  : `${item.nft_index} / ${item.total_nft_num}`
              }
              type="text"
            />
          </div>
        )}
        {isAuction && (
          <>
            <div className={s.item}>
              <DetailRow
                title={endedAuction ? "Ended" : "Ends in"}
                value={
                  endedAuction ? (
                    moment(item?.finish_datetime)
                      .utc()
                      .format("DD.MM.YYYY HH:mm:ss")
                  ) : (
                    <Timer lastDate={item?.finish_datetime} />
                  )
                }
                type="text"
              />
            </div>
            <div className={s.item}>
              <DetailRow title="Bids" value={item?.bids_count} type="text" />
            </div>
            <div className={s.item}>
              <DetailRow
                title="Starting Bid"
                value={transformPrice(item?.default_price?.value)}
                type="price"
                valueCurrency={item?.default_price?.currency}
              />
            </div>
            <div className={s.item}>
              <DetailRow
                title="Top Bid"
                value={transformPrice(item?.top_bid || 0)}
                type="price"
                valueCurrency={item?.default_price?.currency}
              />
            </div>
            {item?.top_bid_username && (
              <div className={s.item}>
                <DetailRow
                  title="Top Bidder"
                  value={
                    <div>
                      <Link
                        passHref
                        href={`/profile/${item?.top_bid_user_id}/collection`}
                      >
                        <a className={s.nameLink}>{item?.top_bid_username}</a>
                      </Link>

                      {userId === item?.top_bid_user_id && (
                        <span style={{ opacity: 0.5 }}> (You)</span>
                      )}
                    </div>
                  }
                  type="price"
                />
              </div>
            )}
          </>
        )}

        {!hasOnBuyClick && (
          <div className={s.item}>
            <DetailRow
              title="Transaction ID"
              opacityValue={!item?.nft_token}
              value={
                item.nft_token ? (
                  <a
                    className={s.detailLink}
                    href={`https://api.chronicle.io/nft/id/${item.nft_token}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.nft_token}
                  </a>
                ) : (
                  "Waiting for Token ID"
                )
              }
              type="text"
            />
          </div>
        )}
        {item?.duplicates?.length ? (
          <div className={s.item}>
            <DetailRow
              title="Item Purchases"
              value={
                <div
                  className={s.detailLink}
                  onClick={() => setOpenModalCopies(true)}
                >
                  x{item?.duplicates?.length}
                </div>
              }
              type="link"
            />
          </div>
        ) : null}
        {!isAuction && (
          <div className={s.item}>
            <DetailRow title="Item type" value={item.type} type="text" />
          </div>
        )}
      </div>
    </div>
  );
};
