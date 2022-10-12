import cn from "classnames";
import React from "react";
import s from "./NotFoundItem.module.scss";

type NotFoundItemPropsType = {
  icon: any;
  header: string;
  text: string;
  type?: string;
  className?: string;
};

export const NotFoundItem: React.FC<NotFoundItemPropsType> = ({
  icon,
  header,
  text,
  type,
  className,
}) => {
  return (
    <div className={cn([s.notFound, className], { [s.detail]: type })}>
      <div className={s.icon}>{icon}</div>
      <h3 className={s.header}>{header}</h3>
      <p className={s.text}>{text}</p>
    </div>
  );
};
