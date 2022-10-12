import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const FacebookFooterIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps} viewBox="0 0 20 20">
      <path
        d="M20 10.0604C20 4.53623 15.5242 0.0604248 10 0.0604248C4.47581 0.0604248 0 4.53623 0 10.0604C0 15.0604 3.62903 19.2137 8.42742 19.9395V12.9637H5.8871V10.0604H8.42742V7.88301C8.42742 5.38301 9.91936 3.97172 12.1774 3.97172C13.3065 3.97172 14.4355 4.17333 14.4355 4.17333V6.63301H13.1855C11.9355 6.63301 11.5323 7.39913 11.5323 8.20559V10.0604H14.3145L13.871 12.9637H11.5323V19.9395C16.3306 19.2137 20 15.0604 20 10.0604Z"
        fill={fill || "#191B1B"}
      />
    </Svg>
  );
};
