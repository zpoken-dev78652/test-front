import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ScrollLock from "react-scrolllock";
import { CustomButton } from "..";
import { mobileWidth } from "../../constants";
import { useMediaQuery } from "../../hooks";
import { CrossIcon } from "../Icons";

import s from "./Modal.module.scss";

export const Modal = ({
  theme = "yellow",
  onClose,
  children,
  style,
  isCloseBtnHidden,
  type,
  styleOnClose,
  id,
}: any) => {
  const isMobile = useMediaQuery(`(max-width: ${mobileWidth}px)`);
  const container =
    document.getElementById("portal") || document.createElement("div");

  useEffect(() => {
    if (!isMobile) return;
    document.body.style.position = "fixed";
    document.body.style.top = `-${window.scrollY}px`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
  }, [isMobile]);

  return createPortal(
    <div
      className={`${s.modal} ${type === "vertical" ? s.vertical : s.center} `}
      style={style}
      onClick={onClose}
    >
      <ScrollLock isActive={!isMobile}>
        <div className={s[theme]} id={id} onClick={(e) => e.stopPropagation()}>
          <div className={s.btnBack}></div>
          {onClose && !isCloseBtnHidden && (
            <div
              className={`${s.btnClose} ${styleOnClose || ""}`}
              onClick={onClose}
            >
              <CustomButton
                theme="simple"
                icon={<CrossIcon />}
                className={s.icon}
              />
            </div>
          )}
          {children}
        </div>
      </ScrollLock>
    </div>,
    container
  );
};
