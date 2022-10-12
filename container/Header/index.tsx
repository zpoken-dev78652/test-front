import dynamic from "next/dynamic";
import React, { useState } from "react";
import { MobileMenu } from "..";
import { Logo } from "../../components";
import { useMediaQuery, useRedux } from "../../hooks";
import { selectUserData } from "../../redux";
import { MobileNotifications } from "../MobileNotifications";
import s from "./Header.module.scss";

const MenuContainer = dynamic(() => import("../Menu/Desktop"), {
  ssr: false,
});

type HeaderContainerType = {
  handleOpenSettings: () => void;
};

export const HeaderContainer: React.FC<HeaderContainerType> = ({
  handleOpenSettings,
}) => {
  const [type, setType] = useState<"" | "NOTIFICATION" | "MENU">("");
  const [isOpenDropdown, setOpenDropdown] = useState<boolean>(false);

  const [select] = useRedux();

  const user = select(selectUserData);

  const isMobile = useMediaQuery("(max-width: 599.98px)");

  const toogleMenu = (type: "" | "NOTIFICATION" | "MENU") => () => {
    setType(type);
    setOpenDropdown(Boolean(type));
  };

  const closeMenu = () => {
    setType("");
    setOpenDropdown(false);
  };

  return (
    <header className={s.container}>
      <Logo />
      <div className={s.links}>
        {isMobile && user.isAuth && (
          <MobileNotifications
            type={type}
            isOpenDropdown={isOpenDropdown}
            toogleMenu={toogleMenu}
          />
        )}
        {isMobile ? (
          <MobileMenu
            type={type}
            toogleMenu={toogleMenu}
            closeMenu={closeMenu}
            handleOpenSettings={handleOpenSettings}
          />
        ) : (
          <MenuContainer user={user} handleOpenSettings={handleOpenSettings} />
        )}
      </div>
    </header>
  );
};
