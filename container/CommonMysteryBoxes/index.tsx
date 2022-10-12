import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { CardModal, CommonMysteryBoxCard, Modal } from "../../components";
import { useInfinitePagination, useRedux } from "../../hooks";
import {
  getCommonMysteryBoxItem,
  resetAuth,
  selectCommonMysteryBoxItems,
  selectUserData,
} from "../../redux";
import { MysteryBoxItem, User } from "../../types";
import s from "./CommonMysteryBoxes.module.scss";

type CommonMysteryBoxesProps = {
  id: string;
};

export const CommonMysteryBoxes: React.FC<CommonMysteryBoxesProps> = ({
  id,
}) => {
  const [select] = useRedux();
  const [selectedItem, setSelectedItem] = useState<MysteryBoxItem | null>(null);

  const user: User = select(selectUserData);

  const { items, handleNext, hasMore } = useInfinitePagination({
    query: getCommonMysteryBoxItem,
    selectData: selectCommonMysteryBoxItems,
    resetFunc: resetAuth,
    perPage: 6,
    id,
  });
  const handleCancelClick = () => setSelectedItem(null);

  return (
    <>
      <div className={s.container}>
        <InfiniteScroll
          scrollableTarget="scrollableHistoryContent"
          dataLength={items.length}
          next={handleNext}
          hasMore={hasMore}
          className="infinite-scroll-mysterybox"
          loader={
            <div className={s.loader}>
              <BeatLoader size={10} color="#fff" />
            </div>
          }
        >
          <div className={s.cardContainer}>
            {items.map((i: MysteryBoxItem) => (
              <div key={i.id} className={s.card}>
                <CommonMysteryBoxCard
                  item={i}
                  userId={user.id}
                  setSelectedItem={setSelectedItem}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
      {selectedItem && (
        <Modal onClose={handleCancelClick}>
          <CardModal data={selectedItem} userId={user.id} />
        </Modal>
      )}
    </>
  );
};
