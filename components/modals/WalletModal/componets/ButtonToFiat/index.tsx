import React, { FC, HTMLAttributes } from "react";
import { ArrowRightIcon, CreditCardIcon } from "../../../../Icons";

import s from "./ButtonToFiat.module.scss";

type ButtonToFiatProps = HTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export const ButtonToFiat: FC<ButtonToFiatProps> = ({ value, ...rest }) => {
  return (
    <button className={s.btnFiat} id={value.replaceAll(" ", "_")} {...rest}>
      <div className={s.content}>
        <div className={s.svg}>
          <CreditCardIcon />
        </div>
        <span>{value}</span>
      </div>
      <ArrowRightIcon size={12} className={s.arrowIcon} />
    </button>
  );
};
