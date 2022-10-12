import { useEffect, useState } from "react";
import {
  useActionElement,
  useInfinitePagination,
  useMediaQuery,
  useRedux,
} from "../../hooks";
import {
  getCollections,
  getFeaturedItemsAsync,
  getTopAuctionsAsync,
  selectBalance,
  selectBoughtError,
  selectChronicleStore,
  selectCollectionsItem,
  selectFeauteredItems,
  selectInfoMessage,
  selectLoading,
  selectUserData,
  storeActions,
} from "../../redux";
import {
  CardModal,
  CustomButton,
  ItemBoughtErrorModal,
  MainLayout,
  Modal,
  Carousel,
  AuctionCardList,
  AllCollectionCardList,
  TopFeauteredItems,
} from "../../components";

import { Meta, MysteryBoxesStore } from "../../container";
import { BalanceCurrency, MysteryBox, User } from "../../types";
import { errors, infoMessages, mobileWidth, Routes } from "../../constants";
import { useRouter } from "next/router";
import {
  EMAIL_NOT_VERIFIED,
  NO_AVALIBLE_NFTS,
  PAYMENT_ERROR,
  TOP_BIDDER,
  VERIFY_REGISTER,
} from "../../components/modals/ItemBoughtErrorModal/data";
import { api, URLS } from "../../api";
import { ArrowRightIcon } from "../../components/Icons";
import { transformPrice } from "../../helpers";
import s from "./Store.module.scss";

export const getServerSideProps = async () => {
  try {
    const res = await api.get(`${URLS.carousels}`);
    const commonMysteryBoxes = await api.get(
      `${URLS.mysteryBoxes}?page_size=10&page_number=1&type=common`
    );
    const uniqueMysteryBoxes = await api.get(
      `${URLS.mysteryBoxes}?page_size=10&page_number=1&type=unique`
    );

    const mysteryBoxes = [
      ...(commonMysteryBoxes?.data?.data ? commonMysteryBoxes?.data?.data : []),
      ...(uniqueMysteryBoxes?.data?.data ? uniqueMysteryBoxes?.data?.data : []),
    ];

    return {
      props: {
        slides: res?.data?.carousels || [],
        mysteryBoxes,
      },
    };
  } catch (error: any) {
    return {
      props: { slides: [], mysteryBoxes: [] },
    };
  }
};

type StoreProps = {
  slides: any;
  mysteryBoxes: MysteryBox[];
};

