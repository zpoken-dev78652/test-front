/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import { api, URLS } from "../../../api";
import { CustomButton, ItemBoughtErrorModal, Logo } from "../../../components";
import {
  USER_BAN,
  VERIFY_200,
  VERIFY_TOO_MANY_REQUESTS,
  VERIFY_REGISTER,
} from "../../../components/modals/ItemBoughtErrorModal/data";
import { errors, Routes } from "../../../constants";
import { useRedux } from "../../../hooks";
import {
  authActions,
  getLoginImgAsync,
  logout,
  selectAuthError,
  selectIsAuth,
  selectLoginImg,
} from "../../../redux";
import { ArrowLeftIcon } from "../../Icons";
import s from "./LoginLayout.module.scss";

type Props = {
  children: ReactNode;
  title?: string;
};

export const LoginLayout = ({ children }: Props) => {
  const [select, dispatch] = useRedux();
  const { pathname, push, replace } = useRouter();

  const error = select(selectAuthError);
  const isAuth = select(selectIsAuth);
  const loginBaner = select(selectLoginImg);
  const { setError } = authActions;

  const isLogin: boolean = pathname === Routes.LOGIN;
  const isRestore: boolean = pathname === Routes.RESTORE;

  useEffect(() => {
    if (isAuth) replace("/store");
  }, [isAuth]);

  useEffect(() => {
    if (
      error === errors.EMAIL_NOT_VERIFIED ||
      error === errors.EMAIL_HAS_BEEN_SENT
    )
      replace("/verify_email");
  }, [error]);

  const handleCloseModal = () => {
    dispatch(setError(""));
  };

  useEffect(() => {
    const userJson = localStorage.getItem("user");

    if (!userJson) {
      dispatch(logout("not user in login layout", true));
    }
  }, [pathname]);

  useEffect(() => {
    dispatch(getLoginImgAsync());
  }, []);

  const handleSignIn = () => push(Routes.LOGIN);
  return (
    <div className={s.container}>
      <div
        className={s.image}
        style={{ backgroundImage: `url(${loginBaner})` }}
      />
      <div className={s.header}>
        <Logo />
        <div className={s.rightSide}>
          {isRestore ? (
            <CustomButton
              theme="simple"
              value="Back to Sign in"
              style={{ marginLeft: "5%" }}
              iconLeft={<ArrowLeftIcon />}
              onClick={handleSignIn}
            />
          ) : (
            <div></div>
          )}
          <div className={s.linkRegister}>
            {isLogin || isRestore
              ? "Not registered yet? "
              : "Already have an account? "}
            <span
              onClick={() =>
                push(isLogin || isRestore ? Routes.REGISTER : Routes.LOGIN)
              }
            >
              {isLogin || isRestore ? "Sign up" : "Sign in"}
            </span>
          </div>
        </div>
      </div>
      <div className={s.content}>
        <div className={s.descriptions}></div>
        <div className={s.form}>{children}</div>
      </div>

      {error === USER_BAN && (
        <ItemBoughtErrorModal
          error={USER_BAN}
          listWithTitle={[{ title: "Reason:", value: error }]}
          onCancelClick={handleCloseModal}
        />
      )}

      {(error === VERIFY_200 ||
        error === VERIFY_REGISTER ||
        error === VERIFY_TOO_MANY_REQUESTS) && (
        <ItemBoughtErrorModal error={error} onCancelClick={handleCloseModal} />
      )}
    </div>
  );
};
