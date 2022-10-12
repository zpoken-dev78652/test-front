import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const ArrowRightIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        d="M9 6V1L10 1L16 7V9L10 15H9V10H3.49691e-07L0 6L9 6Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
