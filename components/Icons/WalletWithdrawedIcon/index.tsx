import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const WalletWithdrawedIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path d="M0 2.5L14 0.5V3.5H0V2.5Z" fill={fill || "white"} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 5.50012H0V15.5001H6.9997V11.5001L4.4997 11.5001V11.0001L7.4997 8.00012H8.4997L11.4997 11.0001V11.5001H8.9997V15.5001H16V5.50012Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
