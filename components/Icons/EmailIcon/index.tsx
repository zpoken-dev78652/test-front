import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const EmailIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        d="M0 5.45781V14H16V5.45781L9.64093 10H6.35907L0 5.45781Z"
        fill={fill || "white"}
      />
      <path d="M16 3V2H0V3L7 8H9L16 3Z" fill={fill || "white"} />
    </Svg>
  );
};
