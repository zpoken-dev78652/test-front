import React, { useEffect } from "react";
import { errors } from "../../../../../helpers";
import { useRedux } from "../../../../../hooks";
import { IconNotVerify } from "../../../../../public/icons";
import {
  postOnfidoToken,
  selectOnfidoKey,
  selectProfileError,
} from "../../../../../redux";

import s from "../WalletComponets.module.scss";

export const OnfidoPandingText = () => {
  const [select, dispatch] = useRedux();

  const profileError = select(selectProfileError);
  const onfidoKey = select(selectOnfidoKey);

  useEffect(() => {
    if (profileError === errors.DECLINED_BY_ONFIDO && !onfidoKey) {
      dispatch(
        postOnfidoToken({ referrer: `${process.env.NEXT_PUBLIC_DOMAIN}/*` })
      );
    }
  }, [dispatch, profileError, onfidoKey]);

  return (
    <div className={s.contentOnfido}>
      <div className={s.onfidoPandingText}>
        <IconNotVerify className={`${s.icon}  ${s.procesIcon}`} />
        <div className={`${s.contentIdentity}`}>
          <h3 className={s.title}>
            {profileError === errors.CIRCLE_WALLET_RESTRICTED
              ? errors.CIRCLE_WALLET_RESTRICTED
              : "Your documents are still processing"}
          </h3>
          {profileError !== errors.CIRCLE_WALLET_RESTRICTED && (
            <p className={s.desc}>
              {profileError === errors.PENDING_ONFIDO
                ? `We're still reviewing your identity documents. Whilst
          most documents are approved within a couple of minutes, some
          might take a little longer. We'll reach out if we need
          to ask you to re-verify any details.`
                : "We need to perform a couple of additional checks. One of our team members will reach out to you within 24 hours."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
