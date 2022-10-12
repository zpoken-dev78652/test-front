import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const LockIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 6V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V6H14V16H2V6H4ZM6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4V6H6V4Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
