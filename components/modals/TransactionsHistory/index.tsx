import React, { FC } from "react";
import { useRedux } from "../../../hooks";
import { globalActions, profileActions } from "../../../redux";
import { BalanceCurrency } from "../../../types";
import { HistoryTable } from "../../Tables/HistoryTable";
import { VerticalModal } from "../VerticalModal";

import s from "./TransactionsHistory.module.scss";

type TransactionsHistoryProps = {
  currency: BalanceCurrency;
  type?: "nft" | "wallet";
};

export const TransactionsHistory: FC<TransactionsHistoryProps> = ({
  currency,
  type = "wallet",
}) => {
  const [_, dispatch] = useRedux();

  const {
    closeAllProfileModal,
    setSelectWallet,
    setSelectTab,
    setProfileModalByKey,
  } = profileActions;

  const { closeAllSettingsModal } = globalActions;

  const handleBack = () => {
    dispatch(setProfileModalByKey("wallet"));
  };

  const handleCloseWalletModal = () => {
    dispatch(closeAllProfileModal());
    dispatch(closeAllSettingsModal());
    dispatch(setSelectWallet(""));
    dispatch(setSelectTab("deposit"));
  };

  return (
    <VerticalModal
      header={
        type === "wallet"
          ? "XNL TRANSACTIONS HISTORY"
          : "NFT TRANSFEROUT HISTORY"
      }
      onClose={handleCloseWalletModal}
      handleBack={type === "wallet" ? handleBack : undefined}
      isCloseBtnHidden={type === "wallet"}
    >
      <div className={s.wrapperTable}>
        <HistoryTable currency={currency} type={type} />
      </div>
    </VerticalModal>
  );
};
