import React, { useReducer } from "react";
import { WrapperModal } from "..";
import { reducer, initialComponentState } from "../../../reducers";
import {
  useInfinitePagination,
  useRedux,
  useStringifyFilters,
} from "../../../hooks";
import s from "./SelectAvatarAsNFT.module.scss";
import {
  getUserItems,
  selectInfoMessage,
  selectUserData,
  selectUserItems,
  storeActions,
} from "../../../redux";
import { FeaturesCardList } from "../..";
import { infoMessages } from "../../../constants";

type SelectAvatarAsNFTProps = {
  onClose: () => void;
  handleSelectItem: (data: any) => void;
};

export const SelectAvatarAsNFT: React.FC<SelectAvatarAsNFTProps> = ({
  onClose,
  handleSelectItem,
}) => {
  const [select] = useRedux();
  const [data] = useReducer(reducer, initialComponentState);
  const { url } = useStringifyFilters({ data });

  const infoMessageStore = select(selectInfoMessage);
  const user = select(selectUserData);

  const { resetChronicleStore } = storeActions;

  const { items, handleNext, handleRefetch, hasMore } = useInfinitePagination({
    query: getUserItems,
    selectData: selectUserItems,
    resetFunc: resetChronicleStore,
    perPage: 12,
    url,
    id: user?.id,
  });

  return (
    <WrapperModal
      className={s.modal}
      onClose={onClose}
      name="SelectAvatarAsNFT"
      title="My items"
    >
      <div className={s.content}>
        <FeaturesCardList
          handleNext={handleNext}
          hasMore={hasMore}
          userId={user.id}
          data={items ?? []}
          handleSelectAvatar={handleSelectItem}
          loading={
            infoMessageStore.some(
              (el) => el === infoMessages.LOADING_USER_ITEMS
            ) && !items.length
          }
          noItemsTitle="There is nothing in the marketplace yet"
          type="four-filtering"
          noItemsDesc="You can be the first who will make a propose"
          scrollableTarget="SelectAvatarAsNFT_scroll"
        />
      </div>
    </WrapperModal>
  );
};
