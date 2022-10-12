import { ReactNode, useEffect, useState } from "react";
import cn from "classnames";
import { Footer, HeaderContainer } from "../../../container";
import {
  authActions,
  getBalanceAsync,
  globalActions,
  GlobalModals,
  logout,
  profileActions,
  selectAuthError,
  selectBoughtChronicleById,
  selectBoughtError,
  selectBoughtTradeById,
  selectGlobal,
  selectProfileError,
  selectProfileModalsInfo,
  selectSettingsModal,
  selectUserData,
  storeActions,
} from "../../../redux";
import { useMediaQuery, useRedux } from "../../../hooks";
import { useRouter } from "next/router";
import { errors, mobileWidth, Routes } from "../../../constants";
import {
  ItemBoughtErrorModal,
  Preloader,
  VerifyPhoneModal,
  VerifyTotpModal,
  TotpModal,
  PersonalSettingsModal,
  WalletModal,
  TopUpUsdcWithFiat,
} from "../..";
import { Modal } from "../../Modal";
import { WelcomeModal } from "../../modals/WelcomeModal";
import s from "./MainLayout.module.scss";
import { WithdrawUsdcToFiat } from "../../modals/WithdrawUsdcToFiat";
import { TransactionsHistory } from "../../modals/TransactionsHistory";
import { BalanceCurrency } from "../../../types";

type Props = {
  children: ReactNode;
  title?: string;
  noSpaceBottom?: boolean;
};

export const MainLayout = ({ children, noSpaceBottom }: Props) => {
  const [select, dispatch] = useRedux();
  const { pathname, push } = useRouter();
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);

  const authError = select(selectAuthError);
  const user = select(selectUserData);
  const profileError = select(selectProfileError);
  const openVerifyModal = select(selectSettingsModal);
  const profileModals = select(selectProfileModalsInfo);

  const boughtError: string | null = select(selectBoughtError);
  const { openMenu, fetchingGlobal } = select(selectGlobal);

  const { setError } = authActions;
  const { setError: setErrorProfile } = profileActions;

  const { setError: setErrorStore } = storeActions;
  const { setSettingsModalByKey, setSettingsModas, closeAllSettingsModal } =
    globalActions;

  const isNotFooter = pathname === Routes.REVIEW;

  const boughtItem = select(selectBoughtChronicleById);
  const boughtItemTrade = select(selectBoughtTradeById);

  useEffect(() => {
    if (localStorage.getItem("user") && user?.isAuth) {
      dispatch(getBalanceAsync());
    }

    if (!boughtItem && !boughtItemTrade) return;

    push({
      pathname: Routes.REVIEW,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boughtItem, boughtItemTrade, user?.isAuth]);

  useEffect(() => {
    const userJson = localStorage.getItem("user");

    if (!userJson) {
      dispatch(logout("not user in main layout", true));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authError === "logout success") {
      dispatch(setError(""));
      push(Routes.LOGIN);
    }
  }, [authError, dispatch, push, setError]);

  const handleClose = () => {
    dispatch(setErrorProfile(""));
  };

  const handleVerifyModalByKey = (key: GlobalModals) => {
    dispatch(setSettingsModalByKey(key));
  };

  const handleFullModalsClose = () => {
    dispatch(setErrorProfile(""));
    dispatch(setErrorStore(""));
  };

  const handleOkWelcomeModal = () => {
    dispatch(setErrorProfile(""));

    dispatch(
      setSettingsModas({
        phone: !user?.is_phone_verified,
        totp: user?.is_phone_verified && !user?.is_totp_active,
      })
    );
  };

  const handleCloseVerifyModal = () => {
    handleClose();
    dispatch(closeAllSettingsModal());
  };

  const handleOkModal = () => {
    if (boughtError === errors.NO_VERIFY_PHONE) {
      handleVerifyModalByKey(GlobalModals.phone);
      handleFullModalsClose();
      return;
    }
  };

  useEffect(() => {
    if (profileError === errors.NO_VERIFY_PS) {
      handleOkWelcomeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileError]);

  const handleCloseNotAuthModal = () => dispatch(setErrorStore(null));

  const fullClose =
    profileError === errors.PAYMENT_METHOD_DECLINED ||
    profileError === errors.NO_LOCATION_ONFIDO;

  return (
    <div
      className={cn([s.container], {
        [s.openMenu]: openMenu,
        [s.noSpace]: noSpaceBottom,
      })}
    >
      <div className={s.header}>
        <HeaderContainer
          handleOpenSettings={() =>
            dispatch(setSettingsModalByKey(GlobalModals.profile))
          }
        />
      </div>
      <div className={cn([s.content], { [s.noFooter]: isNotFooter })}>
        {children}
      </div>
      {!isNotFooter && (
        <div className={s.footer}>
          <Footer />
        </div>
      )}
      {fetchingGlobal && <Preloader />}
      {(profileError === errors.LIMIT_OF_TOP_UPS ||
        profileError === errors.PAYMENT_METHOD_DECLINED ||
        profileError === errors.NO_LOCATION_ONFIDO) && (
        <ItemBoughtErrorModal
          error={profileError}
          onCancelClick={fullClose ? handleFullModalsClose : handleClose}
        />
      )}
      {boughtError === errors.NO_VERIFY_PHONE && (
        <ItemBoughtErrorModal
          error={boughtError}
          onCancelClick={handleFullModalsClose}
          onBuyClick={handleOkModal}
        />
      )}
      {profileError === errors.NO_TWO_FA && (
        <TotpModal handleOk={handleOkWelcomeModal} handleSkip={handleClose} />
      )}

      {openVerifyModal.phone && (
        <VerifyPhoneModal handleClose={handleCloseVerifyModal} />
      )}

      {openVerifyModal.totp && (
        <VerifyTotpModal handleClose={handleCloseVerifyModal} />
      )}

      {openVerifyModal.profile && (
        <PersonalSettingsModal
          handleClose={() => dispatch(closeAllSettingsModal())}
        />
      )}

      {profileModals?.wallet && <WalletModal />}
      {profileModals?.deposit && <TopUpUsdcWithFiat />}
      {profileModals?.withdraw && <WithdrawUsdcToFiat />}
      {(profileModals?.history || openVerifyModal.nftWithdrawHistory) && (
        <TransactionsHistory
          currency={profileModals?.selectWallet as BalanceCurrency}
          type={openVerifyModal.nftWithdrawHistory ? "nft" : "wallet"}
        />
      )}

      {/* modal if You Unauthorized */}
      {boughtError === "Unauthorized" && (
        <Modal onClose={handleCloseNotAuthModal} isCloseBtnHidden={isMobile}>
          <WelcomeModal />
        </Modal>
      )}
    </div>
  );
};
