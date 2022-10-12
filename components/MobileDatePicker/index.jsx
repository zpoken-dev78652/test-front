import React from "react";
import moment from "moment";
import DatePicker from "react-mobile-datepicker";
import s from "./MobileDatePicker.module.scss";
// import "./datepicker.scss";

const config = {
  date: {
    format: "D",
    caption: "Day",
    step: 1,
  },
  month: {
    format: (value) => moment(value).format("MMM"),
    caption: "Mon",
    step: 1,
    className: "asd",
  },
  year: {
    format: "YYYY",
    caption: "Year",
    step: 1,
  },
};

export const MobileDatePicker = ({ date, setDate }) => {
  return (
    <div className={`customWrapper ${s.wrapperPicker}`}>
      <div className={s.bigDate}>
        {moment(date || new Date()).format("DD.MM.YYYY")}
      </div>
      <DatePicker
        value={date || new Date()}
        onChange={setDate}
        isOpen={true}
        min={new Date(1900, 0, 1)}
        max={new Date()}
        isPopup={false}
        showCaption={false}
        showHeader={false}
        showFooter={false}
        dateConfig={config}
      />
    </div>
  );
};
