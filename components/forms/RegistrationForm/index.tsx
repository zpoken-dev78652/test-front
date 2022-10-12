import React from "react";
import cn from "classnames";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { CustomButton } from "../..";
import { fingerprint } from "../../../helpers/fingerprint";
import { useRedux } from "../../../hooks";
import firebase from "firebase/app";
import "firebase/auth";
import { selectIsUnique, authAsync } from "../../../redux/auth";
import { Input } from "../../Input";
import { TypeState } from "../../../pages/sign_up";
import { validateRegistration } from "../../../helpers";
import s from "./RegistrationForm.module.scss";
import { AlertIcon, ArrowRightIcon } from "../../Icons";

type RegistrationPropsType = {
  data: TypeState;
  errors: { [key: string]: string };
  changeError: (errorObj: { [key: string]: string }) => void;
};

export type RegistrationValuesType = {
  login: string;
  password: string;
};

const Registration: React.FC<
  InjectedFormProps<RegistrationValuesType, RegistrationPropsType> &
    RegistrationPropsType
> = ({ data, errors, changeError, valid }) => {
  const [select, dispatch] = useRedux();

  const isUnique: boolean | null = select(selectIsUnique);

  const addUser = async () => {
    if (!valid || isUnique === false) return;

    const formData: any = {
      email: data.email,
    };

    try {
      const auth = firebase.auth();
      await auth.createUserWithEmailAndPassword(data.email, data.password);
      const currentUser: any = await auth.currentUser;
      const currentUserToken = await currentUser?.getIdTokenResult();

      if (!currentUser) return;

      dispatch(
        authAsync({
          ...formData,
          idToken: currentUserToken.token,
          fingerprint: fingerprint(),
        })
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use")
        return changeError({
          login: "Oops, this email seems to be already taken...",
        });
    }
  };

  return (
    <form autoComplete="off" noValidate className={s.form}>
      <div className={s.container}>
        <div className={s.wrapInputs}>
          <div className={s.input}>
            <Field
              name="email"
              label="Email"
              placeholder="Email"
              component={Input}
              errors={errors.login}
            />
            {errors.login && (
              <div className={s.tipError}>
                <AlertIcon /> {errors.login}
              </div>
            )}
          </div>

          <div className={s.input}>
            <Field
              name="password"
              type="password"
              placeholder="Password"
              label="password"
              component={Input}
            />
            <ul>
              <li>Password needs to be at least 8 characters long.</li>
              <li>
                Password must include at least one digit, lowercase and capital
                symbols
              </li>
            </ul>
          </div>
          <div className={cn(s.input, s.checkbox)}>
            <Field
              name="checkbox"
              type="checkbox"
              className={s.inputCheckbox}
              label={
                <div className={s.label}>
                  I have read and I accept Chronicle’s{" "}
                  <a
                    href="https://www.chronicle.io/terms"
                    target="_blank"
                    rel="noreferrer"
                  >
                    terms of use{" "}
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.chronicle.io/privacy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    privacy policy.
                  </a>
                </div>
              }
              component={Input}
            />
          </div>
        </div>
        <div className={s.button}>
          <CustomButton
            value="Next"
            theme="violet"
            icon={<ArrowRightIcon />}
            type="button"
            onClick={addUser}
            disabled={!valid || isUnique === false}
          />
        </div>
      </div>
    </form>
  );
};

export const RegistrationForm = reduxForm<
  RegistrationValuesType,
  RegistrationPropsType
>({
  form: "registration",
  validate: validateRegistration,
  shouldValidate: () => true,
})(Registration);
