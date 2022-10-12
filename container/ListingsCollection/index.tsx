import { useRouter } from "next/router";
import React from "react";
import { AdvancedFiltering, FeaturesCardList } from "../../components";
import { Routes } from "../../constants";
import {
  useInfinitePagination,
  useRedux,
  useStringifyFilters,
} from "../../hooks";
import {
  getChronicleTradeAsync,
  selectChronicleTrade,
  selectChronicleTradeStatus,
  tradeActions,
} from "../../redux";
import { Franchise } from "../../types";
import s from "./ListingsCollection.module.scss";

type ItemProps = {
  data: any;
  id: string;
  selectedTab: string;
  franchises: Franchise[];
  types: string[];
  dispatchComponent: any;
};

export const Listings: React.FC<ItemProps> = ({
  data,
  id,
  dispatchComponent,
  franchises,
  selectedTab,
  types,
}) => {
  const [select] = useRedux();
  const { resetTrade } = tradeActions;
  const { push } = useRouter();

  const { loading } = select(selectChronicleTradeStatus);

  const { url } = useStringifyFilters({ data });

  const {
    items: chronicleTrade,
    handleNext,
    hasMore,
  } = useInfinitePagination({
    query: getChronicleTradeAsync,
    selectData: selectChronicleTrade,
    resetFunc: resetTrade,
    perPage: 20,
    url,
    id,
  });

  const handleOnCardClick = (id: string) => push(`${Routes.NFT}/${id}`);

  return (
    <div className={s.container}>
      <div className={s.mainContent}>
        <AdvancedFiltering
          data={data}
          itemTypes={types}
          dispatchComponent={dispatchComponent}
          type="collection"
          franchises={franchises}
          selectedTab={selectedTab}
        />
        <div className={s.rightSide}>
          <div className={s.items}>
            <div className={s.cards}>
              <FeaturesCardList
                handleNext={handleNext}
                hasMore={hasMore}
                data={chronicleTrade}
                handleOnCardClick={handleOnCardClick}
                userId={id}
                hideSellerName
                loading={loading}
                noItemsTitle="You have no active listings yet"
                noItemsDesc="Once you'll put any collectible on sale or make one tradable it will appear here"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
