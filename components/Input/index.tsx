import React, { useRef, useState } from "react";
import { WrappedFieldProps } from "redux-form";
import cn from "classnames";
import { IconNotValidUsername, IconValidUsername } from "../../public/icons";
import { Eye } from "..";
import Link from "next/link";
import { Routes } from "../../constants";
import s from "./Input.module.scss";

type TypeInput = {
  type?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (val: any) => any;
  name?: string;
  placeholder?: string;
  label?: string | any;
  style?: { [key: string]: string };
  errors?: boolean;
  checked?: boolean;
  descriptions?: string;
};

export const Input: React.FC<WrappedFieldProps & TypeInput> = (props) => {
  const {
    disabled,
    label,
    meta,
    input,
    type = "text",
    errors,
    checked,
    descriptions,
  } = props;
  const [eyeOpen, setEyeOpen] = useState(false);
  const inputRef = useRef<any>(null);

  const { touched, invalid } = meta;

  const handlerClickEye = () => {
    setEyeOpen(!eyeOpen);
  };

  const isNotValid = touched && invalid;

  const errorLocate =
    meta.error && meta.error !== " " ? meta.error : "meta.error";

  const inputType =
    (type === "password" || type === "password_restore") && eyeOpen
      ? "text"
      : type === "password_restore"
      ? "password"
      : type;

  const containerClass = cn({
    [s.container]: true,
    [s.error]: isNotValid,
    [s.autherror]: errors,
    [s.lengthError]:
      (inputRef && inputRef.current && inputRef.current.value
        ? inputRef.current.value.length
        : 0) > 30,
  });

  if (type === "checkbox") {
    return (
      <label className={s.checkbox}>
        <input type="checkbox" {...input} {...props} />
        <div className={`${s.checkbox_text} ${input.checked ? s.checked : ""}`}>
          {label}
        </div>
      </label>
    );
  }

  if (type === "username") {
    const inputValueLength =
      inputRef && inputRef.current && inputRef.current.value
        ? inputRef.current.value.length
        : "0";
    return (
      <div className={containerClass}>
        <label className={s.label}>
          <div className={s.descContainer}>
            {label && <div className={s.text}>{label}</div>}
            {descriptions && (
              <div className={s.descriptions}>{descriptions}</div>
            )}
          </div>
          <div className={s.wrapInput}>
            <input
              {...props}
              {...input}
              className={s.input}
              type={inputType}
              ref={inputRef}
            />
            <div
              className={
                !isNotValid && inputValueLength <= 30
                  ? s.checkContainer
                  : s.notValidContainer
              }
            >
              <span className={s.span}>{inputValueLength}/30</span>{" "}
              {!isNotValid && inputValueLength <= 30 ? (
                <IconValidUsername className={s.iconValidUser} />
              ) : (
                <IconNotValidUsername className={s.icon} />
              )}
            </div>
          </div>
        </label>
        {isNotValid && <div className={s.tipError}>{errorLocate}</div>}
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <label className={s.label}>
        <div className={s.descContainer}>
          {label && <div className={s.text}>{label}</div>}
          {type === "password_restore" && (
            <Link href={Routes.RESTORE}>
              <a className={s.forgotLink}>Forgot password</a>
            </Link>
          )}
        </div>
        {descriptions && <div className={s.descriptions}>{descriptions}</div>}
        <input {...props} {...input} className={s.input} type={inputType} />
        {isNotValid && <div className={s.tipError}>{errorLocate}</div>}
        {(type === "password" || type === "password_restore") && (
          <div className={s.eyeContainer} onClick={handlerClickEye}>
            <Eye open={eyeOpen} disabled={disabled} />
          </div>
        )}
      </label>
    </div>
  );
};
