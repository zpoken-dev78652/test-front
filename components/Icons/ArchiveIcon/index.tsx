import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const ArchiveIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path d="M0 2H16V5H0V2Z" fill={fill || "#fff"} />
      <path d="M5 7H1V15H15V7H11V9H5V7Z" fill={fill || "#fff"} />
    </Svg>
  );
};
