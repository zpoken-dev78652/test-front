/* eslint-disable @next/next/link-passhref */
import React, { useEffect, useState } from "react";
import cl from "classnames";
import Link from "next/link";
import { useRedux } from "../../../hooks";
import {
  globalActions,
  GlobalModals,
  logout,
  profileActions,
  selectBalance,
  selectIsAuth,
  selectUserData,
} from "../../../redux";
import { Routes } from "../../../constants";
import {
  CartIcon,
  ChevronUpIcon,
  ChronicleIcon,
  CrossIcon,
  GiftIcon,
  GridIcon,
  HourglassIcon,
  InfoCircleIcon,
  LockIcon,
  LoginIcon,
  LogoutIcon,
  SettingIcon,
  TagIcon,
} from "../../../components/Icons";
import { CustomButton, Modal, WithoutImageModal } from "../../../components";
import { transformPrice } from "../../../helpers";
import s from "./Mobile.module.scss";

const menuItemsMobile = [
  {
    icon: <CartIcon />,
    name: "New Drops",
    path: Routes.STORE,
  },
  {
    icon: <TagIcon />,
    name: "Trade",
    path: Routes.TRADE,
  },
  {
    icon: <GiftIcon />,
    name: "Redeem Code",
    path: Routes.REDEEM_CODE,
    isAuth: true,
  },
  {
    icon: <GridIcon />,
    name: "Collection",
    path: Routes.COLLECTION,
    isAuth: true,
  },
];

export const menuInfoItemsMobile = [
  {
    icon: <LockIcon />,
    name: "Privacy policy",
    path: "https://www.chronicle.io/privacy",
  },
  {
    icon: <InfoCircleIcon />,
    name: "Terms of use",
    path: "https://www.chronicle.io/terms",
  },
];

type MobileMenuPropsType = {
  type: "" | "NOTIFICATION" | "MENU";
  toogleMenu: (type: "" | "NOTIFICATION" | "MENU") => () => void;
  closeMenu: () => void;
  handleOpenSettings: () => void;
};

export const MobileMenu: React.FC<MobileMenuPropsType> = ({
  type,
  toogleMenu,
  closeMenu,
  handleOpenSettings,
}) => {
  const [select, dispatch] = useRedux();

  const [isLogoutModal, setIsLogoutModal] = useState<boolean>(false);

  const { setOpenMenu, setSettingsModalByKey } = globalActions;
  const { setProfileModalByKey } = profileActions;

  const balance = select(selectBalance);
  const isLogin: null | boolean = select(selectIsAuth);
  const user = select(selectUserData);

  const closeDropDown = () => setIsLogoutModal(true);

  const handleLogout = () => {
    dispatch(logout("handle button"));

    setIsLogoutModal(false);
  };

  const handleLogoutClick = () => {
    closeMenu();
    setIsLogoutModal(true);
  };

  const handleClickWalletPopup = () => {
    dispatch(setProfileModalByKey("wallet"));
    closeMenu();
  };

  const openPersonalSettings = () => {
    handleOpenSettings();
    closeMenu();
  };

  useEffect(() => {
    dispatch(setOpenMenu(Boolean(type)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleOpenNftHistory = () => {
    closeMenu();
    dispatch(setSettingsModalByKey(GlobalModals.nftWithdrawHistory));
  };

  return (
    <div className={cl([s.mobileMenu], { [s.open]: type })}>
      <div
        onClick={!type ? toogleMenu("MENU") : closeMenu}
        className={s.hamburgerWrap}
      >
        <div className={s.hamburger}>
          <div className={s.line} />
          <div className={s.line} />
          <div className={s.line} />
        </div>
      </div>
      {type === "MENU" && (
        <div className={s.contentWrap}>
          <div className={s.top}>Menu</div>
          <div className={s.linksWrap}>
            <div className={s.content}>
              <a
                href="https://www.chronicle.io/about"
                target="_blank"
                className={s.link}
                onClick={closeMenu}
                rel="noreferrer"
              >
                <ChronicleIcon className={`${s.iconItem} ${s.iconLogo}`} />
                About
                <ChevronUpIcon className={s.rightArrow} />
              </a>
            </div>
            <div className={s.content}>
              {menuItemsMobile.map(
                (v) =>
                  (!v?.isAuth || (v?.isAuth && isLogin)) && (
                    <Link
                      href={v.path.replace(":id", String(user.id))}
                      key={v.path}
                    >
                      <a onClick={closeMenu} className={s.link}>
                        {v.icon}
                        {v.name}
                        <ChevronUpIcon className={s.rightArrow} />
                      </a>
                    </Link>
                  )
              )}
              {isLogin && (
                <div onClick={openPersonalSettings} className={s.link}>
                  <SettingIcon /> Personal Settings
                  <ChevronUpIcon className={s.rightArrow} />
                </div>
              )}
              {isLogin && (
                <div onClick={handleOpenNftHistory} className={s.link}>
                  <HourglassIcon /> NFT Transferout History
                  <ChevronUpIcon className={s.rightArrow} />
                </div>
              )}
            </div>

            <div className={s.content}>
              {menuInfoItemsMobile.map((v) => (
                <a
                  href={v.path}
                  target="_blank"
                  key={v.path}
                  className={s.link}
                  onClick={closeMenu}
                  rel="noreferrer"
                >
                  {v.icon}
                  {v.name}
                  <ChevronUpIcon className={s.rightArrow} />
                </a>
              ))}
            </div>
            {user.isAuth && (
              <div className={s.wallet} onClick={handleClickWalletPopup}>
                <div className={s.rignt}>
                  <div className={s.header}>Balance</div>
                  <div className={cl(s.walletValue, "USDC")}>
                    USDC <span>{balance && transformPrice(balance?.USDC)}</span>
                  </div>
                  <div className={cl(s.walletValue, "XNL")}>
                    XNL <span>{balance && transformPrice(balance?.XNL)}</span>
                  </div>
                </div>
                <div className={s.btn}>
                  <CustomButton
                    theme="violet"
                    value="manage"
                    style={{ height: "32px" }}
                    onClick={handleClickWalletPopup}
                  />
                </div>
              </div>
            )}
            <div className={s.content}>
              {isLogin ? (
                <div className={s.logOut} onClick={handleLogoutClick}>
                  <LogoutIcon className={`${s.iconItem} `} />
                  Log out
                </div>
              ) : (
                <Link href={Routes.LOGIN}>
                  <a className={s.link} onClick={closeMenu}>
                    <LoginIcon className={`${s.iconItem} `} />
                    Log in
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
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
                onClick={handleLogout}
              />
              <CustomButton
                theme="violet"
                icon={<CrossIcon />}
                value="stay logged in"
                onClick={() => setIsLogoutModal(false)}
              />
            </div>
          </WithoutImageModal>
        </Modal>
      )}
    </div>
  );
};
