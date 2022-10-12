import React, { FC } from "react";
import { IconProps } from "../type";

export const MediumIcon: FC<IconProps> = ({ fill, ...svgProps }) => {
  return (
    <svg
      width="24"
      height="14"
      viewBox="0 0 24 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <path
        d="M6.76884 0C10.5072 0 13.5374 3.12109 13.5374 6.97089C13.5374 10.8207 10.5069 13.9415 6.76884 13.9415C3.03073 13.9415 0 10.8207 0 6.97089C0 3.12109 3.0305 0 6.76884 0ZM17.5782 0.408337C19.4474 0.408337 20.9626 3.3462 20.9626 6.97089H20.9628C20.9628 10.5946 19.4476 13.5334 17.5784 13.5334C15.7092 13.5334 14.194 10.5946 14.194 6.97089C14.194 3.34714 15.709 0.408337 17.5782 0.408337ZM22.8097 1.09188C23.4669 1.09188 24 3.72395 24 6.97089C24 10.2169 23.4672 12.8499 22.8097 12.8499C22.1522 12.8499 21.6196 10.2176 21.6196 6.97089C21.6196 3.72419 22.1524 1.09188 22.8097 1.09188Z"
        fill="#111212"
      />
    </svg>
  );
};