import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const FacebookColorIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps} viewBox="0 0 32 32">
      <rect width="32" height="32" fill="#1778F2" />
      <path
        d="M26 16.0604C26 10.5362 21.5242 6.06042 16 6.06042C10.4758 6.06042 6 10.5362 6 16.0604C6 21.0604 9.62903 25.2137 14.4274 25.9395V18.9637H11.8871V16.0604H14.4274V13.883C14.4274 11.383 15.9194 9.97172 18.1774 9.97172C19.3065 9.97172 20.4355 10.1733 20.4355 10.1733V12.633H19.1855C17.9355 12.633 17.5323 13.3991 17.5323 14.2056V16.0604H20.3145L19.871 18.9637H17.5323V25.9395C22.3306 25.2137 26 21.0604 26 16.0604Z"
        fill={fill || "white"}
      />
    </Svg>
  );
};
