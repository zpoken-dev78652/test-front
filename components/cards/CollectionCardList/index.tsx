import React from "react";
import cn from "classnames";
import s from "./CollectionCardList.module.scss";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader, ClipLoader } from "react-spinners";
import { NotFoundItem } from "../..";
import { IconNotFoundItemsIcon } from "../../../public/icons";

type CollectionCardListPropsType = {
  data: any;
  type: "four";
  typeAdd?: string;
  handleAdd?: () => void;
  handleOnCardClick: (id: string) => void;
  handleNext: () => void;
  hasMore: boolean;
  noItemsTitle?: string;
  noItemsDesc?: string;
  loading?: boolean;
};

type CollectionCardPropsType = {
  item: any;
  handleOnCardClick: (id: string) => void;
};

const CollectionCard: React.FC<CollectionCardPropsType> = ({
  item,
  handleOnCardClick,
}) => {
  return (
    <div
      onClick={() => handleOnCardClick(item.id)}
      className={`${s.card} ${s.violetBorder}`}
    >
      <div className={s.top} style={{ backgroundImage: `url(${item.logo})` }}>
        {item.full_num === item.current_num && (
          <div className={s.full}>Full album</div>
        )}
      </div>
      <div className={s.bottom}>
        <div className={cn([s.header, s.text])}>{item.name}</div>
        <div className={s.count}>
          {item.current_num}/{item.full_num} items
        </div>
      </div>
    </div>
  );
};

export const CollectionCardList: React.FC<CollectionCardListPropsType> = ({
  data,
  type,
  handleOnCardClick,
  loading,
  handleNext,
  hasMore,
  noItemsTitle,
  noItemsDesc,
}) => {
  const classes = {
    four: s.four,
  };
  return (
    <>
      {loading && !data.length && (
        <div className={s.spiner}>
          <ClipLoader color={"#fff"} size={60} />
        </div>
      )}
      <InfiniteScroll
        dataLength={data.length}
        next={handleNext}
        className={cn(s.children, classes[type])}
        hasMore={hasMore}
        loader={
          data.length ? (
            <div className={s.loader}>
              <BeatLoader size={10} color="#fff" />
            </div>
          ) : null
        }
      >
        {data.map((i: any) => (
          <CollectionCard
            key={i.id}
            item={i}
            handleOnCardClick={handleOnCardClick}
          />
        ))}
      </InfiniteScroll>
      {!loading && !data?.length && (
        <NotFoundItem
          icon={<IconNotFoundItemsIcon />}
          header={noItemsTitle ?? "You have no item yet"}
          text={noItemsDesc ?? "At the moment there is no item"}
        />
      )}
    </>
  );
};
