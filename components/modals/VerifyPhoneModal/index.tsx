import React, { FC, useState } from "react";
import { CustomAuthCode, PhoneNumberInput } from "../..";
import { errors } from "../../../constants";
import { useRedux } from "../../../hooks";
import { IconBigPhone } from "../../../public/icons";
import {
  globalActions,
  GlobalModals,
  selectProfileError,
  selectUserData,
  selectVerifyPhone,
  verifyPhoneNumberAsync,
} from "../../../redux";
import { CustomButton } from "../../CustomButton";
import { ArrowRightIcon } from "../../Icons";
import { Modal } from "../../Modal";

import s from "./VerifyPhoneModal.module.scss";

type VerifyPhoneModalProps = {
  handleClose: () => void;
};

export const VerifyPhoneModal: FC<VerifyPhoneModalProps> = ({
  handleClose,
}) => {
  const [select, dispatch] = useRedux();
  const [phoneCode, setPhoneCode] = useState<string>();

  const { setSettingsModalByKey } = globalActions;

  const verifyPhone = select(selectVerifyPhone);
  const user = select(selectUserData);
  const profileError = select(selectProfileError);

  const handleFinalize = () => {
    if (phoneCode?.length !== 6) return;
    dispatch(verifyPhoneNumberAsync({ phone: verifyPhone, code: phoneCode }));
  };

  return (
    <Modal onClose={handleClose} type="vertical">
      <div className={s.twoFaModal}>
        <div className={s.header}>Verify phone number</div>
        <div className={s.contentWrap}>
          {!user?.is_phone_verified ? (
            <>
              <div className={s.content}>
                <div>
                  <PhoneNumberInput
                    error={
                      profileError === errors.PHONE_ALREADY_REGISTERED
                        ? "It aeems like this phone number is already in use by another user. Please use another number."
                        : ""
                    }
                  />
                  <CustomAuthCode
                    onChange={setPhoneCode}
                    onComplete={handleFinalize}
                    className={s.authCode}
                    label={"Verification"}
                    list={[
                      profileError === errors.INVALID_PHONE_CODE ||
                      profileError === errors.INVALID_PHONE_NUMBER
                        ? profileError === errors.INVALID_PHONE_NUMBER
                          ? errors.INVALID_PHONE_NUMBER
                          : "It seems like this code is not the one that we've sent you, please check if the spelling is correct;"
                        : "After clicking “Get Code” you will receive a 6 digit confirmation code.",
                    ]}
                    isInvadil={
                      profileError === errors.INVALID_PHONE_CODE ||
                      profileError === errors.INVALID_PHONE_NUMBER
                    }
                    onSubmit={handleFinalize}
                    hideReset
                  />
                </div>
              </div>
              <div className={s.btns}>
                <CustomButton
                  value="verify"
                  disabled={phoneCode?.length !== 6 || verifyPhone.length < 8}
                  icon={<ArrowRightIcon />}
                  onClick={handleFinalize}
                />
              </div>
            </>
          ) : (
            <div className={s.congratulation}>
              <IconBigPhone className={s.icon} />
              <h4 className={s.title}>Number verified</h4>
              <p className={s.desc}>
                Your number has been confirmed and successfully verified
              </p>
              <CustomButton
                value="set up 2-factor authentication"
                icon={<ArrowRightIcon />}
                className={s.btn}
                onClick={() =>
                  dispatch(setSettingsModalByKey(GlobalModals.totp))
                }
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
