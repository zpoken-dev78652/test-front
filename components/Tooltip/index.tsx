import React from "react";
import ReactTooltip, { TooltipProps } from "react-tooltip";
import cn from "classnames";

import { createPortal } from "react-dom";
import s from "./Tooltip.module.scss";

export const Tooltip = ({
  children,
  effect,
  arrowColor,
  backgroundColor,
  className,
  ...rest
}: TooltipProps) => {
  const container =
    document.getElementById("portal") ?? document.createElement("div");

  return createPortal(
    <ReactTooltip
      className={cn([s.tooltipe, className])}
      effect={effect || "solid"}
      arrowColor={arrowColor || "rgba(255, 255, 255, 0.1)"}
      backgroundColor={backgroundColor || "rgba(255, 255, 255, 0.1)"}
      {...rest}
    >
      {children}
    </ReactTooltip>,
    container
  );
};
