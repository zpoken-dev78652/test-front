import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const PhoneIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        d="M1 1H7V5L4.20711 7.79289L8.20711 11.7929L11 9H15V15H8.58579L1 7.41421V1Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
