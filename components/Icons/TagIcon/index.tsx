import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const TagIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1H3L1 3V8L9 16L16 9L8 1ZM5.5 7C6.32843 7 7 6.32843 7 5.5C7 4.67157 6.32843 4 5.5 4C4.67157 4 4 4.67157 4 5.5C4 6.32843 4.67157 7 5.5 7Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
