import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const CheckIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.4144 5.41436L6.82858 14.0002H4.17172L0.585938 10.4144L3.41436 7.58594L5.50015 9.67172L12.5859 2.58594L15.4144 5.41436Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
