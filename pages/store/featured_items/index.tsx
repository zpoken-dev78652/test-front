import { Meta } from "../../../container";
import { getFeaturedItemsAsync, selectFeauteredItems } from "../../../redux";
import {
  useActionElement,
  useInfinitePagination,
  useRedux,
  useStringifyFilters,
} from "../../../hooks";
import {
  selectBoughtError,
  selectInfoMessage,
  selectUserData,
  storeActions,
} from "../../../redux";
import {
  CardModal,
  ConfirmBoughtModal,
  FeaturesCardList,
  ItemBoughtErrorModal,
  MainLayout,
  Modal,
} from "../../../components";
import { CardsContainer } from "../../../container";
import { initialComponentState, reducer } from "../../../reducers";
import { User } from "../../../types";
import { infoMessages } from "../../../constants";
import { useRouter } from "next/router";
import {
  EMAIL_NOT_VERIFIED,
  FREE_NFT_DUPLICATE,
  ITEM_DUPLICATE,
  NO_AVALIBLE_NFTS,
  PAYMENT_ERROR,
  TOP_BIDDER,
  VERIFY_REGISTER,
} from "../../../components/modals/ItemBoughtErrorModal/data";
import { useReducer } from "react";
import s from "./FeaturedItems.module.scss";

const FeaturedItems = () => {
  const [select] = useRedux();
  const { push } = useRouter();
  const { resetAuth } = storeActions;

  const infoMessage = select(selectInfoMessage);
  const user: User = select(selectUserData);

  const [data, dispatchComponent] = useReducer(reducer, initialComponentState);

  const { url } = useStringifyFilters({ data });

  const {
    items: chronicleStore,
    handleNext,
    hasMore,
  } = useInfinitePagination({
    query: getFeaturedItemsAsync,
    selectData: selectFeauteredItems,
    resetFunc: resetAuth,
    perPage: 20,
    url,
  });

  const {
    itemForBuy,
    card,
    modalsState,
    waitingPayment,
    buyWithStripe,
    buyWithWallet,
    setCard,
    handleBuyClick,
    onBuyAnywayClick,
    handleSelectItem,
    handleAllCancel,
    handleClosePayError,
    handleRetry,
    handleCloseWarningModal,
  } = useActionElement({ type: "Item" });

  const error: string | null = select(selectBoughtError);

  const handleOnCardClick = (id: string) => {
    push(`/store/item/${id}`);
  };

  return (
    <div className={s.container}>
      <Meta title={"Chronicle | All Featured"} />

      <div className={s.chronicleStore}>
        <CardsContainer
          header="Featured items"
          dispatchComponent={dispatchComponent}
          hideCurrency
        >
          <FeaturesCardList
            userId={user.id}
            data={chronicleStore ?? []}
            handleSelectItem={handleSelectItem}
            handleOnCardClick={handleOnCardClick}
            loading={infoMessage.some(
              (el) => el === infoMessages.LOADING_FEATURED_ITEMS
            )}
            handleNext={handleNext}
            hasMore={hasMore}
          />
        </CardsContainer>
      </div>
      {modalsState.info && !error && (
        <Modal isCloseBtnHidden={true}>
          <CardModal
            data={itemForBuy}
            onClose={handleAllCancel}
            handleBuy={handleBuyClick}
            userId={user.id}
          />
        </Modal>
      )}
      {modalsState.duplicate && (
        <ItemBoughtErrorModal
          error={ITEM_DUPLICATE}
          onCancelClick={handleAllCancel}
          onBuyClick={onBuyAnywayClick}
        />
      )}

      {modalsState.buy && (
        <Modal isCloseBtnHidden={true}>
          <ConfirmBoughtModal
            item={itemForBuy}
            handleCard={setCard}
            handleNevermindClick={handleAllCancel}
            buyWithStripe={buyWithStripe}
            buyWithWallet={buyWithWallet}
            waitingPayment={waitingPayment}
            card={card}
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
    </div>
  );
};

FeaturedItems.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default FeaturedItems;
