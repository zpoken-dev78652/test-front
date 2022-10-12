import React, { FC } from "react";
import { IconProps } from "../type";

export const FacebookIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <svg
      width="9"
      height="16"
      viewBox="0 0 9 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <path
        d="M5.92604 15.9999V8.70155H8.28469L8.63781 5.85726H5.92604V4.04126C5.92604 3.21779 6.14623 2.65655 7.28326 2.65655L8.7334 2.65585V0.111955C8.48249 0.0774178 7.62173 0 6.62031 0C4.52954 0 3.09815 1.32545 3.09815 3.75971V5.85733H0.733398V8.70163H3.09807V16L5.92604 15.9999Z"
        fill={fill || "white"}
      />
    </svg>
  );
};