const Store = ({ slides, mysteryBoxes }: StoreProps) => {
  const [select, dispatch] = useRedux();
  const { push } = useRouter();

  const { removeInfoMessage, resetAuth } = storeActions;

  const loading = select(selectLoading);
  const infoMessage = select(selectInfoMessage);
  const balance = select(selectBalance);
  const user: User = select(selectUserData);

  const { data } = select(selectChronicleStore);
  const { data: feautered } = select(selectFeauteredItems);

  const [price, setPrice] = useState(0);
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);
  const isSmallLaptop: boolean = useMediaQuery(`(max-width: ${1289}px)`);
  const isBigTablet: boolean = useMediaQuery(`(max-width: ${1039}px)`);
  const isSmallTablet: boolean = useMediaQuery(`(max-width: ${749}px)`);

  const countAuc = useMediaQuery(`(max-width: ${519}px)`)
    ? 5
    : isSmallTablet
    ? 4
    : isBigTablet
    ? 3
    : isSmallLaptop
    ? 4
    : 5;

  const {
    items: collections,
    handleNext,
    hasMore,
  } = useInfinitePagination({
    query: getCollections,
    selectData: selectCollectionsItem,
    resetFunc: resetAuth,
    perPage: 8,
  });

  const {
    itemForBuy,
    modalsState,
    handleBuyClick,
    handleAllCancel,
    handleSelectItem,
    handleClosePayError,
    handleRetry,
    handleCloseWarningModal,
  } = useActionElement({
    type: "Auction",
  });

  const error: string | null = select(selectBoughtError);

  const handleOnCardClick = (id: string) => {
    push(`/store/auctions/${id}`);
  };

  useEffect(() => {
    if (infoMessage.some((el) => el === "bid created") && itemForBuy?.id) {
      handleAllCancel();
      dispatch(removeInfoMessage("full"));
      push({
        pathname: `/store/auctions/${itemForBuy?.id}`,
        query: { tab: "bids" },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoMessage, itemForBuy]);

  const handleFetchTopAuction = () => {
    dispatch(getTopAuctionsAsync({}));
  };

  useEffect(() => {
    handleFetchTopAuction();
    dispatch(getFeaturedItemsAsync({ url: "", page: 1, perPage: 5 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={s.container}>
      <Meta title="Chronicle | Store" />

      <div className={s.slider}>
        {slides.length && <Carousel slides={slides} />}
      </div>
      <div className={s.chronicleStore}>
        {data.length > 0 && (
          <div className={s.content}>
            <div className={s.header}>
              <h2 className={s.title}>New Auctions</h2>
              {!isMobile && (
                <CustomButton
                  value="all auctions"
                  theme="transparent"
                  className={s.btn}
                  icon={<ArrowRightIcon />}
                  linkTo={Routes.AUCTIONS}
                />
              )}
            </div>
            <AuctionCardList
              userId={user.id}
              loading={infoMessage.some(
                (el) => el === infoMessages.LOADING_AUCTIONS
              )}
              handleNext={() => {}}
              data={data.slice(0, countAuc) || []}
              hasMore={false}
              handleSelectItem={handleSelectItem}
              handleOnCardClick={handleOnCardClick}
              handleRefetch={handleFetchTopAuction}
            />
            {isMobile && (
              <CustomButton
                value="all auctions"
                theme="transparent"
                className={s.btn}
                icon={<ArrowRightIcon />}
                linkTo={Routes.AUCTIONS}
              />
            )}
          </div>
        )}

        {feautered.length > 0 && (
          <div className={s.content}>
            <TopFeauteredItems maxItems={countAuc} />
          </div>
        )}

        {mysteryBoxes.length > 0 && (
          <MysteryBoxesStore mysteryBoxes={mysteryBoxes} />
        )}

        {collections.length > 0 && (
          <div className={s.content}>
            <div className={s.header}>
              <h2 className={s.title}>Chronicle Store</h2>
            </div>
            <AllCollectionCardList
              data={collections}
              handleNext={handleNext}
              hasMore={hasMore}
              loading={infoMessage.some(
                (el) => el === infoMessages.LOADING_COLLECTIONS
              )}
            />
          </div>
        )}
      </div>
      {modalsState?.info && !error && (
        <Modal isCloseBtnHidden={true}>
          <CardModal
            data={itemForBuy}
            onClose={handleAllCancel}
            handleBuy={handleBuyClick}
            userId={user.id}
            setPrice={setPrice}
            type="auction"
          />
        </Modal>
      )}

      {(error === EMAIL_NOT_VERIFIED ||
        error === NO_AVALIBLE_NFTS ||
        error === VERIFY_REGISTER ||
        error === TOP_BIDDER) && (
        <ItemBoughtErrorModal
          error={error}
          onCancelClick={handleCloseWarningModal}
        />
      )}
      {(error === PAYMENT_ERROR || error === "Your card was declined.") &&
        modalsState?.error && (
          <ItemBoughtErrorModal
            error={error}
            onCancelClick={handleClosePayError}
            onBuyClick={handleRetry}
          />
        )}

      {error === errors.WRONG_VALUE_BID && (
        <ItemBoughtErrorModal
          error={error}
          onCancelClick={handleCloseWarningModal}
          onBuyClick={() => handleBuyClick(itemForBuy, price)}
          loading={loading}
        />
      )}

      {error === errors.CONFIRM_BID && itemForBuy && (
        <ItemBoughtErrorModal
          text={
            <>
              You are now depositing{" "}
              <span className={itemForBuy?.default_price?.currency}>
                {itemForBuy?.default_price?.currency}
              </span>{" "}
              {transformPrice(price)} to the auction from your Chronicle wallet.
              Your current balance is{" "}
              <span className={itemForBuy?.default_price?.currency}>
                {itemForBuy?.default_price?.currency}
              </span>{" "}
              {balance[itemForBuy?.default_price?.currency as BalanceCurrency]}.
              Are you sure you want to continue?
            </>
          }
          error={errors.CONFIRM_BID}
          onCancelClick={handleCloseWarningModal}
          onBuyClick={() => handleBuyClick(itemForBuy, price)}
          loading={loading}
        />
      )}
    </div>
  );
};

Store.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default Store;
