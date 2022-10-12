import cn from "classnames";
import moment from "moment";
import React, { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import reactStringReplace from "react-string-replace";
import { infoMessages } from "../../../constants";
import { useInfinitePagination, useRedux } from "../../../hooks";
import { IconNotFoundItemsIcon } from "../../../public/icons";
import {
  getNFTWithdrawalHistoryAsync,
  getWalletHistory,
  profileActions,
  selectInfoMessage,
  selectNftTransferoutHistory,
  selectProfileInfoMessage,
  selectWalletHistory,
} from "../../../redux";
import { BalanceCurrency, WalletHistoryType } from "../../../types";
import { WalletPopupIcon, WalletWithdrawedIcon } from "../../Icons";
import { NotFoundItem } from "../../NotFoundItem";
import { Tooltip } from "../../Tooltip";
import s from "./HistoryTable.module.scss";

type HistoryTableProps = {
  currency: BalanceCurrency;
  perPage?: number;
  type?: "nft" | "wallet";
};

export const HistoryTable: FC<HistoryTableProps> = ({
  currency,
  perPage,
  type = "wallet",
}) => {
  const [select] = useRedux();
  const infoMessage = select(selectProfileInfoMessage);
  const infoMessageStore = select(selectInfoMessage);
  const { resetWallet } = profileActions;

  const loading =
    infoMessage.some((el) => el === infoMessages.LOADING_HISTORY) ||
    infoMessageStore.some(
      (el) => el === infoMessages.LOADING_NFT_TRANSFEROUT_HISTORY
    );

  const { items, handleNext, hasMore } = useInfinitePagination<
    WalletHistoryType[]
  >({
    query: type === "nft" ? getNFTWithdrawalHistoryAsync : getWalletHistory,
    selectData:
      type === "nft" ? selectNftTransferoutHistory : selectWalletHistory,
    resetFunc: resetWallet,
    perPage: perPage || 20,
    ...(type === "wallet" && { url: `&currency=${currency}` }),
  });

  const popapIcon = ["payment", "NFT purchase"];

  return (
    <div className={s.historyTable} id="scrollableHistoryContent">
      {loading ? (
        <div className={s.loader}>
          <BeatLoader size={12} color="#fff" />
        </div>
      ) : items.length ? (
        <InfiniteScroll
          scrollableTarget="scrollableHistoryContent"
          dataLength={items.length}
          next={handleNext}
          hasMore={hasMore}
          loader={
            <div className={s.loader}>
              <BeatLoader size={10} color="#fff" />
            </div>
          }
        >
          {items?.map((el) => (
            <div className={s.history} key={el.id}>
              <div className={s.iconWrap}>
                {popapIcon.some((i) => i === el.transaction_type) ? (
                  <WalletPopupIcon />
                ) : (
                  <WalletWithdrawedIcon />
                )}
              </div>
              <div className={s.content}>
                <div className={s.text}>
                  <h5>
                    {reactStringReplace(el.text, "{currency}", (_, i) => (
                      <span key={i} className={currency}>
                        {currency}{" "}
                      </span>
                    ))}
                  </h5>
                  {el?.transaction_hash && (
                    <>
                      <span
                        className="ellipsis"
                        data-tip
                        data-for={el?.transaction_hash}
                      >
                        Tx Hash: {el?.transaction_hash}
                      </span>
                      <Tooltip id={el?.transaction_hash}>
                        <span className={s.ipowner}>
                          {el?.transaction_hash}
                        </span>
                      </Tooltip>
                    </>
                  )}
                </div>

                <div className={s.info}>
                  <p className={s.date}>
                    {moment(el.created_at).format("DD MMM YYYY, HH:mm")}
                  </p>
                  <p className={cn([s.status, s[el.status]])}>{el.status}</p>
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      ) : (
        <NotFoundItem
          icon={<IconNotFoundItemsIcon />}
          header={"There is no history logs yet"}
          text={"You can transfer out nft and see history here"}
          className={s.notItems}
        />
      )}
    </div>
  );
};
