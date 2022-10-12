import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Onfido } from "../../../..";
import { errors } from "../../../../../constants";
import { useRedux } from "../../../../../hooks";
import { IconNotVerify } from "../../../../../public/icons";
import {
  postOnfidoSgkKey,
  profileActions,
  selectOnfidoKey,
  selectProfileError,
} from "../../../../../redux";
import {
  UserFullNameForm,
  UserFullNameValuesType,
} from "../../../../forms/UserFullNameForm";
import { InfoCircleIcon } from "../../../../Icons";

import s from "../WalletComponets.module.scss";

export const OnfidoContent = () => {
  const [select, dispatch] = useRedux();
  const onfidoText = useRef<HTMLDivElement>(null);

  const [showInfoText, setInfoText] = useState(false);
  const [height, setHeight] = useState(0);
  const [date, setDate] = useState<Date | null>(null);

  const { setOnfidoSdkKey } = profileActions;

  const profileError = select(selectProfileError);
  const onfidoKey = select(selectOnfidoKey);

  const handleFullName = (values: UserFullNameValuesType) => {
    dispatch(
      postOnfidoSgkKey({
        referrer: `${process.env.NEXT_PUBLIC_DOMAIN}/*`,
        ...values,
      })
    );
  };

  const updateHeight = () => {
    setHeight(onfidoText?.current?.offsetHeight || 0);
  };

  useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      dispatch(setOnfidoSdkKey(""));
      window.removeEventListener("resize", updateHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={s.contentOnfido}>
      {!onfidoKey && (
        <>
          <div className={s.onfidoText} ref={onfidoText}>
            <IconNotVerify className={s.icon} />
            <div className={s.contentIdentity}>
              <h3 className={s.title}>please Verify your identity</h3>
              <p className={s.desc}>
                Chronicle needs to verify your identity before you can access
                wallet services. The identity check can be performed via a
                webcam or a smartphone. Approval takes only a few minutes in
                most cases.
              </p>
            </div>
          </div>
          <div
            className={s.formWrapp}
            style={{ height: `calc(100% - ${height}px - 40px)` }}
          >
            <UserFullNameForm
              onSubmit={handleFullName}
              date={date}
              setDate={setDate}
            />
          </div>
        </>
      )}
      <div
        className={cn([s.onfidoWrapper], {
          [s.onfidoHide]: profileError !== errors.NO_ONFIDO_ID,
        })}
      >
        <Onfido
          onfidoKey={onfidoKey}
          onCompleteFunc={() => setInfoText(true)}
        />
        {showInfoText && (
          <div className={s.infoWrap}>
            <InfoCircleIcon size={12} className={s.icon} />
            <div>
              <h5 className={s.title}>Nothing happens?</h5>
              <p className={s.desc}>
                This page should have been restarted automatically after
                finishing verification. If nothing happens please restart the
                page manually.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
