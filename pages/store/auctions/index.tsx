import { useEffect, useReducer, useState } from "react";
import {
  useActionElement,
  useInfinitePagination,
  useRedux,
  useStringifyFilters,
} from "../../../hooks";
import {
  getChronicleStoreAsync,
  selectBalance,
  selectBoughtError,
  selectChronicleStore,
  selectInfoMessage,
  selectLoading,
  selectUserData,
  storeActions,
} from "../../../redux";
import {
  CardModal,
  ItemBoughtErrorModal,
  MainLayout,
  Modal,
  AuctionCardList,
} from "../../../components";
import { CardsContainer, Meta } from "../../../container";
import { initialComponentState, reducer } from "../../../reducers";
import { BalanceCurrency, User } from "../../../types";
import { errors, infoMessages } from "../../../constants";
import { useRouter } from "next/router";
import {
  EMAIL_NOT_VERIFIED,
  FREE_NFT_DUPLICATE,
  NO_AVALIBLE_NFTS,
  PAYMENT_ERROR,
  TOP_BIDDER,
  VERIFY_REGISTER,
} from "../../../components/modals/ItemBoughtErrorModal/data";
import { transformPrice } from "../../../helpers";
import s from "./Auction.module.scss";

export const storeTabs = ["Chronicle store", "live Auctions"];

const Auctions = () => {
  const [select, dispatch] = useRedux();
  const { push } = useRouter();

  const { removeInfoMessage, setError, setLoading, resetChronicleStore } =
    storeActions;

  const loading = select(selectLoading);
  const infoMessage = select(selectInfoMessage);
  const balance = select(selectBalance);
  const user: User = select(selectUserData);

  const [price, setPrice] = useState(0);

  const [data, dispatchComponent] = useReducer(reducer, initialComponentState);

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
    url: `${url}&status=active`,
    type: "auction",
  });

  const {
    itemForBuy,
    modalsState,
    handleBuyClick,
    handleAllCancel,
    handleSelectItem,
    handleCloseWarningModal,
    handleClosePayError,
    handleRetry,
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

  return (
    <div className={s.container}>
      <Meta title="Chronicle | Auctions" />
      <div className={s.chronicleStore}>
        <CardsContainer
          header="Live Auctions"
          dispatchComponent={dispatchComponent}
          hideCurrency
        >
          <AuctionCardList
            userId={user.id}
            data={chronicleStore || []}
            handleSelectItem={handleSelectItem}
            handleOnCardClick={handleOnCardClick}
            handleRefetch={handleRefetch}
            handleNext={handleNext}
            hasMore={hasMore}
            loading={infoMessage.some(
              (el) => el === infoMessages.LOADING_AUCTIONS
            )}
          />
        </CardsContainer>
      </div>
      {modalsState.info && itemForBuy && !error && (
        <Modal isCloseBtnHidden={true}>
          <CardModal
            data={itemForBuy}
            onClose={handleAllCancel}
            handleBuy={handleBuyClick}
            userId={user.id}
            setPrice={setPrice}
          />
        </Modal>
      )}

      {(error === EMAIL_NOT_VERIFIED ||
        error === NO_AVALIBLE_NFTS ||
        error === VERIFY_REGISTER ||
        error === TOP_BIDDER ||
        error === FREE_NFT_DUPLICATE) && (
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

Auctions.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default Auctions;
