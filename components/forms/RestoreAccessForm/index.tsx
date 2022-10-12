import React, { FormEvent, MouseEvent, useState } from "react";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { CustomButton } from "../..";
import { errors, infoMessages } from "../../../constants";
import { validateRestore } from "../../../helpers";
import { AlertIcon, ArrowRightIcon } from "../../Icons";
import { Input } from "../../Input";
import s from "./RestoreAccessForm.module.scss";
import { useRedux } from "../../../hooks";
import {
  resetPasswordAsync,
  selectProfileError,
  selectProfileInfoMessage,
} from "../../../redux";

export type RestorePropsType = {
  email: string;
};

export type RestoreValuesType = {
  email?: string;
};

const Restore: React.FC<
  InjectedFormProps<RestoreValuesType, RestorePropsType> & RestorePropsType
> = ({ email, valid }) => {
  const [select, dispatch] = useRedux();
  const [isShowMsg, setIsShowMsg] = useState(false);

  const profileError = select(selectProfileError);
  const profileInfoMessage = select(selectProfileInfoMessage);

  const restorePass = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsShowMsg(true);
    dispatch(resetPasswordAsync({ email }));
  };

  return (
    <>
      <form
        autoComplete="off"
        noValidate
        className={s.form}
        onSubmit={restorePass}
      >
        <div className={s.input}>
          <Field
            name="email"
            placeholder="Enter email address"
            label="email"
            component={Input}
            descriptions="Make sure to enter the email you' ve registered with."
          />
          {isShowMsg &&
            profileError !== errors.USER_NOT_FOUND &&
            profileError !== errors.SPAM_EMAIL &&
            !profileInfoMessage.some(
              (el) => el === infoMessages.LOADING_RESET_PASS
            ) && <div className={s.info}>Check your email : {email}</div>}

          {(profileError === errors.USER_NOT_FOUND ||
            profileError === errors.SPAM_EMAIL) && (
            <div className={s.tipError}>
              <AlertIcon />{" "}
              {profileError === errors.SPAM_EMAIL
                ? "Sorry, but you sent too many sms at the same time, please try again later."
                : profileError}
            </div>
          )}
        </div>

        <CustomButton
          value={"Restore Password"}
          theme="violet"
          icon={<ArrowRightIcon />}
          style={{ letterSpacing: "0.15em", height: "36px" }}
          onClick={restorePass}
          disabled={!valid || isShowMsg}
          loading={profileInfoMessage.some(
            (el) => el === infoMessages.LOADING_RESET_PASS
          )}
        />
      </form>
    </>
  );
};

export const RestoreAccessForm = reduxForm<RestoreValuesType, RestorePropsType>(
  {
    form: "restore",
    validate: validateRestore,
    shouldValidate: () => true,
  }
)(Restore);
