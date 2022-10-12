import React from "react";
import cl from "classnames";
import s from "./Eye.module.scss";
import { IconEye, IconOpenEye } from "../../public/icons";

type EyeProps = {
  open?: boolean;
  disabled?: boolean;
  onClick?: () => any;
};

export const Eye: React.FC<EyeProps> = ({
  open = false,
  disabled = false,
  onClick,
}) => {
  return (
    <div
      className={cl([s.container], { [s.disabled]: disabled })}
      onClick={onClick}
    >
      {open ? <IconOpenEye /> : <IconEye />}
    </div>
  );
};
