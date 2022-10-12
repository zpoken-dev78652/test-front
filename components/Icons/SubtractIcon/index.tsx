import React, { FC } from "react";
import { Svg } from "../Svg";
import { IconProps } from "../type";

export const SubtractIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <Svg {...svgProps} viewBox="0 0 12 13">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.08001 1.86474L2.44014 1.57532L1.07532 2.94014L1.36474 4.58001L0 5.5353V7.4647L1.36474 8.41999L1.07532 10.0599L2.44014 11.4247L4.08001 11.1353L5.0353 12.5H6.9647L7.91999 11.1353L9.55986 11.4247L10.9247 10.0599L10.6353 8.41999L12 7.4647V5.5353L10.6353 4.58001L10.9247 2.94014L9.55986 1.57532L7.91999 1.86474L6.9647 0.5H5.0353L4.08001 1.86474ZM5.47325 9.1989L9.33685 5.33529L8.06406 4.0625L4.87546 7.2511L3.93685 6.3125L2.66406 7.58529L4.27767 9.1989H5.47325Z"
        fill={fill || "#00E1C8"}
      />
    </Svg>
  );
};
