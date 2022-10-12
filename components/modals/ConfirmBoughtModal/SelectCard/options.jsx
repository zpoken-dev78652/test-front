import React from "react";
import { createPortal } from "react-dom";
import cn from "classnames";
import s from "./SelectCard.module.scss";
import {
  IconCheck,
  IconDiscoverWithBg,
  IconMasterCardWithBg,
  IconVisaWithBg,
} from "../../../../public/icons";

const createIcon = (iconName) => {
  switch (iconName) {
    case "visa":
      return <IconVisaWithBg />;
    case "discover":
      return <IconDiscoverWithBg />;
    default:
      return <IconMasterCardWithBg />;
  }
};

function Options({ options, handleValue, value, position, ...rest }) {
  return createPortal(
    <div
      className={s.options}
      style={{
        top: (position?.top || 0) + (position?.height || 0),
        left: position?.left || 0,
        width: position?.width || 0,
      }}
      {...rest}
    >
      {options.map((el) => (
        <div
          key={el.value}
          className={cn([
            s.option,
            { [s.checked]: el?.value === value?.value },
          ])}
          onClick={() => handleValue(el)}
        >
          <div className={cn([s.checkbox])}>
            <IconCheck className={s.checkIcon} />
          </div>
          {el.icon ? createIcon(el.icon) : null}
          <span className={s.titleOption}>{el.label}</span>
        </div>
      ))}
    </div>,
    document.getElementById("portal")
  );
}

export default Options;
