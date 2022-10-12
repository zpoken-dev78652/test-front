import React from "react";
import Link from "next/link";
import { useRedux } from "../../../hooks";
import { User } from "../../../types";
import { useRouter } from "next/router";
import { selectIsAuth } from "../../../redux";
import { CustomButton, UserHeaderCard } from "../../../components";
import s from "./Menu.module.scss";
import { DiscordIcon, LoginIcon } from "../../../components/Icons";
import { Notifications } from "../../Notifications";
import { Routes } from "../../../constants";

type MenuProps = {
  isFooter?: boolean;
  user?: User;
  handleOpenSettings: () => void;
};

const menuItemsDesk = [
  {
    name: "New Drops",
    path: Routes.STORE,
    value: "store",
  },
  {
    name: "Trade",
    path: Routes.TRADE,
    value: "trade",
  },
  {
    name: "Redeem Code",
    path: Routes.REDEEM_CODE,
    value: "redeem_code",
    isAuth: true,
  },
  {
    name: "About",
    href: "https://www.chronicle.io/about",
    value: "about",
  },
];
export const MenuContainer: React.FC<MenuProps> = ({
  isFooter,
  user,
  handleOpenSettings,
}) => {
  const [select] = useRedux();
  const { pathname, push } = useRouter();

  const isLogin: null | boolean = select(selectIsAuth);
  const isPath = (path: string) => pathname.split("/").includes(path);
  const onBtnClick = () => push("/login");

  return (
    <div className={s.container}>
      <div>
        {menuItemsDesk.map((v, i) =>
          v.href ? (
            <a
              key={v.href}
              href={v.href}
              target={"_blank"}
              className={isPath(v.value) ? s.active : s.link}
              rel="noreferrer"
            >
              {v.name}
            </a>
          ) : (
            (!v?.isAuth || (v?.isAuth && isLogin)) &&
            v.path && (
              <Link href={`${v.path}`} key={v.path}>
                <a className={isPath(v.value) ? s.active : s.link}>{v.name}</a>
              </Link>
            )
          )
        )}
      </div>
      <a
        href="https://discord.link/chroniclexnl"
        target="_blank"
        rel="noreferrer"
        className={s.discord}
      >
        <DiscordIcon />
      </a>
      {isLogin && <Notifications />}
      {!isFooter && (
        <>
          {isLogin ? (
            <UserHeaderCard
              user={user}
              handleOpenSettings={handleOpenSettings}
            />
          ) : (
            <CustomButton
              value="Sign in"
              icon={<LoginIcon />}
              onClick={onBtnClick}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MenuContainer;
