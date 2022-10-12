import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const FireIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 9.5C15 13.366 11.866 16.5 8 16.5C4.13401 16.5 1 13.366 1 9.5C1 6 4 3.5 4 3.5H6V5.5C6 6.05228 6.44772 6.5 7 6.5C7.55228 6.5 8 6.05228 8 5.5V0.5H10C10 0.5 15 3.5 15 9.5ZM10 12.5C10 13.6046 9.10457 14.5 8 14.5C6.89543 14.5 6 13.6046 6 12.5C6 10 8 8.5 8 8.5C8 8.5 10 10 10 12.5Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
