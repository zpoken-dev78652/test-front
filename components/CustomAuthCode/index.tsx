import cn from "classnames";
import React, { FC, useEffect, useRef, useState } from "react";
import ReactCodeInput from "react-verification-code-input";
import { infoMessages } from "../../constants";
import { useRedux } from "../../hooks";
import {
  globalActions,
  profileActions,
  selectProfileInfoMessage,
} from "../../redux";
import { CustomButton } from "../CustomButton";
import s from "./CustomAuthCode.module.scss";
import { CustomAuthCodeProps, ReactCodeInputType } from "./CustomAuthCode.type";

export const CustomAuthCode: FC<CustomAuthCodeProps & ReactCodeInputType> = ({
  className,
  label,
  list,
  isInvadil,
  fields = 6,
  onSubmit = () => {},
  autoFocus = false,
  disabledSubmit,
  hideReset,
  onChange = () => {},
  onComplete,
  resetFunc,
  btnValue,
  disableBtn,
  ...rest
}) => {
  const [select, dispatch] = useRedux();
  const authCodeInput = useRef<ReactCodeInput>();

  const [value, setValue] = useState("");

  const profileInfoMessage = select(selectProfileInfoMessage);

  const { removeInfoMessage } = profileActions;
  const { setSettingsModas } = globalActions;

  const onSubmitFunc = (e: any) => {
    if (e?.charCode === 13 && !disabledSubmit) {
      onSubmit();
    }
  };

  const handleChange = (e: string) => {
    onChange(e);
    setValue(e);
  };

  const handleResetAuthenticator = () => {
    dispatch(setSettingsModas({ profile: true, resetTotp: true }));
  };

  useEffect(() => {
    if (value.length === fields && onComplete) {
      onComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (profileInfoMessage.some((el) => el === infoMessages?.CLEAR_AUTH_CODE)) {
      authCodeInput?.current?.__clearvalues__();
      dispatch(removeInfoMessage(infoMessages.CLEAR_AUTH_CODE));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileInfoMessage]);

  return (
    <div
      className={cn(className, { [s.isInvadil]: isInvadil })}
      onKeyPress={onSubmitFunc}
    >
      <div className={s.labelWral}>
        {label && <h4 className={s.label}>{label}</h4>}
        {!hideReset && (
          <CustomButton
            theme="link"
            value={btnValue || "Reset Authenticator"}
            className={s.resetBtn}
            onClick={resetFunc ? resetFunc : handleResetAuthenticator}
            disabled={disableBtn}
          />
        )}
      </div>
      <div className={`verification`}>
        <ReactCodeInput
          className={s.code}
          autoFocus={autoFocus}
          ref={authCodeInput}
          onChange={handleChange}
          {...rest}
        />
      </div>
      <div className={s.list}>
        {list?.map((item, idx) => (
          <p key={idx} className={s.item}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};
