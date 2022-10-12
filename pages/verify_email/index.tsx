import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { CustomButton, LoginLayout } from "../../components";
import { ArrowRightIcon } from "../../components/Icons";
import { errors, infoMessages, Routes } from "../../constants";
import { LoginRightSide, Meta } from "../../container";
import { useAuth, useRedux } from "../../hooks";
import { IconBigEmailTurquoise, IconEmail } from "../../public/icons";
import { selectProfileError, selectProfileInfoMessage } from "../../redux";

import s from "./VerifyEmail.module.scss";

export const getServerSideProps = async (context: any) => {
  const res = context;

  return {
    props: {
      email_code: res?.query?.email_code || "",
    },
  };
};

type VerifyEmailProps = {
  email_code?: string;
};

const VerifyEmail = ({ email_code }: VerifyEmailProps) => {
  const [select] = useRedux();
  const { verifyEmail, dispatchAuthAsync } = useAuth();
  const { push } = useRouter();
  const [idToken, setTdToken] = useState("");

  const profileError = select(selectProfileError);
  const profileInfoMessage = select(selectProfileInfoMessage);

  const errorEmail = profileError === errors.INVALID_ACTION_CODE;

  useEffect(() => {
    if (email_code && !idToken) {
      verifyEmail({ email_code });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email_code]);

  useEffect(() => {
    if (idToken && !email_code) {
      dispatchAuthAsync({
        idToken,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idToken]);

  const handleClick = () => {
    push(Routes.LOGIN);
  };

  useEffect(() => {
    setTdToken(localStorage.getItem("userIdToken") || "");
  }, []);

  return (
    <div className={s.wrapForm}>
      <Meta title="Chronicle | Verify Email" />
      <LoginRightSide label={!email_code ? "Confirm Email" : ""}>
        {email_code ? (
          <>
            {profileInfoMessage.some(
              (el) => el === infoMessages.LOADING_VERIFY_EMAIL
            ) ? (
              <div className={s.spiner}>
                <ClipLoader color={"#fff"} size={60} />
              </div>
            ) : (
              <div className={s.statusEmail}>
                <div className={s.wrapContent}>
                  {errorEmail ? (
                    <IconEmail className={s.iconEmail} />
                  ) : (
                    <IconBigEmailTurquoise className={s.iconEmail} />
                  )}
                  <div className={s.content}>
                    <h4 className={s.title}>
                      {errorEmail
                        ? "Email confirmation error"
                        : "Your email address has been verified"}
                    </h4>
                    <p className={s.desc}>
                      {errorEmail
                        ? "Unfortunately error happens, please update your email and try again"
                        : "Now you can start creating your collection!"}
                    </p>
                  </div>
                </div>
                {!errorEmail && (
                  <CustomButton
                    value="let's begin"
                    icon={<ArrowRightIcon />}
                    onClick={handleClick}
                  />
                )}
              </div>
            )}
          </>
        ) : (
          <p className={s.desc}>
            We&apos;ve sent you a letter with confirmation details. Please go to
            your Email service and follow the instructions to activate your
            account.{" "}
          </p>
        )}
      </LoginRightSide>
    </div>
  );
};

VerifyEmail.getLayout = function getLayout(page: any) {
  return <LoginLayout>{page}</LoginLayout>;
};

export default VerifyEmail;
