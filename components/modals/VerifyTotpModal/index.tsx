import React, { FC, useEffect, useState } from "react";
import { CustomAuthCode } from "../..";
import { errors } from "../../../constants";
import { useRedux } from "../../../hooks";
import { IconBigLock } from "../../../public/icons";
import {
  globalActions,
  GlobalModals,
  logout,
  selectProfileError,
  selectQrData,
  selectUserData,
  setupTwoFaAsync,
} from "../../../redux";
import { CustomButton } from "../../CustomButton";
import { ArrowRightIcon } from "../../Icons";
import { Modal } from "../../Modal";
import { QRCode } from "../../QRCode";

import s from "./VerifyTotpModal.module.scss";

type VerifyTotpModalProps = {
  handleClose: () => void;
};

export const VerifyTotpModal: FC<VerifyTotpModalProps> = ({ handleClose }) => {
  const [select, dispatch] = useRedux();
  const [authCode, setAuthCode] = useState<string>();

  const qrData = select(selectQrData);
  const profileError = select(selectProfileError);
  const user = select(selectUserData);

  const { setSettingsModalByKey } = globalActions;

  const handleFinalize = () => {
    if (authCode?.length !== 6) return;
    dispatch(setupTwoFaAsync({ code: authCode }));
  };

  useEffect(() => {
    if (user?.is_phone_verified) {
      dispatch(setupTwoFaAsync({}));
    }
  }, [dispatch, user?.is_phone_verified]);

  useEffect(() => {
    if (!user?.is_phone_verified) {
      dispatch(setSettingsModalByKey(GlobalModals.phone));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    handleClose();
    if (user?.is_totp_active) {
      dispatch(logout("close totp"));
    }
  };

  return (
    <Modal onClose={closeModal} type="vertical">
      <div className={s.twoFaModal}>
        <div className={s.header}>set up 2-factor authentication</div>
        <div className={s.contentWrap}>
          {!user?.is_totp_active ? (
            <>
              <div className={s.content}>
                <QRCode
                  value={qrData.link}
                  secret={qrData.secret}
                  loading={!qrData.link}
                />
                <CustomAuthCode
                  onChange={setAuthCode}
                  className={s.authCode}
                  label={"Verification"}
                  list={[
                    profileError === errors.INVALID_TOTP_CODE
                      ? "Invalid code. Please try again."
                      : "Copy and paste or type in the pass from your authentication app (such as Duo or Google Authenticator)",
                  ]}
                  isInvadil={profileError === errors.INVALID_TOTP_CODE}
                  onSubmit={handleFinalize}
                  onComplete={handleFinalize}
                  hideReset
                />
              </div>
              <div className={s.btns}>
                <CustomButton
                  value="next"
                  disabled={authCode?.length !== 6}
                  icon={<ArrowRightIcon />}
                  onClick={handleFinalize}
                />
              </div>
            </>
          ) : (
            <div className={s.congratulation}>
              <IconBigLock className={s.icon} />
              <h4 className={s.title}>2FA is set successfully</h4>
              <p className={s.desc}>
                Authentication method is set up and ready. Please re-sign in
                with your new 2FA code.
              </p>
              <CustomButton
                value="okay"
                icon={<ArrowRightIcon />}
                className={s.btn}
                onClick={closeModal}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
