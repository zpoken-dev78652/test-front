/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import cn from "classnames";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import s from "../Tables.module.scss";
import { SortObject, transformPrice } from "../../../helpers";
import { CustomButton, NotFoundItem, SortedHeader } from "../..";
import moment from "moment";
import { TradeHistoryType } from "../../../types";
import { IconNotFoundItemsIcon } from "../../../public/icons";
import { useRedux } from "../../../hooks";
import { selectInfoMessage } from "../../../redux";
import { infoMessages, Routes } from "../../../constants";

export type CommunitySalesTableProps = {
  data: TradeHistoryType[];
  hasMore: boolean;
  sortObject: SortObject;
  handleNext: () => void;
  handleChangeSort: (val: string) => void;
};

export const CommunitySalesTable: React.FC<CommunitySalesTableProps> = ({
  data,
  hasMore,
  sortObject,
  handleNext,
  handleChangeSort,
}) => {
  const [select] = useRedux();
  const storeInfoMessage = select(selectInfoMessage);

  const loadingTradeHistory = storeInfoMessage.some(
    (el) => el === infoMessages.LOADING_TRADE_HISTORY
  );

  if (!data.length && loadingTradeHistory) {
    return (
      <div className={s.notFound}>
        <NotFoundItem
          icon={<IconNotFoundItemsIcon />}
          type="itemDetail"
          header="No community sales yet"
          text="You can be the first to start the chain of sales on the community market which is coming soon..."
        />
      </div>
    );
  }

  return (
    <div className={cn(s.tableDiv, s.communitySalesTable)}>
      <div className={s.header}>
        <div className={s.row}>
          <SortedHeader
            as="div"
            text="Print"
            value="print_"
            className={cn(s.col)}
            sortObject={sortObject}
            handleChangeSort={handleChangeSort}
            disable={loadingTradeHistory}
          />
          <div className={s.col}>Buyer</div>
          <div className={s.col}>Seller</div>
          <SortedHeader
            as="div"
            text="Price"
            value="price_"
            className={cn(s.col)}
            sortObject={sortObject}
            handleChangeSort={handleChangeSort}
            disable={loadingTradeHistory}
          />
          <SortedHeader
            as="div"
            text="Date"
            value="date_"
            className={cn(s.col)}
            sortObject={sortObject}
            handleChangeSort={handleChangeSort}
            disable={loadingTradeHistory}
          />
        </div>
      </div>
      {data.length > 0 && loadingTradeHistory && (
        <div className={s.loader}>
          <BeatLoader size={12} color="#fff" />
        </div>
      )}
      <InfiniteScroll
        dataLength={data.length}
        next={handleNext}
        hasMore={hasMore}
        loader={
          <div className={s.loader}>
            <BeatLoader size={10} color="#fff" />
          </div>
        }
        scrollThreshold="50px"
        height={480}
      >
        {data.map((r) => (
          <div className={s.row} key={r.trade_id}>
            <div className={cn([s.col])}>
              <span>{r?.nft_index}</span>
            </div>
            <div className={cn([s.col])}>
              {r?.buyer_id ? (
                <CustomButton
                  theme="link"
                  value={r?.buyer_username}
                  className={s.btn}
                  linkTo={`${Routes.COLLECTION.replace(
                    ":id",
                    `${r?.buyer_id}`
                  )}`}
                />
              ) : (
                <span>Ghost</span>
              )}
            </div>
            <div className={cn([s.col])}>
              {r?.seller_id ? (
                <CustomButton
                  theme="link"
                  value={r?.seller_username}
                  className={s.btn}
                  linkTo={`${Routes.COLLECTION.replace(
                    ":id",
                    `${r?.seller_id}`
                  )}`}
                />
              ) : (
                <span>Ghost</span>
              )}
            </div>
            <div className={cn([s.col])}>
              <span>
                <span className={r?.currency}>{r?.currency}</span>{" "}
                {transformPrice(r?.value)}
              </span>
            </div>
            <div className={cn([s.col])}>
              {moment(r?.created_at).format("DD.MM.YYYY")}
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};
