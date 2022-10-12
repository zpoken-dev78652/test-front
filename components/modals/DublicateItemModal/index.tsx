import React from "react";
import s from "./DublicateItemModal.module.scss";

type DublicateItemModalProps = {
  icon: any;
  header: string;
  text: string | React.ReactNode;
  listWithTitle?: { title: string; value: string }[];
  list?: string[];
  titleList?: string;
};

export const DublicateItemModal: React.FC<DublicateItemModalProps> = ({
  icon,
  header,
  listWithTitle,
  text,
  children,
  titleList,
  list,
}) => {
  return (
    <div className={s.wrapper}>
      <div className={s.top}>
        <div className={s.iconWrap}>{icon}</div>
        <div className={s.content}>
          <h4 className={s.title}> {header}</h4>
          <p className={s.desc}>{text}</p>
          {listWithTitle?.length && (
            <div className={s.listWrap}>
              {listWithTitle.map((el, index) => (
                <div className={s.listItem} key={index}>
                  {el.title && <span className={s.listTitle}>{el.title}</span>}
                  <span className={s.listValue}>{el.value}</span>
                </div>
              ))}
            </div>
          )}

          {list?.length && (
            <div className={s.listWrapper}>
              {titleList && <h5 className={s.titleList}>{titleList}</h5>}{" "}
              <ul className={s.list}>
                {list?.map((listItem) => (
                  <li key={listItem} className={s.listItem}>
                    {listItem}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
