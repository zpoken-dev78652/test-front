import React from "react";
import cn from "classnames";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import MaskedInput, { ConformToMaskConfig } from "react-text-mask";
import { WrappedFieldProps } from "redux-form";
import s from "./PriceInput.module.scss";
import { AlertIcon } from "../Icons";
import { SelectOption } from "../../types";
import { CustomSelect } from "../CustomSelect";
import { curencyForSelect } from "../../constants";

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

interface CurrencyInput extends ConformToMaskConfig {
  value?: number | string;
  error?: boolean;
  startTest?: string;
  title?: string;
  message?: string;
  errorMessage?: string;
  onChange?: (e: number) => void;
  currency?: SelectOption;
  setCurrency?: (e: SelectOption) => void;
  name: string;
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

export const PriceInput = ({
  maskOptions,
  value,
  title,
  error,
  message,
  startTest,
  onChange,
  name,
  currency,
  setCurrency,
  errorMessage,
  ...inputProps
}: CurrencyInput) => {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    ...maskOptions,
  });

  return (
    <label
      className={cn([s.priceInput], { [s.isError]: error || errorMessage })}
    >
      {title && (
        <div className={s.content}>
          <span className={s.title}>{title}</span>
          <span className={s.message}>{message || "min $0.80 max $10K"}</span>
        </div>
      )}

      <div className={s.inputWrapper}>
        {currency && setCurrency && (
          <CustomSelect
            theme="phone"
            value={currency}
            onChange={setCurrency}
            options={curencyForSelect}
            className={s.select}
          />
        )}
        <div className={s.input}>
          {startTest && (
            <p className={cn(s.startTest, startTest)}>{startTest}</p>
          )}{" "}
          <MaskedInput
            value={value}
            onChange={onChange ? (e: any) => onChange(e) : undefined}
            mask={currencyMask}
            name={name}
            id={name.replaceAll(" ", "_")}
            {...inputProps}
          />
        </div>
      </div>
      {errorMessage && <div className={s.tipError}>{errorMessage}</div>}
    </label>
  );
};

export const PriceInputReduxForm = ({
  maskOptions,
  title,
  message,
  startTest,
  meta,
  input,
  errorMessage,
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
        className={cn([s.priceInput], {
          [s.isError]: isNotValid || errorMessage,
        })}
      >
        <div className={s.content}>
          <span className={s.title}>{title || "name your price"}</span>
          <span className={s.message}>{message || "min $0.80 max $25K"}</span>
        </div>
        <div className={s.input}>
          {startTest && (
            <p className={cn(s.startTest, startTest)}>{startTest}</p>
          )}{" "}
          <MaskedInput mask={currencyMask} {...inputProps} {...input} />
        </div>
      </label>
      {(errorMessage || isNotValid) && (
        <div className={s.tipError}>
          <AlertIcon /> {errorMessage || error}
        </div>
      )}
    </>
  );
};
