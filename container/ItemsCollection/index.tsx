import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  AdvancedFiltering,
  AuctionCardList,
  CustomTabs,
  FeaturesCardList,
} from "../../components";
import { infoMessages } from "../../constants";
import {
  useInfinitePagination,
  useRedux,
  useStringifyFilters,
} from "../../hooks";
import {
  getChronicleStoreAsync,
  selectChronicleStore,
  selectInfoMessage,
  selectLoading,
  selectUserData,
  storeActions,
} from "../../redux";
import { Franchise } from "../../types";
import s from "./ItemsCollection.module.scss";

type ItemProps = {
  data: any;
  id: string;
  selectedTab: string;
  franchises: Franchise[];
  types: string[];
  dispatchComponent: any;
};

const tabs = ["items", "auctions"];

export const Items: React.FC<ItemProps> = ({
  data,
  id,
  dispatchComponent,
  franchises,
  selectedTab,
  types,
}) => {
  const { push } = useRouter();
  const [select] = useRedux();

  const [selectTab, setSelectTab] = useState(tabs[0]);

  const loading = select(selectLoading);
  const user = select(selectUserData);
  const infoMessage = select(selectInfoMessage);

  const { resetChronicleStore } = storeActions;

  const { url } = useStringifyFilters({ data });

  const {
    items: chronicleStore,
    handleNext,
    handleRefetch,
    hasMore,
  } = useInfinitePagination({
    query: getChronicleStoreAsync,
    selectData: selectChronicleStore,
    resetFunc: resetChronicleStore,
    perPage: 20,
    url,
    id,
    type: selectTab === tabs[1] ? "auction" : undefined,
  });

  const handleOnCardClick = (id: string) =>
    push(`/store/${selectTab === tabs[1] ? "auction" : "nft"}/${id}`);

  return (
    <div className={s.container}>
      <div className={s.mainContent}>
        {
          <AdvancedFiltering
            data={data}
            itemTypes={types}
            dispatchComponent={dispatchComponent}
            type="collection"
            franchises={franchises}
            selectedTab={selectedTab}
          />
        }
        <div className={s.rightSide}>
          <div className={s.items}>
            <CustomTabs
              tabs={tabs}
              selectTab={selectTab}
              onChange={(e) => setSelectTab(e)}
              className={s.tabs}
              name="itemsCollection"
            />
            <div className={s.cards}>
              {selectTab === tabs[0] ? (
                <FeaturesCardList
                  type="four-filtering"
                  data={chronicleStore || []}
                  handleOnCardClick={handleOnCardClick}
                  userId={id}
                  handleNext={handleNext}
                  hasMore={hasMore}
                  loading={loading}
                  noItemsTitle="Nothing here yet"
                  noItemsDesc="Once you'll purchase any item — it will appear right here no matter which album it belongs to."
                />
              ) : (
                <AuctionCardList
                  userId={user.id}
                  data={chronicleStore || []}
                  handleOnCardClick={handleOnCardClick}
                  handleRefetch={handleRefetch}
                  handleNext={handleNext}
                  hasMore={hasMore}
                  loading={infoMessage.some(
                    (el) => el === infoMessages.LOADING_AUCTIONS
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
