/* eslint-disable jsx-a11y/alt-text */
import Image from "next/image";
import { useEffect, useReducer, useState } from "react";
import {
  VERIFY_200,
  VERIFY_TOO_MANY_REQUESTS,
} from "../../../../components/modals/ItemBoughtErrorModal/data";
import { useRedux } from "../../../../hooks";
import {
  initialComponentState,
  reducer,
  RESET_FIELDS,
} from "../../../../reducers";
import {
  getFranchiseCollectionAsync,
  getSummaryItemAsync,
  getTypesCollectionAsync,
  getUserProfileData,
  selectBoughtError,
  selectFranchises,
  selectProfileData,
  selectSummaryItem,
  selectTypes,
  storeActions,
} from "../../../../redux";
import { Franchise, SummaryItem } from "../../../../types";
import Avatar from "../../../../public/img/chronicle_avatar.png";
import {
  CustomTabs,
  ItemBoughtErrorModal,
  MainLayout,
} from "../../../../components";
import { Album, Items, Listings, Meta } from "../../../../container";
import { useRouter } from "next/router";
import s from "./Collection.module.scss";

const Collection = () => {
  const [select, dispatch] = useRedux();
  const { query } = useRouter();

  const [selectedTab, setSelectedTab] = useState<string>("Albums");

  const [data, dispatchComponent] = useReducer(reducer, initialComponentState);

  const summaryItem: SummaryItem = select(selectSummaryItem);
  const franchises: Franchise[] = select(selectFranchises);
  const types: string[] = select(selectTypes);
  const userProfile = select(selectProfileData);
  const error: string | null = select(selectBoughtError);

  const { setError } = storeActions;

  useEffect(() => {
    if (!query.profile_id) return;
    dispatch(getFranchiseCollectionAsync(query.profile_id as string));
    dispatch(getTypesCollectionAsync(query.profile_id as string));
    dispatch(getSummaryItemAsync(query.profile_id as string));
    dispatch(getUserProfileData(query.profile_id as string));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.profile_id]);

  useEffect(() => {
    if (query.tab === "listings") {
      setSelectedTab("Listings");
    }

    if (query.tab === "items") {
      setSelectedTab("Items");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTab = (item: string) => {
    dispatchComponent({ type: RESET_FIELDS });
    setSelectedTab(item);
  };

  const handleCloseWarningModal = () => {
    dispatch(setError(null));
  };

  return (
    <>
      <Meta title={`Collection | ${selectedTab}`} />
      {userProfile.id && (
        <div className={s.headerContainer}>
          <div className={s.header}>
            <div className={s.profile}>
              <div className={s.avatarWrap}>
                <div className={s.avatar}>
                  <Image src={userProfile?.logo || Avatar} layout="fill" />
                </div>
              </div>
              <div className={s.content}>
                <div className={s.nick}>{userProfile.username}</div>
              </div>
            </div>
            <div className={s.counts}>
              <div className={s.count}>
                <div className={s.digits}>{summaryItem.items}</div>
                <div className={s.name}>items total</div>
              </div>
              <div className={s.count}>
                <div className={s.digits}>{summaryItem.unique}</div>
                <div className={s.name}>unique items</div>
              </div>
              <div className={s.count}>
                <div className={s.digits}>{summaryItem.full_set}</div>
                <div className={s.name}>full Albums</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {query.profile_id && (
        <div className={s.container}>
          <div className={s.mainContent}>
            <div className={s.leftSide}>
              <CustomTabs
                tabs={["Albums", "Items", "Listings"]}
                selectTab={selectedTab}
                onChange={(e) => handleChangeTab(e)}
                className={s.tabs}
                name="profileCollection"
              />
            </div>
            {selectedTab === "Albums" && (
              <Album
                data={data}
                id={query.profile_id as string}
                selectedTab={selectedTab}
                franchises={franchises}
                dispatchComponent={dispatchComponent}
              />
            )}
            {selectedTab === "Items" && (
              <Items
                data={data}
                id={query.profile_id as string}
                types={types}
                selectedTab={selectedTab}
                franchises={franchises}
                dispatchComponent={dispatchComponent}
              />
            )}
            {selectedTab === "Listings" && (
              <Listings
                data={data}
                id={query.profile_id as string}
                types={types}
                selectedTab={selectedTab}
                franchises={franchises}
                dispatchComponent={dispatchComponent}
              />
            )}
          </div>
        </div>
      )}
      {(error === VERIFY_200 || error === VERIFY_TOO_MANY_REQUESTS) && (
        <ItemBoughtErrorModal
          error={error}
          onCancelClick={handleCloseWarningModal}
        />
      )}
    </>
  );
};

Collection.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default Collection;
