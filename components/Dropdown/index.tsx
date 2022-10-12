import moment from "moment";
import Link from "next/link";
import React from "react";
import { CustomButton } from "..";
import { dropdownItems } from "../../constants";
import { transformPrice, transformToId } from "../../helpers";
import { Balance, User } from "../../types";
import { ArchiveIcon, HourglassIcon, LogoutIcon, SettingIcon } from "../Icons";
import s from "./Dropdown.module.scss";

type DropdownProps = {
  user: User | undefined;
  balance: Balance;
  closeDropDown: () => void;
  handleLogOutBtn: () => void;
  handleClickWalletPopup: () => void;
  handleOpenSettings: () => void;
  handleOpenNftHistory: () => void;
};

export const dropdownItemsIcon: any = {
  "My Collection": <ArchiveIcon size={12} />,
  "Log out": <LogoutIcon size={12} />,
};

export const Dropdown: React.FC<DropdownProps> = ({
  user,
  balance,
  closeDropDown,
  handleLogOutBtn,
  handleClickWalletPopup,
  handleOpenSettings,
  handleOpenNftHistory,
}) => {
  return (
    <div className={s.container}>
      <div className={s.bio}>
        <div className={s.nickWrap}>
          <span className={`${s.nick} ellipsis`}>{user && user.username}</span>
          <div className={s.iconWrap} onClick={handleOpenSettings}>
            <SettingIcon size={12} />
          </div>
        </div>
        <div className={s.name}>
          {user && user.fullName ? user.fullName : user && user.username}{" "}
          {user?.registered_at && (
            <span className={s.data}>
              Since {moment(user?.registered_at).format("MMM YYYY")}
            </span>
          )}
        </div>
      </div>
      <div className={s.wallet}>
        <div className={s.rignt}>
          <div className={s.header}>Balance</div>
          <div className={`${s.walletValue} USDC`}>
            USDC{" "}
            <span>{balance?.isFeatched && transformPrice(balance?.USDC)}</span>
          </div>
          <div className={`${s.walletValue} XNL`}>
            XNL{" "}
            <span>{balance?.isFeatched && transformPrice(balance.XNL)}</span>
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
      <div className={s.links}>
        {dropdownItems.map((i: any) => (
          <Link href={i.link.replace("<id>", user?.id)} key={i.id}>
            <a className={s.link} onClick={closeDropDown}>
              <div className={s.icon}>{dropdownItemsIcon[i.title]}</div>
              <div className={s.title}>{i.title}</div>
            </a>
          </Link>
        ))}
        {/* <div
          className={s.link}
          onClick={handleOpenNftHistory}
          id={transformToId(["Dropdown", "NFT TRANSFEROUT HISTORY"])}
        >
          <div className={s.icon}>
            <HourglassIcon size={12} />
          </div>
          <div className={s.title}>NFT TRANSFEROUT HISTORY</div>
        </div> */}
        <div
          className={s.link}
          onClick={handleLogOutBtn}
          id={transformToId(["Dropdown", "Log out"])}
        >
          <div className={s.icon}>
            <LogoutIcon size={12} />
          </div>
          <div className={s.title}>Log out</div>
        </div>
      </div>
    </div>
  );
};
