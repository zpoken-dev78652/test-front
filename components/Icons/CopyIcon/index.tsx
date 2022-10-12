import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const CopyIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps} viewBox="0 0 12 12">
      <path d="M0 0H7.5V3H3V7.5H0V0Z" fill={fill || "white"} />
      <path d="M12 4.5H4.5V12H12V4.5Z" fill={fill || "white"} />
    </Svg>
  );
};
