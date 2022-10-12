import React, { HTMLAttributes } from "react";
import cn from "classnames";
import s from "./DetailRow.module.scss";
import { BeatLoader } from "react-spinners";

interface DetailRowProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number | React.ReactNode;
  opacityValue?: boolean;
  loading?: boolean;
  valueCurrency?: string;
  type: "text" | "price" | "link" | "whiteHeader";
}

export const DetailRow: React.FC<DetailRowProps> = ({
  title,
  value,
  valueCurrency,
  opacityValue,
  type,
  loading,
  className,
  ...rest
}) => {
  return (
    <div className={cn(s.row, className)} {...rest}>
      <div className={type === "whiteHeader" ? s.whiteTitle : s.title}>
        {title}
      </div>

      {loading ? (
        <BeatLoader color={"#fff"} size={6} />
      ) : type !== "link" ? (
        <div className={cn([s.value, { [s.opacity]: opacityValue }])}>
          {valueCurrency && (
            <span className={valueCurrency}>{valueCurrency} </span>
          )}
          {value}
        </div>
      ) : (
        value
      )}
    </div>
  );
};
