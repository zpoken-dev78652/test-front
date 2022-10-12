import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const UploadIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path d="M4 4H7L7 11H9L9 4L12 4V3L9 0H7L4 3L4 4Z" fill={fill || "#fff"} />
      <path d="M2 16L14 16V7H12V14L4 14L4 7H2V16Z" fill={fill || "#fff"} />
    </Svg>
  );
};
