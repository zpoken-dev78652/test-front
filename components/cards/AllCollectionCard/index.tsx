import { useRouter } from "next/router";
import React, { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader, ClipLoader } from "react-spinners";
import { CustomButton, NotFoundItem } from "../..";
import { Routes } from "../../../constants";
import { IconNotFoundItemsIcon } from "../../../public/icons";
import { CollectionType } from "../../../types";
import s from "./AllCollectionCard.module.scss";

type AllCollectionCardListProps = {
  data: CollectionType[];
  handleNext: () => void;
  hasMore: boolean;
  loading?: boolean;
  noItemsTitle?: string;
  noItemsDesc?: string;
};

type AllCollectionCardProps = {
  data: CollectionType;
};

export const AllCollectionCard: FC<AllCollectionCardProps> = ({ data }) => {
  const { push } = useRouter();

  const handlClickCard = () => push(`${Routes.FULL_COLLECTION}/${data?.id}`);

  return (
    <div className={s.collectionCard} onClick={handlClickCard}>
      <div className={s.imgWrap}>
        <img src={data?.banner_main} alt={`Banner ${data?.name}`} />
      </div>
      <div className={s.content}>
        <div className={s.info}>
          <h5 className={`${s.name} ellipsis`}>{data?.name}</h5>
          <p className={s.items}>
            <span className={s.item}>{data?.minted_items_num} items</span>
            {data?.num_of_auctions > 0 && (
              <span className={s.item}>{data?.num_of_auctions} auction</span>
            )}
            {data?.is_sold_out && <p className={s.soldOut}>Sold Out</p>}
          </p>
        </div>
        <CustomButton
          value="explore"
          className={s.btn}
          linkTo={`${Routes.FULL_COLLECTION}/${data?.id}`}
        />
      </div>
    </div>
  );
};

export const AllCollectionCardList: FC<AllCollectionCardListProps> = ({
  data,
  handleNext,
  hasMore,
  loading,
  noItemsTitle,
  noItemsDesc,
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
        className={s.collectionsWrap}
        hasMore={hasMore}
        loader={
          <div className={s.loader}>
            <BeatLoader size={10} color="#fff" />
          </div>
        }
      >
        {data?.map((collection, idx) => (
          <AllCollectionCard key={idx} data={collection} />
        ))}
      </InfiniteScroll>
      {!loading && !data?.length && (
        <NotFoundItem
          icon={<IconNotFoundItemsIcon />}
          header={noItemsTitle ?? "Here is no item yet"}
          text={noItemsDesc ?? "At the moment there is no collections"}
        />
      )}
    </div>
  );
};
