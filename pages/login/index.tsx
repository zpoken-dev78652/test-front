import { useState } from "react";
import {
  CustomAuthCode,
  CustomButton,
  LoginForm,
  LoginLayout,
  LoginValuesType,
} from "../../components";
import { ArrowRightIcon } from "../../components/Icons";
import { errors, infoMessages } from "../../constants";
import { LoginRightSide, Meta } from "../../container";
import { useInterval, useRedux } from "../../hooks";
import {
  profileActions,
  resetTotpAsync,
  selectProfileError,
  selectProfileInfoMessage,
  selectUserData,
  verifyTotpAsyc,
} from "../../redux";
import s from "./Login.module.scss";

const initState = {
  login: "",
  password: "",
};

const Login = () => {
  const [select, dispatch] = useRedux();
  const [form, setForm] = useState<LoginValuesType>(initState);
  const [authCode, setAuthCode] = useState<string>();
  const [isReset, setIsReset] = useState(false);
  const [time, setTime] = useState(0);

  const user = select(selectUserData);
  const profileInfoMessage = select(selectProfileInfoMessage);
  const profileError = select(selectProfileError);

  const { setInfoMessage } = profileActions;

  const changeForm = (val: LoginValuesType) =>
    setForm((state) => ({ ...state, ...val }));

  const handleTwoFa = () => {
    if (
      authCode?.length !== 6 ||
      profileInfoMessage.some((el) => el === infoMessages.LOADING_TOTP)
    )
      return;

    if (isReset) {
      dispatch(resetTotpAsync({ code: authCode }));
      return;
    }

    dispatch(verifyTotpAsyc({ code: authCode }));
  };

  const resetAuth = () => {
    setTime(60);
    dispatch(resetTotpAsync({}));
    setIsReset(true);
    dispatch(setInfoMessage(infoMessages?.CLEAR_AUTH_CODE));
  };

  useInterval(
    () => {
      setTime((prevState) => prevState - 1);
    },
    time > 0 ? 1000 : null
  );

  const loginList = [
    profileError === errors.INVALID_TOTP_CODE
      ? "Invalid code. Please try again."
      : "Enter the 6-digit code from your authentication app (such as Duo or Google Authenticator)",
  ];

  const restoreList = [
    profileError === errors.INVALID_PHONE_CODE ||
    profileError === errors.SMS_MANY_REQUSTS
      ? profileError === errors.SMS_MANY_REQUSTS
        ? "Sorry, but you sent too many sms at the same time, please try again later."
        : "It seems like this code is not the one that we've sent you, please check if the spelling is correct;"
      : "You will receive 6 digits confirmation code.",
  ];

  return (
    <div className={s.wrapForm}>
      <Meta title="Chronicle | Sign in" />
      {user.id && !user.is_totp_active && (
        <div className={s.mobileHeader}>Sign in</div>
      )}
      {user.id && user.is_totp_active ? (
        <div className={s.twoFaWrapper}>
          <CustomAuthCode
            onChange={setAuthCode}
            className={s.authCode}
            label="SECURITY VERIFICATION"
            btnValue={`Reset Authenticator ${time > 0 ? `(${time})` : ""}`}
            list={isReset ? restoreList : loginList}
            isInvadil={
              profileError === errors.INVALID_TOTP_CODE ||
              profileError === errors.INVALID_PHONE_CODE ||
              profileError === errors.SMS_MANY_REQUSTS
            }
            onSubmit={handleTwoFa}
            onComplete={handleTwoFa}
            resetFunc={resetAuth}
            disableBtn={time > 0}
            autoFocus
          />
          <CustomButton
            value="next"
            disabled={
              authCode?.length !== 6 ||
              profileInfoMessage.some((el) => el === infoMessages.LOADING_TOTP)
            }
            icon={<ArrowRightIcon />}
            onClick={handleTwoFa}
          />
        </div>
      ) : (
        <LoginRightSide label="Sign in to Chronicle">
          <LoginForm
            onChange={changeForm}
            login={form.login}
            password={form.password}
          />
        </LoginRightSide>
      )}
    </div>
  );
};

Login.getLayout = function getLayout(page: any) {
  return <LoginLayout>{page}</LoginLayout>;
};

export default Login;
