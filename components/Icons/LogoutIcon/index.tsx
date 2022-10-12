import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const LogoutIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path d="M2 0V16H9V14H4V2H9V0H2Z" fill={fill || "white"} />
      <path d="M11 4V7L6 7V9H11V12H12L15 9V7L12 4H11Z" fill={fill || "white"} />
    </Svg>
  );
};
