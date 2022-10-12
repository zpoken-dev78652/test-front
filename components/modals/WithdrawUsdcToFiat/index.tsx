import React, { useEffect, useState } from "react";
import { change } from "redux-form";
import { CustomButton, FiatWithdrawForm, ItemBoughtErrorModal } from "../..";
import { errors, infoMessages } from "../../../constants";
import { priceToNumber } from "../../../helpers";
import { useRedux } from "../../../hooks";
import {
  getCircleKey,
  postWithdrawWithCircle,
  profileActions,
  selectCircleKey,
  selectProfileInfoMessage,
  selectWalletError,
} from "../../../redux";
import { SelectOption } from "../../../types";
import { ArrowRightIcon } from "../../Icons";
import { VerticalModal } from "../VerticalModal";

import s from "./WithdrawUsdcToFiat.module.scss";

export const WithdrawUsdcToFiat = () => {
  const [select, dispatch] = useRedux();

  const {
    closeAllProfileModal,
    setSelectWallet,
    setSelectTab,
    setProfileModalByKey,
    removeInfoMessage,
  } = profileActions;

  const handleBack = () => {
    dispatch(setProfileModalByKey("wallet"));
  };

  const handleCloseWalletModal = () => {
    dispatch(closeAllProfileModal());
    dispatch(setSelectWallet(""));
    dispatch(setSelectTab("deposit"));
  };

  const [authCode, setAuthCode] = useState("");
  const [validForm, setValidForm] = useState();
  const [selectDistrict, setDistrict] = useState<SelectOption>();

  const form = select((state) => state.form.fiatWithdraw);
  const circleKey = select(selectCircleKey);
  const profileInfoMesg = select(selectProfileInfoMessage);
  const walletError = select(selectWalletError);

  const handleFormSubmit = async () => {
    if (!form || !circleKey) return;

    const data = {
      keyId: circleKey.keyId,
      name: form.values?.name,
      city: form.values?.city,
      country: form.values?.country,
      line1: form.values?.addressLine_1,

      amount: priceToNumber(form.values?.amount),
      postalCode: form.values?.postalCode,
      district: form.values?.district,

      bankCity: form.values?.bankCity,
      bankName: form.values?.bankName,
      bankCountry: form.values?.bankSelectCountry,
      fullCountry: form.values?.selectCountryBank,

      totp_code: authCode,

      ...(form.values?.addressLine_2 && { line2: form.values?.addressLine_2 }),
      ...(form.values?.selectBank !== "Non US Bank Account - IBAN Supported"
        ? {
            accountNumber: form.values?.accountNumber,
            routingNumber: form.values?.routingNumber,
          }
        : {
            iban: form.values?.accountNumber,
          }),
    };
    dispatch(postWithdrawWithCircle(data));
  };

  const handleClose = () => {
    dispatch(removeInfoMessage("full"));
  };

  useEffect(() => {
    if (!selectDistrict) return;
    dispatch(change("fiatWithdraw", "district", selectDistrict?.value));
  }, [dispatch, selectDistrict]);

  useEffect(() => {
    dispatch(getCircleKey());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VerticalModal
      header="Withdraw USCD with fiat"
      onClose={handleCloseWalletModal}
      handleBack={handleBack}
      isCloseBtnHidden
    >
      <div className={s.container}>
        <div className={s.content} id="WithdrawContent">
          <FiatWithdrawForm
            setValidForm={setValidForm}
            onSubmit={handleFormSubmit}
            selectDistrict={selectDistrict}
            setDistrict={setDistrict}
            authCode={authCode}
            setAuthCode={setAuthCode}
            handleFormSubmit={handleFormSubmit}
          />
        </div>
        <div className={s.btn}>
          <CustomButton
            value="Back"
            theme="transparent"
            onClick={handleBack}
            iconLeft={
              <span className={s.icon}>
                <ArrowRightIcon />
              </span>
            }
          />

          <CustomButton
            value="Request payout"
            onClick={handleFormSubmit}
            icon={<ArrowRightIcon />}
            disabled={
              !validForm ||
              profileInfoMesg.some((el) => el === infoMessages.LOADING_WITHDROW)
            }
            loading={profileInfoMesg.some(
              (el) => el === infoMessages.LOADING_WITHDROW
            )}
          />
        </div>

        {profileInfoMesg.some((el) => el === errors.WITHDRAW_ERROR) &&
          walletError !== errors.INVALID_TOTP_CODE &&
          walletError && (
            <ItemBoughtErrorModal
              error={errors.WITHDRAW_ERROR}
              onCancelClick={handleClose}
              text={walletError}
            />
          )}
      </div>
    </VerticalModal>
  );
};
