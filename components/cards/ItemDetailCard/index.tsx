import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import {
  BidsTable,
  CommunitySalesTable,
  CustomTabs,
  ItemBoughtErrorModal,
  LogoCard,
  ObtaInedCopiesModal,
  Timer,
  TradeEditModal,
  TradeStepsModal,
  WithdrawItemModal,
} from "../..";
import { errors, mobileWidth } from "../../../constants";
import { changeSortObject, SortObject } from "../../../helpers";
import { useInfinitePagination, useMediaQuery, useRedux } from "../../../hooks";
import {
  getTradeHistory,
  globalActions,
  profileActions,
  selectTradeHistoryItem,
  selectUserData,
  storeActions,
} from "../../../redux";
import { GlobalModals } from "../../../redux/global/global.types";
import { DetailInfo } from "./components/DetailInfo";
import { HeaderItemCard } from "./components/HeaderItemCard";
import s from "./ItemDetailCard.module.scss";

type ItemDetailCardProps = {
  item: any;
  name: string;
  type?: "item" | "nft" | "trade" | "auction";
  userId: string;
  itemId: string;
  handleOnBuyClick?: (item: any, price?: number) => void;
  setPrice?: (e: number) => void;
};

export const ItemDetailCard: FC<ItemDetailCardProps> = ({
  item,
  name,
  type = "item",
  userId,
  itemId,
  handleOnBuyClick,
  setPrice,
}) => {
  const [select, dispatch] = useRedux();

  const [isOpenModalCopies, setOpenModalCopies] = useState(false);
  const [isOpenModalTrade, setOpenModalTrade] = useState(false);
  const [isOpenModalEditTrade, setOpenModalEditTrade] = useState(false);
  const [isOpenModalWithdraw, setOpenModalWithdraw] = useState(false);
  const [isOpenModal2Fa, setOpenModal2Fa] = useState(false);

  const [selectedTab, setSelectedTab] = useState("details");
  const [url, setUrl] = useState("");
  const [sortObject, setSortObject] = useState<SortObject>({
    sortField: null,
    sortType: null,
  });

  const user = select(selectUserData);

  const { setSettingsModalByKey } = globalActions;

  const isAuction = type === "auction";
  const FREE = item?.default_price?.value === 0 && !item?.is_sold_out;
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);
  const endedAuction =
    moment(item?.finish_datetime).utc().diff(moment().utc()) < 0;

  const tabs = ["details", isAuction ? "bids" : "community sales"];
  const { resetAuth } = storeActions;
  const id = type === "trade" ? item?.fk_nft_id : itemId;

  const handleChangeTab = (item: string) => setSelectedTab(item);

  const handleChangeSort = (val: string) => {
    const callbackChange = (v: SortObject) => setSortObject(v);
    changeSortObject(val, sortObject, callbackChange);
  };

  const { items, handleNext, hasMore } = useInfinitePagination({
    query: getTradeHistory,
    selectData: selectTradeHistoryItem,
    resetFunc: resetAuth,
    id,
    url,
    perPage: 20,
    type: type === "item" ? "item" : "nft",
    isFetch: type !== "auction" && selectedTab === "community sales",
  });

  const handleClose = () => {
    setOpenModal2Fa(false);
  };

  const handleOkModal = () => {
    setOpenModal2Fa(false);

    if (!user?.is_phone_verified) {
      dispatch(setSettingsModalByKey(GlobalModals.phone));
      return;
    }

    dispatch(setSettingsModalByKey(GlobalModals.totp));
  };

  const handleWithdraw = () => {
    if (!user?.is_totp_active) {
      setOpenModal2Fa(true);
      return;
    }

    setOpenModalWithdraw(true);
  };

  useEffect(() => {
    setUrl(
      sortObject.sortField && sortObject.sortType
        ? `&${sortObject.sortField}=${sortObject.sortType}`
        : ""
    );
  }, [sortObject]);

  useEffect(() => {
    dispatch(resetAuth());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className={s.container}>
      <div className={s.img}>
        <LogoCard
          item={item}
          disabled={item.is_sold_out}
          free={FREE && !isAuction}
          onLoadPlay={isMobile}
          hideTime
        />

        {isAuction && (
          <div className={s.timerWrap}>
            <p className={s.label}>{endedAuction ? "ended" : "ends in"}</p>
            {endedAuction ? (
              <div className={s.timer}>
                {moment(item?.finish_datetime)
                  .utc()
                  .format("DD.MM.YYYY HH:mm:ss")}
              </div>
            ) : (
              <Timer className={s.timer} lastDate={item?.finish_datetime} />
            )}
          </div>
        )}
      </div>

      <div className={s.detail}>
        <HeaderItemCard
          item={item}
          name={name}
          type={type}
          free={FREE}
          setPrice={setPrice}
          userId={userId}
          endedAuction={endedAuction}
          handleOnBuyClick={handleOnBuyClick}
          setOpenModalEditTrade={setOpenModalEditTrade}
          setOpenModalTrade={setOpenModalTrade}
          handleWithdraw={type === "nft" ? handleWithdraw : undefined}
        />
        <div className={s.tabs}>
          <CustomTabs
            tabs={tabs}
            selectTab={selectedTab}
            onChange={(e) => handleChangeTab(e)}
            className={s.tabs}
            name="itemDetailCard"
          />
          {selectedTab === "details" && (
            <DetailInfo
              item={item}
              name={name}
              userId={userId}
              isAuction={isAuction}
              endedAuction={endedAuction}
              hasOnBuyClick={!!handleOnBuyClick}
              setOpenModalCopies={setOpenModalCopies}
            />
          )}
          {selectedTab === "community sales" && (
            <div className={s.communitySalesWrapper}>
              <CommunitySalesTable
                data={items}
                handleNext={handleNext}
                hasMore={hasMore}
                sortObject={sortObject}
                handleChangeSort={handleChangeSort}
              />
            </div>
          )}
          {selectedTab === "bids" && (
            <div className={s.bidsWrap}>
              <BidsTable id={item?.id} />
            </div>
          )}
        </div>
      </div>

      {isOpenModal2Fa && (
        <ItemBoughtErrorModal
          error={
            !user?.is_phone_verified
              ? errors.NO_VERIFY_PHONE
              : errors.NO_VERIFY_TOTP
          }
          text={
            !user?.is_phone_verified
              ? "To withdraw NFT, verify your phone number with the code from message"
              : "To withdraw NFT, you must set up 2-F authentication for your account"
          }
          onCancelClick={handleClose}
          onBuyClick={handleOkModal}
        />
      )}

      {isOpenModalCopies && (
        <ObtaInedCopiesModal
          item={item}
          name={name}
          userId={userId}
          onClose={setOpenModalCopies}
        />
      )}

      {isOpenModalTrade && (
        <TradeStepsModal
          onClose={() => setOpenModalTrade(false)}
          item={item}
          userId={userId}
        />
      )}

      {isOpenModalEditTrade && (
        <TradeEditModal
          onClose={() => setOpenModalEditTrade(false)}
          item={item}
          userId={userId}
        />
      )}

      {isOpenModalWithdraw && (
        <WithdrawItemModal
          onClose={() => setOpenModalWithdraw(false)}
          item={item}
          userId={userId}
        />
      )}
    </div>
  );
};
