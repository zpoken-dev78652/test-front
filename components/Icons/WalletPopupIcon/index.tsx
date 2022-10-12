import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const WalletPopupIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path d="M0 2.5L14 0.5V3.5H0V2.5Z" fill={fill || "white"} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 5.50012H0V15.5001H6.9997L4.4997 13.0001V12.5001L6.9997 12.5001V8.00012H8.9997V12.5001H11.4997V13.0001L8.9997 15.5001H16V5.50012Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
