import cn from "classnames";
import React, { FC, useEffect } from "react";
import { createPortal } from "react-dom";
import ScrollLock from "react-scrolllock";
import { mobileWidth } from "../../../constants";
import { transformToId } from "../../../helpers";
import { useMediaQuery } from "../../../hooks";
import { ArrowLeftIcon, CrossIcon } from "../../Icons";

import s from "./WrapperModal.module.scss";

type WrapperModalProps = {
  name: string;
  type?: "vertical" | "center";
  isCloseBtnHidden?: boolean;
  title?: string;
  onClose?: () => void;
  handleBack?: () => void;
  className?: string;
};

export const WrapperModal: FC<WrapperModalProps> = ({
  onClose,
  handleBack,
  isCloseBtnHidden,
  type = "center",
  name,
  title,
  children,
  className,
}) => {
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
    <ScrollLock isActive={!isMobile}>
      <div className={cn([s.modal, s[type]])}>
        <div className={s.bg} id={transformToId([name])} onClick={onClose} />
        <div className={cn([className, s.content])}>
          {title && (
            <div className={s.header}>
              <span>
                {handleBack && (
                  <div
                    className={cn([s.icon, s.arrow])}
                    onClick={handleBack}
                    id={`${transformToId([name, "handleBack"])}`}
                  >
                    <ArrowLeftIcon size={12} />
                  </div>
                )}
                {title}
              </span>
              {onClose && !isCloseBtnHidden && (
                <div
                  className={s.icon}
                  id={`${transformToId([name, "close"])}`}
                  onClick={onClose}
                >
                  <CrossIcon size={16} />
                </div>
              )}
            </div>
          )}
          <div
            className={s.wrapperContent}
            id={transformToId([name, "scroll"])}
          >
            {children}
          </div>
        </div>
      </div>
    </ScrollLock>,
    container
  );
};
