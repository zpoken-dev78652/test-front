import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const InfoCircleIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM7 5V3H9V5H7ZM9 10H11V12H5V10H7V8H5V6H9V10Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
