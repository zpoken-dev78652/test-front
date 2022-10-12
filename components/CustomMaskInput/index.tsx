import React from "react";
import cn from "classnames";
import MaskedInput, { ConformToMaskConfig, Mask } from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import s from "./CustomMaskInput.module.scss";

interface CustomMaskInput extends ConformToMaskConfig {
  error?: boolean;
  startTest?: string;
  label?: string;
  message?: string;
  errorMessage?: string;
  name: string;
  value?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mask?: Mask | ((value: string) => Mask);
  maskOptions?: {
    prefix?: string;
    suffix?: string;
    includeThousandsSeparator?: boolean;
    thousandsSeparatorSymbol?: string;
    allowDecimal?: boolean;
    decimalSymbol?: string;
    decimalLimit?: string;
    requireDecimal?: boolean;
    allowNegative?: boolean;
    allowLeadingZeroes?: boolean;
    integerLimit?: number;
  };
}

const defaultMaskOptions = {
  prefix: "",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: " ",
  allowDecimal: true,
  decimalSymbol: ".",
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 99, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
};

export const CustomMaskInput = ({
  label,
  error,
  name,
  message,
  startTest,
  errorMessage,
  maskOptions,
  mask,
  ...inputProps
}: CustomMaskInput) => {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    ...maskOptions,
  });

  return (
    <label
      className={cn([s.customMaskInput], {
        [s.isError]: error || errorMessage,
      })}
    >
      {label && <p className={s.label}>{label}</p>}
      <div className={s.input}>
        {startTest && <p className={s.startTest}>{startTest}</p>}{" "}
        <MaskedInput
          className={s.input}
          mask={mask || currencyMask}
          placeholder="Enter a phone number"
          name={name}
          id={name.trim().replace(/\s+/g, "_")}
          {...inputProps}
        />
      </div>
      {errorMessage && <div className={s.tipError}>{errorMessage}</div>}
    </label>
  );
};
