import { useRouter } from "next/router";
import React, { useState } from "react";
import { ReactNode } from "react";
import { SocialContainer } from "..";
import { Routes } from "../../constants";
import { useMediaQuery } from "../../hooks";

import s from "./LoginRightSide.module.scss";

type LoginRightSidePorps = {
  label: string | ReactNode;
  stepLabel?: number;
  totalSteps?: string;
  isTab?: boolean;
  isSocial?: boolean;
};

export const LoginRightSide: React.FC<LoginRightSidePorps> = ({
  label,
  stepLabel = null,
  children,
  totalSteps,
  isTab = false,
  isSocial = true,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const isMobile = useMediaQuery("(max-width: 599.98px)");
  const { pathname, push } = useRouter();

  const isLogin: boolean = pathname === Routes.LOGIN;
  const isVerifyEmail = pathname === Routes.VERIFY_EMAIL;

  return (
    <div className={s.formContainer}>
      {label && (
        <h2 className={s.h2}>
          {label}{" "}
          {stepLabel && (
            <span className={s.steps}>
              {stepLabel}
              {totalSteps && `/${totalSteps}`}
            </span>
          )}
        </h2>
      )}
      {isTab && (
        <div className={s.tab}>
          <div className={step === 1 ? s.check : ""} onClick={() => setStep(1)}>
            Step 1
          </div>
          <div className={step === 2 ? s.check : ""} onClick={() => setStep(2)}>
            Step 2
          </div>
        </div>
      )}
      {isSocial && !isVerifyEmail && (
        <div className={s.social}>
          <SocialContainer />
        </div>
      )}
      {children}
      <div className={s.linkRegisterWrap}>
        {isMobile && (
          <div className={s.linkRegister}>
            {isLogin ? (
              <>Not registered yet?</>
            ) : (
              <>Already have an account? </>
            )}
            <span
              onClick={() => push(isLogin ? Routes.REGISTER : Routes.LOGIN)}
            >
              Tap here to sign {!isLogin ? "in" : "up"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
