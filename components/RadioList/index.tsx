import React from "react";
import s from "./RadioList.module.scss";

type RadioListProps = {
  lists: { value: string; text: string }[];
  value: any;
  setValue: any;
  type?: string;
};

const isEven = (value: number) => {
  if (value % 2 == 0) return true;
  else return false;
};

export const RadioList: React.FC<RadioListProps> = ({
  lists,
  value,
  setValue,
  type,
}) => {
  return (
    <div className={`${!type ? s.container : s.horisontal}`}>
      {lists.map((i, index) => {
        return (
          <div
            className={`${s.radio} ${
              !isEven(index) && !type ? s.lastInGroup : ""
            }`}
            onClick={() => setValue(i)}
            key={i.value}
          >
            <input
              className={`${s.customRadio} ${
                value && value.value === i.value ? s.checked : ""
              }`}
              type="radio"
              name="value"
              value={i.value}
            />
            <label>{i.text}</label>
          </div>
        );
      })}
    </div>
  );
};
