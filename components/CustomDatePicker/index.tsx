import React from "react";
import DatePicker from "react-datepicker";
import s from "./CustomDatePicker.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import { months } from "../../constants";
import MaskedTextInput from "react-text-mask";

import {
  IconCalendar,
  IconNextMonth,
  IconNextYear,
  IconPrevMonth,
  IconPrevYear,
} from "../../public/icons";
import cn from "classnames";

type DatePickerProps = {
  date: Date | null;
  label?: string | React.ReactNode | Element;
  changeDate: (a: Date) => void;
  error?: string;
};

export const CustomDatePicker: React.FC<DatePickerProps> = ({
  date,
  label,
  error,
  changeDate,
}) => {
  return (
    <div className={s.container}>
      <div className={s.picker}>
        {label && <label className={s.label}>{label}</label>}
        <div className={s.wrapperDate}>
          <DatePicker
            selected={date}
            onChange={(date: Date) => changeDate(date)}
            placeholderText="DD/MM/YYYY"
            className={cn({ "input-error": error })}
            customInput={
              <MaskedTextInput
                type="text"
                mask={[
                  /\d/,
                  /\d/,
                  "/",
                  /\d/,
                  /\d/,
                  "/",
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ]}
              />
            }
            dateFormat="dd/MM/yyyy"
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              increaseYear,
              decreaseYear,
            }) => (
              <div className={s.datePickerHeader}>
                <div onClick={decreaseYear} className={s.btn}>
                  <IconPrevYear className={s.icon} />
                </div>
                <div onClick={decreaseMonth} className={s.btn}>
                  <IconPrevMonth className={s.icon} />
                </div>
                <p>
                  {months[date.getMonth()]} {date.getFullYear()}
                </p>
                <div onClick={increaseMonth} className={s.btn}>
                  <IconNextMonth className={s.icon} />
                </div>
                <div onClick={increaseYear} className={s.btn}>
                  <IconNextYear className={s.icon} />
                </div>
              </div>
            )}
          />
          <IconCalendar size={12} className={s.iconCalendar} />
        </div>
        {error && <p className={s.error}>{error}</p>}
      </div>
    </div>
  );
};
