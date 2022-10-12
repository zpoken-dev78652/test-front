import React from "react";
import cn from "classnames";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import MaskedInput, { ConformToMaskConfig, Mask } from "react-text-mask";
import { WrappedFieldProps } from "redux-form";
import s from "./MaskInput.module.scss";
import { AlertIcon } from "../Icons";

const defaultMaskOptions = {
  prefix: "$",
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

interface CurrencyInput extends ConformToMaskConfig {
  value?: number;
  error?: boolean;
  hideError?: boolean;
  className?: string;
  wrapperСlassName?: string;
  startTest?: string;
  title?: string;
  mask?: Mask | ((value: string) => Mask);
  message?: string;
  onChange?: (e: number) => void;
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

export const MaskInput = ({
  maskOptions,
  title,
  message,
  startTest,
  meta,
  input,
  mask,
  hideError,
  wrapperСlassName,
  className,
  ...inputProps
}: CurrencyInput & WrappedFieldProps) => {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    ...maskOptions,
  });
  const { touched, invalid, active, error } = meta;

  const isNotValid = !active && touched && invalid;
  return (
    <>
      <label
        className={cn([s.priceInput, wrapperСlassName], {
          [s.isError]: isNotValid,
        })}
      >
        <div className={s.content}>
          {title && <span className={s.title}>{title}</span>}
          {message && <span className={s.message}>{message}</span>}
        </div>
        <div className={`${s.input} ${className}`}>
          {startTest && <p className={s.startTest}>{startTest}</p>}{" "}
          <MaskedInput mask={mask || currencyMask} {...inputProps} {...input} />
        </div>
      </label>
      {isNotValid && !hideError && (
        <div className={s.tipError}>
          <AlertIcon /> {error}
        </div>
      )}
    </>
  );
};
