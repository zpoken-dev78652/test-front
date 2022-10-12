import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const FolderIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path d="M0 1H6L9 4H16V14H0V1Z" fill={fill || "white"} />
    </Svg>
  );
};
