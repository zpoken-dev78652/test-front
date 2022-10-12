import React, { HTMLProps } from "react";
import cn from "classnames";
import s from "./CustomInput.module.scss";

interface CustomInput extends HTMLProps<HTMLInputElement> {
  error?: boolean;
  startTest?: string;
  label?: string;
  message?: string;
  errorMessage?: string;
  name: string;
}

export const CustomInput = ({
  label,
  error,
  name,
  message,
  startTest,
  errorMessage,
  ...inputProps
}: CustomInput) => {
  return (
    <label
      className={cn([s.customInput], { [s.isError]: error || errorMessage })}
    >
      {label && <p className={s.label}>{label}</p>}
      <div className={s.input}>
        {startTest && <p className={s.startTest}>{startTest}</p>}{" "}
        <input
          name={name}
          id={name.trim().replace(/\s+/g, "_")}
          {...inputProps}
        />
      </div>
      {errorMessage && <div className={s.tipError}>{errorMessage}</div>}
    </label>
  );
};
