import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const GridIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path d="M1 1H7V7H1V1Z" fill={fill || "white"} />
      <path d="M9 1H15V7H9V1Z" fill={fill || "white"} />
      <path d="M1 9H7V15H1V9Z" fill={fill || "white"} />
      <path d="M9 9H15V15H9V9Z" fill={fill || "white"} />
    </Svg>
  );
};
