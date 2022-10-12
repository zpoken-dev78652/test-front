import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const ArrowLeftIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path d="M7 10L7 15H6L0 9V7L6 1H7L7 6H16V10H7Z" fill={fill || "white"} />
    </Svg>
  );
};
