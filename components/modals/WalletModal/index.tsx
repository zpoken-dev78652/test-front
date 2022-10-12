import React, { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { infoMessages } from "../../../constants";
import { useRedux } from "../../../hooks";
import {
  getOnfidoStatusAsync,
  profileActions,
  selectProfileInfoMessage,
  selectUserData,
} from "../../../redux";
import { VerticalModal } from "../VerticalModal";
import { OnfidoContent, OnfidoPandingText, Wallets } from "./componets";

import s from "./WalletModal.module.scss";

export const WalletModal = () => {
  const [select, dispatch] = useRedux();

  const user = select(selectUserData);
  const profileInfoMessage = select(selectProfileInfoMessage);

  const loading = profileInfoMessage.some(
    (info) => info === infoMessages.LOADING_ONFIDO_STATUS
  );

  const { closeAllProfileModal, setSelectWallet, setSelectTab } =
    profileActions;

  const handleCloseWalletModal = () => {
    dispatch(closeAllProfileModal());
    dispatch(setSelectWallet(""));
    dispatch(setSelectTab("deposit"));
  };

  useEffect(() => {
    if (user.onfido_status === "clear") return;
    dispatch(getOnfidoStatusAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VerticalModal onClose={handleCloseWalletModal} header="chronicle Wallet">
      {loading ? (
        <div className={s.spiner}>
          <ClipLoader color={"#fff"} size={60} />
        </div>
      ) : (
        <div className={s.walletModal}>
          {!user?.onfido_status && <OnfidoContent />}
          {user?.onfido_status && user?.onfido_status !== "clear" && (
            <OnfidoPandingText />
          )}
          {user?.onfido_status === "clear" && <Wallets />}
        </div>
      )}
    </VerticalModal>
  );
};
