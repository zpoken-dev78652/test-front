import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const AlertIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 15H2L0 13V11L7 0H9L16 11V13L14 15ZM7 4H9V9H7V4ZM7 11H9V13H7V11Z"
        fill={fill || "#ff002e"}
      />
    </Svg>
  );
};
