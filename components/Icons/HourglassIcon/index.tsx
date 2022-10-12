import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const HourglassIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps} width="12" height="12" viewBox="0 0 12 12">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 9.5V11.5L2.5 12.5H9.5L10.5 11.5V9.5L7.5 6.5H4.5L1.5 9.5ZM5.32843 8.5H6.67157L8.5 10.3284V10.5H3.5V10.3284L5.32843 8.5Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 3.5V1.5L2.5 0.5H9.5L10.5 1.5V3.5L7.5 6.5H4.5L1.5 3.5Z"
        fill="white"
      />
    </Svg>
  );
};
