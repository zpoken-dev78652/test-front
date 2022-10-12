import cn from "classnames";
import moment from "moment";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader, ClipLoader } from "react-spinners";
import { CustomButton, NotFoundItem, Tooltip } from "../..";
import { mobileWidth, Routes } from "../../../constants";
import { transformPrice } from "../../../helpers";
import { useMediaQuery, useRedux } from "../../../hooks";
import { IconNotFoundItemsIcon } from "../../../public/icons";
import { postAuctionClaimAsync } from "../../../redux";
import { StoreItem } from "../../../types";
import { LinkIcon, SubtractIcon } from "../../Icons";
import { LogoCard } from "../LogoCard";
import s from "./AuctionCardList.module.scss";

type AuctionCardListProps = {
  data: StoreItem[];
  userId: string;
  handleSelectItem?: (item: StoreItem) => void;
  handleOnCardClick: (id: string) => void;
  handleRefetch: () => void;
  handleNext: () => void;
  hasMore: boolean;
  loading: boolean;
  noItemsTitle?: string;
  noItemsDesc?: string;
};

type AuctionCardProps = {
  data: StoreItem;
  userId: string;
  handleSelectItem?: (item: StoreItem) => void;
  handleOnCardClick: (id: string) => void;
  handleRefetch: () => void;
};

export const AuctionCard: FC<AuctionCardProps> = ({
  data,
  userId,
  handleSelectItem,
  handleOnCardClick,
  handleRefetch,
}) => {
  const [_, dispatch] = useRedux();
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);

  const isMyItem = data?.user_id === userId;

  const endedAuction =
    moment(data?.finish_datetime).utc().diff(moment().utc()) < 0;
  const [isRefetch, setisRefetch] = useState(false);

  const handleAuctionClaim = (id: string) => {
    dispatch(postAuctionClaimAsync(id));
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (handleSelectItem && !endedAuction) return handleSelectItem(data);
    if (endedAuction && isMyItem) return handleAuctionClaim(data.id);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (moment(data?.finish_datetime).utc().diff(moment().utc()) > 0) {
        setisRefetch(true);
      }

      if (
        moment(data?.finish_datetime).utc().diff(moment().utc()) <= 0 &&
        isRefetch
      ) {
        setisRefetch(false);
        handleRefetch();
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefetch]);

  return (
    <div
      key={data?.id}
      className={s.card}
      onClick={() => handleOnCardClick && handleOnCardClick(data?.id)}
    >
      <div>
        <LogoCard item={data} disabled={endedAuction} hideTime={endedAuction} />
      </div>
      <div className={s.content}>
        {isMobile && data?.ipowner && (
          <div className={s.ipownerMobile}>
            <SubtractIcon className={s.nameIcon} size={12} />
            <span className={s.ipowner}>{data?.ipowner}</span>
          </div>
        )}
        <div className={cn([s.header, s.lineText])}>
          <span>{data?.name}</span>
          {data?.ipowner && !isMobile && (
            <>
              <SubtractIcon
                className={s.nameIcon}
                size={12}
                data-tip
                data-for={data?.name + data?.id}
                data-offset="{'top': -5, 'left': -1}"
              />
              <Tooltip id={data?.name + data?.id}>
                <span className={s.ipowner}>{data?.ipowner}</span>
              </Tooltip>
            </>
          )}
        </div>
        <div className={s.wrapBtnCollection}>
          <CustomButton
            theme="link"
            icon={<LinkIcon size={12} />}
            linkTo={
              userId
                ? `${Routes.PROFILE}/${userId}/collection/${data?.collection_id}`
                : `${Routes.FULL_COLLECTION}/${data?.collection_id}`
            }
            value={data?.collection_name}
            className={s.linkBtn}
          />
        </div>

        <div className={s.row}>
          Starting Bid: {data?.default_price?.currency}{" "}
          {transformPrice(data?.default_price?.value)}
        </div>
      </div>
      <div className={s.bottomCard}>
        <div className={s.price}>
          {data?.top_bid ? (
            <>
              <p className={s.title}>
                {!endedAuction && "Top Bid"}
                {endedAuction && data?.user_id && `Winning Bid by `}
                {endedAuction &&
                  data?.user_id &&
                  data?.username &&
                  (data?.user_id === userId ? (
                    <span>You</span>
                  ) : (
                    <Link href={`/profile/${data?.user_id}/collection`}>
                      <a
                        className={s.userName}
                        onClick={(e: any) => e.stopPropagation()}
                      >
                        {data.username}
                      </a>
                    </Link>
                  ))}
              </p>
              <div className={s.fullPrice}>
                <span className={cn([s.currency, data.default_price.currency])}>
                  {data.default_price.currency}
                </span>{" "}
                {transformPrice(data?.top_bid)}
              </div>
            </>
          ) : (
            <p className={s.noBid}>No bids yet, yours will be the first one!</p>
          )}
        </div>
        {endedAuction && !isMyItem ? (
          <div className={s.soldOutBtn}>Finished</div>
        ) : handleSelectItem || isMyItem ? (
          <CustomButton
            theme="violet"
            value={isMyItem && endedAuction ? "Obtain" : "Bid"}
            onClick={handleClick}
            className={s.btn}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export const AuctionCardList: FC<AuctionCardListProps> = ({
  data,
  handleNext,
  hasMore,
  noItemsTitle,
  noItemsDesc,
  loading,
  ...cardProps
}) => {
  return (
    <div className={s.wrapper}>
      {loading && !data.length && (
        <div className={s.spiner}>
          <ClipLoader color={"#fff"} size={60} />
        </div>
      )}

      <InfiniteScroll
        dataLength={data.length}
        next={handleNext}
        className={s.auctionGridWrapper}
        hasMore={hasMore}
        loader={
          data.length ? (
            <div className={s.loader}>
              <BeatLoader size={10} color="#fff" />
            </div>
          ) : null
        }
      >
        {data?.map((a) => (
          <AuctionCard {...cardProps} key={a?.id} data={a} />
        ))}
      </InfiniteScroll>

      {!loading && !data?.length && (
        <NotFoundItem
          icon={<IconNotFoundItemsIcon />}
          header={noItemsTitle ?? "Here is no item yet"}
          text={noItemsDesc ?? "At the moment there is no auctions"}
        />
      )}
    </div>
  );
};
