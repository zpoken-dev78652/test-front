import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const CreditCardIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path d="M16 2H0V5H16V2Z" fill={fill || "white"} />
      <path d="M16 7H0V14H16V7Z" fill={fill || "white"} />
    </Svg>
  );
};
