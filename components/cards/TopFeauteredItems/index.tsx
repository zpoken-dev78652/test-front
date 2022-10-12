import { useRouter } from "next/router";
import React, { FC } from "react";
import {
  CardModal,
  ConfirmBoughtModal,
  ItemBoughtErrorModal,
  Modal,
} from "../..";
import { infoMessages, mobileWidth, Routes } from "../../../constants";
import { useActionElement, useMediaQuery, useRedux } from "../../../hooks";
import {
  selectBoughtError,
  selectFeauteredItems,
  selectInfoMessage,
  selectUserData,
} from "../../../redux";
import { CustomButton } from "../../CustomButton";
import { ArrowRightIcon } from "../../Icons";
import {
  EMAIL_NOT_VERIFIED,
  FREE_NFT_DUPLICATE,
  ITEM_DUPLICATE,
  NO_AVALIBLE_NFTS,
  PAYMENT_ERROR,
  TOP_BIDDER,
  VERIFY_REGISTER,
} from "../../modals/ItemBoughtErrorModal/data";
import { FeaturesCardList } from "../FeaturesCardList";

import s from "./TopFeauteredItems.module.scss";

type TopFeauteredItemsProps = {
  maxItems: number;
};

export const TopFeauteredItems: FC<TopFeauteredItemsProps> = ({ maxItems }) => {
  const [select] = useRedux();
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);
  const { push } = useRouter();

  const user = select(selectUserData);
  const { data } = select(selectFeauteredItems);
  const infoMessage = select(selectInfoMessage);
  const error = select(selectBoughtError);

  const {
    itemForBuy,
    card,
    modalsState,
    waitingPayment,
    buyWithWallet,
    setCard,
    handleBuyClick,
    onBuyAnywayClick,
    buyWithStripe,
    handleSelectItem,
    handleAllCancel,
    handleRetry,
    handleClosePayError,
    handleCloseWarningModal,
  } = useActionElement({ type: "Item" });

  const handleOnCardClick = (id: string) => {
    push(`/store/item/${id}`);
  };

  return (
    <div className={s.content}>
      <div className={s.header}>
        <h2 className={s.title}>Featured items</h2>
        {!isMobile && (
          <CustomButton
            value="All featured items"
            theme="transparent"
            className={s.btn}
            icon={<ArrowRightIcon />}
            linkTo={Routes.FEATURED_ITEMS}
          />
        )}
      </div>
      <FeaturesCardList
        userId={user.id}
        data={data.slice(0, maxItems) ?? []}
        handleSelectItem={handleSelectItem}
        handleOnCardClick={handleOnCardClick}
        loading={infoMessage.some(
          (el) => el === infoMessages.LOADING_COLLECTIONS_BY_ID
        )}
        handleNext={() => {}}
        hasMore={false}
      />
      {isMobile && (
        <CustomButton
          value="All featured items"
          theme="transparent"
          className={s.btn}
          icon={<ArrowRightIcon />}
          linkTo={Routes.FEATURED_ITEMS}
        />
      )}

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
