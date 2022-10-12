import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const ChevronDownIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.17172 8L12.5859 3.58579L15.4144 6.41421L9.82858 12L6.17172 12L0.585937 6.41421L3.41436 3.58579L7.82858 8L8.17172 8Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
