import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const TrashIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path d="M1 2H4V0H12V2H15V4H1V2Z" fill={fill || "white"} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 6H3V16H13V6ZM9 9H7V13H9V9Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
