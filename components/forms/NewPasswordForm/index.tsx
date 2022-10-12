import React from "react";

import "firebase/auth";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { CustomButton } from "../..";
import { useRedux } from "../../../hooks";
import { selectAuthInfoMessage } from "../../../redux/auth";
import { Input } from "../../Input";
import { errors, infoMessages } from "../../../constants";

import { validateNewPassword } from "../../../helpers";
import s from "./NewPasswordForm.module.scss";
import { AlertIcon, LoginIcon } from "../../Icons";
import { selectProfileError } from "../../../redux";

type FiatWithdrawFormPropsType = {
  handleReset: (e: any) => void;
};

export type NewPasswordValuesType = {
  password: string;
};

const NewPassword: React.FC<
  InjectedFormProps<NewPasswordValuesType, FiatWithdrawFormPropsType> &
    FiatWithdrawFormPropsType
> = ({ valid, handleReset }) => {
  const [select] = useRedux();

  const authInfoMessage = select(selectAuthInfoMessage);
  const profileError = select(selectProfileError);

  return (
    <form
      autoComplete="off"
      noValidate
      className={s.form}
      onSubmit={handleReset}
    >
      <div>
        <div className={s.input}>
          <Field
            name="password"
            type="password"
            placeholder="Password"
            label="password"
            component={Input}
          />
          {profileError === errors.INVALID_ACTION_CODE && (
            <div className={s.tipError}>
              Unfortunately error happens, please update your email and try
              again
            </div>
          )}
        </div>
      </div>
      <div className={s.button}>
        <CustomButton
          value="submit"
          icon={<LoginIcon />}
          theme="violet"
          disabled={!valid}
          type="submit"
          loading={authInfoMessage.some(
            (el) => el === infoMessages.LOADING_AUTH_DATA
          )}
          onClick={handleReset}
        />
      </div>
    </form>
  );
};

export const NewPasswordForm = reduxForm<
  NewPasswordValuesType,
  FiatWithdrawFormPropsType
>({
  form: "resetPassword",
  validate: validateNewPassword,
  shouldValidate: () => true,
})(NewPassword);
