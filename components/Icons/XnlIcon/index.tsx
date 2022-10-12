import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const XnlIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps} viewBox="0 0 50 50">
      <rect width="50" height="50" fill={fill || "#00E1C8"} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.005 16.7792V12L25.0044 17.5542V22.3333L36.005 16.7792ZM15.9984 31.6664L18.8133 30.2255L6 23.6667V17.3334L24.9997 27.0588L44 17.3331V23.6664L31.1861 30.2255L34.0016 31.6667V38L24.9997 33.3922L15.9984 37.9997V31.6664Z"
        fill="white"
      />
    </Svg>
  );
};
