import cn from "classnames";
import React, { FC, HTMLAttributes } from "react";
import s from "./Or.module.scss";

type OrPropsType = HTMLAttributes<HTMLDivElement> & {
  value?: string;
};
export const Or: FC<OrPropsType> = ({ value, className }) => {
  return (
    <div className={cn(s.or, className)}>
      <span className={s.line}></span>
      <span className={s.text}>{value || "OR"}</span>
      <span className={s.line}></span>
    </div>
  );
};
