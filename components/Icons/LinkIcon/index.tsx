import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const LinkIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps}>
      <path
        d="M14 1L15 2L15 7L14 8L11.7071 5.70711L7.70711 9.70711L6.29289 8.29289L10.2929 4.29289L8 2L9 1H14Z"
        fill={fill || "white"}
      />
      <path d="M1 2V15H14V10H12V13H3V4H6V2H1Z" fill={fill || "white"} />
    </Svg>
  );
};
