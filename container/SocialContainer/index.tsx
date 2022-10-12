import { useRouter } from "next/router";
import React from "react";
import { AppleIcon, FacebookIcon, GoogleIcon } from "../../components/Icons";
import { useAuth, useMediaQuery } from "../../hooks";
import s from "./SocialContainer.module.scss";

type SocialContainerProps = {};

export const SocialContainer: React.FC<SocialContainerProps> = () => {
  const { pathname } = useRouter();
  const isLogin = pathname === "/login" || pathname === "/";
  const { facebookAuth, googleAuth, appleAuth } = useAuth();
  const isMobile = useMediaQuery("(max-width: 599.98px)");

  return (
    <>
      <div className={s.container}>
        <div className={s.apple} onClick={() => appleAuth()}>
          <AppleIcon className={s.icon} />
          <span className={s.text}>
            {!isMobile
              ? isLogin
                ? "sign in with apple"
                : "sign up with apple"
              : "apple"}
          </span>
        </div>
        <div className={s.google} onClick={() => googleAuth()}>
          <GoogleIcon className={s.icon} />
          <span className={s.text}>
            {!isMobile
              ? isLogin
                ? "sign in with google"
                : "sign up with google"
              : "google"}
          </span>
        </div>
        <div className={s.facebook} onClick={() => facebookAuth()}>
          <FacebookIcon className={s.icon} />
          <span className={s.text}>
            {!isMobile
              ? isLogin
                ? "sign in with facebook"
                : "sign up with facebook"
              : "facebook"}
          </span>
        </div>
      </div>
      <div className={s.or}>
        <span className={s.line}></span>
        <span> {isMobile ? "Or sign in with:" : "or"}</span>
        <span className={s.line}></span>
      </div>
    </>
  );
};
