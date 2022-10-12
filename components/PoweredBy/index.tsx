import React from "react";

import {
  AmericanexIcon,
  DiscoverIcon,
  MasterCardIcon,
  VisaIcon,
} from "../Icons";
import s from "./PoweredBy.module.scss";

type PoweredByProps = {
  value: React.ReactNode | string;
};

export const PoweredBy: React.FC<PoweredByProps> = ({ value }) => {
  return (
    <div className={s.desc}>
      <div className={s.title}>
        Powered by <span>{value}</span>
      </div>
      <div className={s.icon}>
        <span>
          <MasterCardIcon />
        </span>
        <span>
          <VisaIcon />
        </span>
        <span>
          <DiscoverIcon />
        </span>
        <span>
          <AmericanexIcon />
        </span>
      </div>
    </div>
  );
};
