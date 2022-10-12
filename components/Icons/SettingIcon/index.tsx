import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const SettingIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps} viewBox="0 0 12 12">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.197 3L6.00084 0L0.804688 3V9L6.00084 12L11.197 9V3ZM6.00084 8C7.10541 8 8.00084 7.10457 8.00084 6C8.00084 4.89543 7.10541 4 6.00084 4C4.89627 4 4.00084 4.89543 4.00084 6C4.00084 7.10457 4.89627 8 6.00084 8Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
