import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const TelegramColorIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps} viewBox="0 0 32 32">
      <rect width="32" height="32" fill="#0088CC" />
      <path
        d="M25.9427 9.45113C26.2107 8.2578 25.4959 7.789 24.6918 8.08733L6.91103 14.608C5.7048 15.0768 5.74947 15.7161 6.73233 16.0144L11.2445 17.3356L21.7879 11.028C22.2793 10.6871 22.7707 10.9002 22.3686 11.1985L13.8357 18.5289L13.523 23.0039C14.0144 23.0039 14.1931 22.8334 14.4611 22.5777L16.6502 20.532L21.2518 23.771C22.1006 24.2398 22.726 23.9841 22.9494 23.0465L25.9427 9.45113Z"
        fill="white"
      />
    </Svg>
  );
};
