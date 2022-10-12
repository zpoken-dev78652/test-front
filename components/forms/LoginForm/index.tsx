import React from "react";
import cn from "classnames";
import { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { CustomButton } from "../..";
import { useAuth, useMediaQuery, useRedux } from "../../../hooks";
import { authAsync, selectAuthInfoMessage } from "../../../redux/auth";
import { Input } from "../../Input";
import { fingerprint } from "../../../helpers/fingerprint";
import { useRouter } from "next/router";
import { infoMessages, Routes } from "../../../constants";

import { validateLogin } from "../../../helpers";
import s from "./LoginForm.module.scss";
import { AlertIcon, LoginIcon } from "../../Icons";

export type LoginValuesType = {
  login: string;
  password: string;
};

const Login: React.FC<
  InjectedFormProps<LoginValuesType, LoginValuesType> & LoginValuesType
> = ({ login, password, valid }) => {
  const { push } = useRouter();
  const { loginWithEmailAndPass } = useAuth();
  const [select, dispatch] = useRedux();
  const isMobile = useMediaQuery("(max-width: 599.98px)");

  const authInfoMessage = select(selectAuthInfoMessage);

  const [errors, setErrors] = useState<{ [key: string]: any }>({});

  const logIn = async () => {
    if (!valid) return;
    try {
      const auth = firebase.auth();
      await auth.signInWithEmailAndPassword(login, password);
      const currentUser = await auth.currentUser?.getIdTokenResult();

      if (!currentUser) return;

      dispatch(
        authAsync({
          idToken: currentUser.token,
          fingerprint: fingerprint(),
        })
      );

      loginWithEmailAndPass(login, password);
    } catch (error) {
      if (error.code === "auth/user-not-found")
        return setErrors((err) => ({
          login:
            "Oops...We struggle to find anyone registered with this Email...Please check your data or ",
        }));
      if (error.code === "auth/wrong-password")
        return setErrors((err) => ({
          password:
            "Hmm... We remember you but the password seems to be wrong. Check your data or ",
        }));
    }
  };

  const handleLinkToRegister = () => push(Routes.REGISTER);
  const handleLinkToRestore = () => push(Routes.RESTORE);

  return (
    <form autoComplete="off" noValidate className={s.form}>
      <div>
        <div className={s.input}>
          <Field
            name="login"
            placeholder="Email Address"
            label="login"
            value={login}
            component={Input}
            errors={errors.login}
          />
          {errors.login && (
            <div className={s.tipError}>
              <AlertIcon /> {errors.login}{" "}
              <span className={s.link} onClick={handleLinkToRegister}>
                sign up.
              </span>
            </div>
          )}
        </div>
        <div className={s.input}>
          <Field
            name="password"
            type="password_restore"
            placeholder="Password"
            label="password"
            component={Input}
            errors={errors.password}
          />
          {errors.password && (
            <div className={s.tipError}>
              <AlertIcon /> {errors.password}{" "}
              <span className={s.link} onClick={handleLinkToRestore}>
                restore password.
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={s.button}>
        <CustomButton
          value="sign in"
          icon={<LoginIcon />}
          theme="violet"
          onClick={logIn}
          disabled={!valid}
          type="submit"
          loading={authInfoMessage.some(
            (el) => el === infoMessages.LOADING_AUTH_DATA
          )}
        />
      </div>
    </form>
  );
};

export const LoginForm = reduxForm<LoginValuesType, LoginValuesType>({
  form: "login",
  validate: validateLogin,
  shouldValidate: () => true,
})(Login);
