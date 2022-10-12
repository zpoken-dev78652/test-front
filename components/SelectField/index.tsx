/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import cn from "classnames";
import { WrappedFieldProps } from "redux-form";
import SelectReact from "react-select";
import CreatableSelect, { components } from "react-select";
import { IconSelectArrow } from "../../public/icons";
import s from "./SelectField.module.scss";

type val = {
  [key: string]: any;
};

type Input = {
  label?: string;
  errors?: string;
  disabled?: boolean;
  defaultValue?: string | null;
  isSearchable?: boolean;
  creatable?: boolean;
  placeholder?: string;
  options: { value: string; label: string }[];
};

const customStyles = {
  container: (base: val) => ({
    ...base,
    fontSize: "14px",
    fontFamily: "Montserrat",
    color: "#FFFFFF",
  }),
  control: (base: val, state: any) => {
    return {
      ...base,
      background: "rgba(255, 255, 255, 0.05)",
      boxShadow: "none",
      outline: "none",
      border: "none",
      borderBottom: "1px solid rgba(255,255,255, 0.2)",
      height: "36px",
    };
  },
  indicatorSeparator: (base: val) => ({
    ...base,
    display: "none",
  }),
  clearIndicator: (base: val) => ({
    ...base,
    display: "none",
  }),
  dropdownIndicator: (base: val, state: any) => ({
    ...base,
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "",
  }),
  menu: (base: val) => ({
    ...base,
    top: "40px",
  }),
  option: (base: any, state: { isFocused: any; isSelected: any }) => {
    const getBackground = () => {
      if (state.isSelected) {
        return "#d9d9d9";
      }
      if (state.isFocused) {
        return "#EBEDF0";
      }
      return "white";
    };
    return {
      ...base,
      transition: "all .3s",
      background: getBackground(),
      cursor: !state.isSelected && "pointer",
      color: "#111c24",
    };
  },
  singleValue: (base: val) => ({
    ...base,
    fontFamily: "Montserrat",
    color: "#FFFFFF",
    opacity: "0.4",
    fontStyle: "normal",
    fontSize: "12px",
    lineHeight: "14px",
  }),
};

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <IconSelectArrow />
    </components.DropdownIndicator>
  );
};

export const SelectField = (pr: WrappedFieldProps & Input) => {
  const {
    input,
    meta,
    label,
    disabled,
    defaultValue = "",
    placeholder = "",
    isSearchable = false,
    creatable,
    options,
    ...props
  } = pr;
  const { touched, invalid } = meta;

  const isNotValid = touched && invalid && !disabled;
  const errorLocate =
    meta.error && meta.error !== " "
      ? `validation.${meta.error}`
      : "validation.empty";

  useEffect(() => {
    if (defaultValue) {
      input.onChange(defaultValue);
    }
  }, []);

  useEffect(() => {
    if (meta.initial !== null && meta.initial !== undefined) {
      setValue(getValue(meta.initial));
    }
  }, [meta.initial]);

  const containerClass = cn(s.container, {
    [s.error]: isNotValid || "",
    [s.disabled]: disabled || "",
  });

  const getValue = (value: string | null) =>
    options.find((item) => {
      if (value) {
        return item.value === value;
      }
      return item.value === input.value;
    });

  const [value, setValue] = useState<any>(getValue(defaultValue));

  const onFocus = () => {
    input.onChange("");
    setValue(null);
  };

  const onblur = (e: any) => {
    if (!e) return;
  };

  const onChange = (e: any) => {
    if (!e) return;
    input.onChange(e.value);
    setValue(getValue(e.value));
  };

  useEffect(() => {
    if (input.value === "") setValue({ value: "", label: placeholder });
  }, [input.value]);

  return (
    <div className={containerClass}>
      <label className={s.label}>{label}</label>
      {creatable && (
        <div className={s.selectField}>
          <CreatableSelect
            isClearable
            maxMenuHeight={190}
            isDisabled={disabled}
            options={options}
            defaultValue={getValue(defaultValue)}
            {...props}
            onChange={onChange}
            placeholder={placeholder}
            styles={customStyles}
            onFocus={onFocus}
            onBlur={onblur}
            isSearchable
            value={value}
            className={cn({ "react-select-error": isNotValid })}
            blurInputOnSelect
          />
          {isNotValid && (
            <div className={s.tipError}>
              {/* <FormattedMessage id={errorLocate} /> */}
            </div>
          )}
        </div>
      )}
      {!creatable && (
        <div className={s.selectField}>
          <SelectReact
            maxMenuHeight={190}
            isDisabled={disabled}
            options={options}
            value={value}
            defaultValue={getValue(defaultValue)}
            {...props}
            onChange={onChange}
            placeholder={placeholder}
            styles={customStyles}
            isSearchable={isSearchable}
            components={{ DropdownIndicator }}
          />
        </div>
      )}

      {isNotValid && (
        <div className={s.tipError}>
          {/* <FormattedMessage id={errorLocate} /> */}
        </div>
      )}
    </div>
  );
};
