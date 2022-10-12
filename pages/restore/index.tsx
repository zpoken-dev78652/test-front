import { useState } from "react";
import {
  CustomAuthCode,
  CustomButton,
  LoginLayout,
  RestoreAccessForm,
  RestorePropsType,
} from "../../components";
import {
  NewPasswordForm,
  NewPasswordValuesType,
} from "../../components/forms/NewPasswordForm";
import { ArrowRightIcon } from "../../components/Icons";
import { infoMessages } from "../../constants";
import { LoginRightSide, Meta } from "../../container";
import { useAuth, useRedux } from "../../hooks";
import {
  selectProfileInfoMessage,
  selectUserData,
  verifyTotpAsyc,
} from "../../redux";
import s from "./Restore.module.scss";

const initState = {
  email: "",
};

const initPasswordState = {
  password: "",
};

type RestoreProps = {
  oobCode?: string;
};

export const getServerSideProps = async (context: any) => {
  const res = context;

  return {
    props: {
      oobCode: res?.query?.oobCode || "",
    },
  };
};

const Restore = ({ oobCode }: RestoreProps) => {
  const [select, dispatch] = useRedux();
  const { restorePassword } = useAuth();
  const [formEmail, setFormEmail] = useState<RestorePropsType>(initState);
  const [formPass, setFormPass] =
    useState<NewPasswordValuesType>(initPasswordState);
  const [authCode, setAuthCode] = useState<string>();

  const user = select(selectUserData);
  const profileInfoMessage = select(selectProfileInfoMessage);

  const formChange = (val: RestorePropsType) =>
    setFormEmail((state) => ({ ...state, ...val }));
  const formChangePass = (val: NewPasswordValuesType) =>
    setFormPass((state) => ({ ...state, ...val }));

  const handleRestore = (e: any) => {
    e.preventDefault();

    if (oobCode) {
      restorePassword({
        actionCode: oobCode,
        newPass: formPass.password,
      });
    }
  };

  const handleTwoFa = () => {
    if (
      authCode?.length !== 6 ||
      profileInfoMessage.some((el) => el === infoMessages.LOADING_TOTP)
    )
      return;

    dispatch(verifyTotpAsyc({ code: authCode }));
  };

  return (
    <div className={s.wrapForm}>
      <Meta title="Chronicle | Restore" />
      <div className={s.mobileHeader}>Restore password</div>
      <LoginRightSide label="Restore access to Chronicle" isSocial={false}>
        {oobCode ? (
          <>
            {user.id && user.is_totp_active ? (
              <div className={s.twoFaWrapper}>
                <CustomAuthCode
                  onChange={setAuthCode}
                  className={s.authCode}
                  label={"Verification"}
                  list={[
                    "Copy and paste or type in the pass from your authentication app (such as Duo or Google Authenticator)",
                  ]}
                  onSubmit={handleTwoFa}
                  onComplete={handleTwoFa}
                  hideReset
                />
                <CustomButton
                  value="next"
                  disabled={
                    authCode?.length !== 6 ||
                    profileInfoMessage.some(
                      (el) => el === infoMessages.LOADING_TOTP
                    )
                  }
                  icon={<ArrowRightIcon />}
                  onClick={handleTwoFa}
                />
              </div>
            ) : (
              <NewPasswordForm
                onChange={formChangePass}
                handleReset={handleRestore}
              />
            )}
          </>
        ) : (
          <RestoreAccessForm onChange={formChange} email={formEmail.email} />
        )}
      </LoginRightSide>
    </div>
  );
};

Restore.getLayout = function getLayout(page: any) {
  return <LoginLayout>{page}</LoginLayout>;
};

export default Restore;
