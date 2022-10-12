import cn from "classnames";
import { FC } from "react";
import { IconProps } from "../type";

export const Svg: FC<IconProps> = ({
  size,
  viewBox,
  className,
  children,
  ...rest
}) => {
  return (
    <svg
      className={cn(className)}
      width={size || "16"}
      height={size || "16"}
      viewBox={viewBox || "0 0 16 16"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {children}
    </svg>
  );
};
