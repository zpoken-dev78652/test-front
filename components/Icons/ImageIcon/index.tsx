import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const ImageIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 1H1V15H15V1ZM8 11L6 9L3 12V13H13V7H12L8 11Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
