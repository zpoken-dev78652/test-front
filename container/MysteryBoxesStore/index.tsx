import React from "react";
import {
  ConfirmBoughtModal,
  ItemBoughtErrorModal,
  Modal,
  MysteryBoxeCard,
} from "../../components";
import { PAYMENT_ERROR } from "../../components/modals/ItemBoughtErrorModal/data";
import { useActionElement, useRedux } from "../../hooks";
import { selectBoughtError } from "../../redux";

import { MysteryBox } from "../../types";
import s from "./MysteryBoxesStore.module.scss";

type MysteryBoxesStoreProps = {
  mysteryBoxes: MysteryBox[];
};

export const MysteryBoxesStore: React.FC<MysteryBoxesStoreProps> = ({
  mysteryBoxes,
}) => {
  const [select] = useRedux();
  const error = select(selectBoughtError);

  const {
    itemForBuy,
    card,
    modalsState,
    waitingPayment,
    buyWithWallet,
    setCard,
    handleBuyClick,
    buyWithStripe,
    handleClosePayError,
    handleAllCancel,
    handleRetry,
  } = useActionElement({ type: "MysteryBox" });

  return (
    <>
      {mysteryBoxes.length && (
        <div className={s.content}>
          <div className={s.banner}>
            <h2 className={s.banner__subTitle}>
              Can&apos;t decide? — Let the chance decide for you!
            </h2>
            <p className={s.banner__title}>
              introducing <span className={s.gradient}>Mystery boxes</span>
            </p>
          </div>

          <div className={s.mysteryBoxeWrapper}>
            {mysteryBoxes.map((el) => (
              <MysteryBoxeCard
                data={el}
                key={el.id}
                handleBuyClick={handleBuyClick}
              />
            ))}
          </div>
        </div>
      )}
      {itemForBuy && modalsState?.buy && (
        <Modal isCloseBtnHidden={true}>
          <ConfirmBoughtModal
            item={itemForBuy}
            handleCard={setCard}
            handleNevermindClick={handleAllCancel}
            buyWithStripe={buyWithStripe}
            buyWithWallet={buyWithWallet}
            waitingPayment={waitingPayment}
            card={card}
            type="MysteryBox"
          />
        </Modal>
      )}

      {(error === PAYMENT_ERROR || error === "Your card was declined.") &&
        modalsState?.error && (
          <ItemBoughtErrorModal
            error={error}
            onCancelClick={handleClosePayError}
            onBuyClick={handleRetry}
          />
        )}
    </>
  );
};
