import React from "react";
import { apiAuth, URLS } from "../../api";
import { Logo } from "../../components";
import { IconEmail } from "../../public/icons";
import s from "./Unsubscribe.module.scss";

export const getServerSideProps = async (context: any) => {
  const res = context;

  try {
    await apiAuth.post(`${URLS.unsubscribe}`, {
      email_code: res?.query?.email_code,
    });
  } catch (error) {
    return {
      props: {
        error: error.response.data.error,
      },
    };
  }
};

type UnsubscribeProps = {
  error?: string;
};

export default function UnsubscribePage({ error }: UnsubscribeProps) {
  return (
    <div className={s.unsubscrib}>
      <div className={s.header}>
        <Logo />
      </div>
      <div className={s.contentWrap}>
        <div className={s.content}>
          <IconEmail className={s.icon} />
          <h1 className={s.title}>
            {error ? "Oops..." : "You have unsubscribed from our letters"}
          </h1>
          {error ? (
            <p className={s.errorDesc}>Something went wrong</p>
          ) : (
            <>
              <p className={s.desc}>
                The process of unsubscribing may take several days.
              </p>
              <p className={s.desc}>
                We believe that communication is necessary. After all, we have
                so much ahead of us that we can share with you. Maybe you need a
                little silence, we understand that ... But if you want to come
                back - we are always here!
              </p>
            </>
          )}
          {/* <CustomButton
            className={s.btn}
            value="re-subscribe"
            icon={<EmailIcon />}
          /> */}
        </div>
      </div>
    </div>
  );
}
