import React from "react";
import { Franchise } from "../../types";
import { useRouter } from "next/router";
import {
  useInfinitePagination,
  useRedux,
  useStringifyFilters,
} from "../../hooks";
import {
  getCollectionsAsync,
  profileActions,
  selectCollections,
  selectLoadingProfile,
} from "../../redux";
import { Routes } from "../../constants";
import { AdvancedFiltering, CollectionCardList } from "../../components";
import s from "./AlbumCollection.module.scss";

type AlbumProps = {
  data: any;
  id: string;
  selectedTab: string;
  franchises: Franchise[];
  dispatchComponent: any;
};

export const Album: React.FC<AlbumProps> = ({
  data,
  id,
  dispatchComponent,
  franchises,
  selectedTab,
}) => {
  const { push } = useRouter();
  const [select] = useRedux();

  const { resetCollection } = profileActions;

  const { url } = useStringifyFilters({ data });

  const {
    items: chronicleStore,
    handleNext,
    hasMore,
  } = useInfinitePagination({
    query: getCollectionsAsync,
    selectData: selectCollections,
    resetFunc: resetCollection,
    perPage: 16,
    url,
    id,
  });

  const loading = select(selectLoadingProfile);
  const handleOnCollectionClick = (idCollection: string) =>
    push(`${Routes.PROFILE}/${id}/collection/${idCollection}`);

  return (
    <div className={s.container}>
      <div className={s.mainContent}>
        {
          <AdvancedFiltering
            data={data}
            completeness={["Completed", "In Progress"]}
            dispatchComponent={dispatchComponent}
            type="collection"
            franchises={franchises}
            selectedTab={selectedTab}
          />
        }
        <div className={s.rightSide}>
          <div className={s.items}>
            <div className={s.cards}>
              <CollectionCardList
                type="four"
                data={chronicleStore || []}
                handleOnCardClick={handleOnCollectionClick}
                handleNext={handleNext}
                hasMore={hasMore}
                loading={loading}
                noItemsTitle="Nothing here yet"
                noItemsDesc="Once you purchase an item the corresponding collection's album cover will display automatically."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
