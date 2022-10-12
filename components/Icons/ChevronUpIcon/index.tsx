import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const ChevronUpIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.82828 8L3.41406 12.4142L0.585636 9.58579L6.17142 4L9.82828 4L15.4141 9.58579L12.5856 12.4142L8.17142 8L7.82828 8Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
