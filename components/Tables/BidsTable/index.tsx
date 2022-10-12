import React, { FC, useEffect } from "react";
import { useRedux } from "../../../hooks";
import {
  getBidsAuctionByIdAsync,
  selectBids,
  selectLoading,
} from "../../../redux";
import Avatar from "../../../public/img/chronicle_avatar.png";
import Image from "next/image";
import s from "./BidsTable.module.scss";
import moment from "moment";
import { transformPrice } from "../../../helpers";
import { NotFoundItem } from "../..";
import { IconNotFoundCollections } from "../../../public/icons";

type BidsTable = {
  id: string;
};

const INTERVAL = 5;

export const BidsTable: FC<BidsTable> = ({ id }) => {
  const [select, dispatch] = useRedux();
  const bids = select(selectBids);
  const loading = select(selectLoading);

  useEffect(() => {
    dispatch(getBidsAuctionByIdAsync(id));

    const interval = setInterval(() => {
      dispatch(getBidsAuctionByIdAsync(id));
    }, INTERVAL * 1000);

    return () => {
      clearInterval(interval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loading && !bids.length)
    return (
      <NotFoundItem
        icon={<IconNotFoundCollections />}
        header="Nothing here yet"
        text="Once you purchase an item the corresponding collection's album cover will display automatically."
      />
    );

  return (
    <div className={s.bidsTable}>
      {bids.map((row) => (
        <div key={row.bid_id} className={s.row}>
          <div className={s.userInfo}>
            <div className={s.avatar}>
              <Image
                src={row?.user_logo || Avatar}
                layout="fill"
                alt={`avatar ${row?.username}`}
              />
            </div>
            <div>
              <p className={s.userName}>
                {row?.user_id ? row?.username : "Ghost"}
              </p>
              <p className={s.date}>
                {moment(row?.created_at).utc().format("DD.MM.YYYY, HH:mm")}
              </p>
            </div>
          </div>
          <div className={s.price}>
            <span className={`${s.currency} ${row?.currency}`}>
              {row?.currency}
            </span>{" "}
            <span className={s.value}>{transformPrice(row?.value)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
