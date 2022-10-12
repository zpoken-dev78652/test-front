import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const DownloadIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps} viewBox="0 0 12 12">
      <path
        d="M9.75 6.75H7.5V12H4.5L4.5 6.75L2.25 6.75L2.25 6L5.25 3H6.75L9.75 6V6.75Z"
        fill={fill || "white"}
      />
      <path d="M10.5 1.5H1.5V0H10.5V1.5Z" fill={fill || "white"} />
    </Svg>
  );
};
