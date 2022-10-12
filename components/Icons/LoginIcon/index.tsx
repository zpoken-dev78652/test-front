import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const LoginIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps} viewBox="0 0 12 12">
      <path d="M11 0V12H5.75V10.5H9.5V1.5H5.75V0H11Z" fill={fill || "white"} />
      <path
        d="M5 3V5.25L1.25 5.25V6.75H5V9H5.75L8 6.75V5.25L5.75 3H5Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
