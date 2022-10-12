import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const GiftIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        d="M3 3V0H4C5.65685 0 7 1.34315 7 3V6H0V3H3Z"
        fill={fill || "white"}
      />
      <path
        d="M16 3H13V0H12C10.3431 0 9 1.34315 9 3V6H16V3Z"
        fill={fill || "white"}
      />
      <path d="M7 8V15H1V8H7Z" fill={fill || "white"} />
      <path d="M15 15V8H9V15H15Z" fill={fill || "white"} />
    </Svg>
  );
};
