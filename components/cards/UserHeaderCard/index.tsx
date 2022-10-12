/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { User } from "../../../types";
import { useEffect } from "react";
import { Modal } from "../../Modal";
import { useRedux } from "../../../hooks";
import {
  getBalanceAsync,
  globalActions,
  GlobalModals,
  logout,
  profileActions,
  selectBalance,
  selectProfileInfoMessage,
} from "../../../redux";
import Avatar from "../../../public/img/chronicle_avatar.png";
import { CustomButton, Dropdown, WithoutImageModal } from "../..";
import { transformPrice } from "../../../helpers";
import { useRouter } from "next/router";
import Image from "next/image";
import s from "./UserHeaderCard.module.scss";
import {
  ChevronDownIcon,
  CrossIcon,
  LogoutIcon,
  RefreshIcon,
} from "../../Icons";
import cn from "classnames";
import { infoMessages } from "../../../constants";

type UserHeaderCardPropsType = {
  user: User | undefined;
  handleOpenSettings: () => void;
};

export const UserHeaderCard: React.FC<UserHeaderCardPropsType> = ({
  user,
  handleOpenSettings,
}) => {
  const { pathname } = useRouter();
  const [select, dispatch] = useRedux();

  const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false);
  const [isLogoutModal, setIsLogoutModal] = useState<boolean>(false);

  const { setProfileModalByKey } = profileActions;
  const { setSettingsModalByKey } = globalActions;

  const balance = select(selectBalance);
  const profileInfoMessage = select(selectProfileInfoMessage);

  useEffect(() => {
    setIsOpenDropDown(false);
  }, [pathname]);

  const closeLogOutModal = () => setIsLogoutModal(false);

  const closeDropDown = () => {
    setIsOpenDropDown(false);
  };

  const handleLogOutBtn = () => {
    setIsOpenDropDown(false);
    setIsLogoutModal(true);
  };

  const handleLogout = () => dispatch(logout("handle button"));

  const iconClick = (e: any) => setIsOpenDropDown((state) => !state);

  const handleClickWalletPopup = () => {
    setIsOpenDropDown(false);
    dispatch(setProfileModalByKey("wallet"));
  };

  const handleSettingsOpen = () => {
    setIsOpenDropDown(false);
    handleOpenSettings();
  };

  const refreshBalance = () => {
    dispatch(getBalanceAsync());
  };

  const handleOpenNftHistory = () => {
    setIsOpenDropDown(false);
    dispatch(setSettingsModalByKey(GlobalModals.nftWithdrawHistory));
  };

  return (
    <>
      <div className={s.content}>
        {balance.isFeatched && (
          <div className={s.balance}>
            {!balance.noWallet ? (
              <>
                <div className={s.wallet}>
                  <span className={`${s.currency} USDC`}>USDC</span>
                  <span className={s.value}>
                    {transformPrice(balance?.USDC)}
                  </span>
                </div>
                <div className={s.wallet}>
                  <span className={`${s.currency} XNL`}>XNL</span>
                  <span className={s.value}>{transformPrice(balance.XNL)}</span>
                </div>
                <div
                  className={cn(s.refreshWrap, {
                    [s.loading]: profileInfoMessage.some(
                      (el) => el === infoMessages.LOADING_BALANCE
                    ),
                  })}
                  onClick={refreshBalance}
                  id="refresh_balance"
                >
                  <RefreshIcon size={12} />
                </div>
              </>
            ) : (
              <CustomButton
                theme="link"
                value="Set up wallet"
                className={s.btn}
                onClick={handleClickWalletPopup}
              />
            )}
          </div>
        )}
        <div className={s.avatar}>
          <Image src={user?.logo || Avatar} width="100%" height="100%" />
        </div>
        <div onClick={iconClick} className={s.dropdownBtn}>
          <ChevronDownIcon className={cn({ [s.rotate]: isOpenDropDown })} />
        </div>
        {isOpenDropDown && (
          <div className={s.dropDown}>
            <Dropdown
              user={user}
              closeDropDown={closeDropDown}
              handleLogOutBtn={handleLogOutBtn}
              handleClickWalletPopup={handleClickWalletPopup}
              handleOpenSettings={handleSettingsOpen}
              handleOpenNftHistory={handleOpenNftHistory}
              balance={balance}
            />
          </div>
        )}
      </div>
      {isLogoutModal && (
        <Modal onClose={closeDropDown} isCloseBtnHidden={true}>
          <WithoutImageModal
            header="Are you sure you want to log out?"
            text="You won't be able to buy or sell items, nor receive notifications, until you sign back into your account."
          >
            <div className={s.buttons}>
              <CustomButton
                theme="red"
                icon={<LogoutIcon />}
                value="log out"
                onClick={() => handleLogout()}
              />
              <CustomButton
                theme="violet"
                icon={<CrossIcon />}
                value="stay logged in"
                onClick={closeLogOutModal}
              />
            </div>
          </WithoutImageModal>
        </Modal>
      )}
    </>
  );
};
