import { useRouter } from "next/router";
import React, { useReducer } from "react";
import {
  CardModal,
  FeaturesCardList,
  ItemBoughtErrorModal,
  MainLayout,
  Modal,
  WelcomeModal,
} from "../../components";

import { CardsContainer, Meta } from "../../container";

import {
  useActionElement,
  useInfinitePagination,
  useRedux,
  useStringifyFilters,
} from "../../hooks";

import {
  getChronicleTradeAsync,
  selectBalance,
  selectChronicleTrade,
  selectChronicleTradeStatus,
  selectUserData,
  tradeActions,
  TypeTrade,
} from "../../redux";
import { BalanceCurrency, User } from "../../types";
import { initialComponentState, reducer } from "../../reducers";
import s from "./Trade.module.scss";
import { transformPrice } from "../../helpers";
import { errors } from "../../constants";
import { ITEM_DUPLICATE } from "../../components/modals/ItemBoughtErrorModal/data";

const Trade = () => {
  const [select, dispatch] = useRedux();
  const { push } = useRouter();
  const [data, dispatchComponent] = useReducer(reducer, initialComponentState);

  const { setError, resetTrade } = tradeActions;
  const balance = select(selectBalance);
  const user: User = select(selectUserData);
  const { error, loading }: Partial<TypeTrade> = select(
    selectChronicleTradeStatus
  );

  const { url } = useStringifyFilters({ data });

  const {
    itemForBuy,
    modalsState,
    handleBuyClick,
    handleSelectItem,
    handleAllCancel,
    onBuyAnywayClick,
    buyWithWallet,
  } = useActionElement({ type: "Offer" });

  const {
    items: chronicleTrade,
    handleNext,
    hasMore,
  } = useInfinitePagination({
    query: getChronicleTradeAsync,
    selectData: selectChronicleTrade,
    resetFunc: resetTrade,
    perPage: 15,
    url,
  });

  const handleOnCardClick = (id: string) => push(`/trade/nft/${id}`);

  const handleCloseWarningModal = () => {
    dispatch(setError(null));
  };

  return (
    <div className={s.container}>
      <Meta title="Chronicle | Trade" />

      <div className={s.banner}>
        <h2 className={s.title}>
          welcome <br />
          to the marketplace
        </h2>
      </div>
      <CardsContainer
        header="Marketplace"
        dispatchComponent={dispatchComponent}
      >
        <FeaturesCardList
          handleNext={handleNext}
          hasMore={hasMore}
          userId={user.id}
          data={chronicleTrade ?? []}
          handleSelectItem={handleSelectItem}
          handleOnCardClick={handleOnCardClick}
          clickById
          loading={loading}
          noItemsTitle="There is nothing in the marketplace yet"
          noItemsDesc="You can be the first who will make a propose"
        />
      </CardsContainer>

      {modalsState.info && !error && (
        <Modal isCloseBtnHidden={true}>
          <CardModal
            data={itemForBuy}
            onClose={handleAllCancel}
            handleBuy={handleBuyClick}
            userId={user.id}
            type="trade"
          />
        </Modal>
      )}

      {error && error !== errors.CONFIRM_OFFERS && (
        <ItemBoughtErrorModal
          error={error}
          onCancelClick={handleCloseWarningModal}
        />
      )}

      {modalsState.duplicate && (
        <ItemBoughtErrorModal
          error={ITEM_DUPLICATE}
          onCancelClick={handleAllCancel}
          onBuyClick={onBuyAnywayClick}
        />
      )}

      {error === "Unauthorized" && (
        <Modal onClose={handleCloseWarningModal}>
          <WelcomeModal />
        </Modal>
      )}

      {modalsState.buy && (
        <ItemBoughtErrorModal
          text={
            <>
              You are now depositing{" "}
              <span className={itemForBuy?.default_price?.currency}>
                {itemForBuy?.default_price?.currency}
              </span>{" "}
              {transformPrice(itemForBuy?.default_price?.value)} for this
              purchase from your Chronicle wallet. Your current balance is{" "}
              <span className={itemForBuy?.default_price?.currency}>
                {itemForBuy?.default_price?.currency}
              </span>{" "}
              {transformPrice(
                balance[itemForBuy?.default_price?.currency as BalanceCurrency]
              )}
              . Are you sure you want to continue?
            </>
          }
          error={errors.CONFIRM_OFFERS}
          onCancelClick={handleAllCancel}
          onBuyClick={buyWithWallet}
          loading={loading}
        />
      )}
    </div>
  );
};

Trade.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default Trade;
