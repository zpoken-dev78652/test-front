import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const LogoIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps} viewBox="0 0 12 12">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.48528 0H3.51472L0 3.51472V8.48528L3.51472 12H8.48528L12 8.48528V3.51472L8.48528 0ZM8.89606 2V3.4705L6.00116 5.17945V3.70896L8.89606 2ZM4.37186 7.60783L3.63115 8.05114V9.99984L5.99986 8.58218L8.36885 10V8.0513L7.62787 7.60783L11 5.58963V3.64093L5.99986 6.63348L1 3.6411V5.58979L4.37186 7.60783Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
