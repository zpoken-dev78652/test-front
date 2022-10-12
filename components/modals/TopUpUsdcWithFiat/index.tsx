import React, { useEffect, useState } from "react";
import { change } from "redux-form";
import { CustomButton, ItemBoughtErrorModal, TopUpWithFiatForm } from "../..";
import { districtCanada, districtUS, errors } from "../../../constants";
import { encryptCardDetails, priceToNumber } from "../../../helpers";
import { useRedux } from "../../../hooks";
import {
  getCircleKey,
  postTopUpWithCircle,
  profileActions,
  selectLoadingProfile,
  selectCircleKey,
} from "../../../redux";
import { SelectOption } from "../../../types";
import { ArrowRightIcon } from "../../Icons";
import { VerticalModal } from "../VerticalModal";

import s from "./TopUpUsdcWithFiat.module.scss";

export const TopUpUsdcWithFiat = () => {
  const [select, dispatch] = useRedux();

  const {
    closeAllProfileModal,
    setSelectWallet,
    setSelectTab,
    setProfileModalByKey,
  } = profileActions;

  const handleBack = () => {
    dispatch(setProfileModalByKey("wallet"));
  };

  const handleCloseWalletModal = () => {
    dispatch(closeAllProfileModal());
    dispatch(setSelectWallet(""));
    dispatch(setSelectTab("deposit"));
  };

  const [validForm, setValidForm] = useState();
  const [selectCountry, setCountry] = useState<SelectOption>();
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectDistrict, setDistrict] = useState<SelectOption>();

  const form = select((state) => state.form.fiatTopUpWith);
  const circleKey = select(selectCircleKey);
  const loading = select(selectLoadingProfile);

  const handleFormSubmit = async () => {
    if (!form || !circleKey) return;

    const encryptCardNumber = await encryptCardDetails({
      circleKey,
      dataToEncrypt: { number: form.values?.cardnumber?.replace(/\s/g, "") },
    });

    const encryptCvv = await encryptCardDetails({
      circleKey,
      dataToEncrypt: { cvv: form.values?.cvc },
    });

    const encryptData = await encryptCardDetails({
      circleKey,
      dataToEncrypt: {
        cvv: form.values?.cvc,
        number: form.values?.cardnumber?.replace(/\s/g, ""),
      },
    });

    const data = {
      keyId: circleKey.keyId,
      name: form.values?.ccname,
      encryptedCardInfo: encryptData?.encryptedMessage,
      encryptedCVV: encryptCvv?.encryptedMessage,
      encryptedCardNum: encryptCardNumber.encryptedMessage,
      expMonth: form.values?.expiry?.split("/")[0],
      expYear: `20${form.values?.expiry?.split("/")[1]}`,

      amount: priceToNumber(form.values?.amount),
      city: form.values?.city,
      country: form.values?.country,
      line1: form.values?.addressLine_1,
      line2: form.values?.addressLine_2,
      postalCode: form.values?.postalCode,
      district: form.values?.district,
    };

    dispatch(postTopUpWithCircle(data));
  };

  const handleOnScroll = (e: any) => {
    e.stopPropagation();
  };

  const districtOptions =
    selectCountry?.value === "US"
      ? districtUS
      : selectCountry?.value === "CA"
      ? districtCanada
      : undefined;

  useEffect(() => {
    if (!selectCountry) return;
    dispatch(change("fiatTopUpWith", "country", selectCountry?.value));
  }, [dispatch, selectCountry]);

  useEffect(() => {
    if (!selectDistrict) return;
    dispatch(change("fiatTopUpWith", "district", selectDistrict?.value));
  }, [dispatch, selectDistrict]);

  useEffect(() => {
    dispatch(getCircleKey());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VerticalModal
      header="Top up USCD with fiat"
      onClose={handleCloseWalletModal}
      handleBack={handleBack}
      isCloseBtnHidden
    >
      <div className={s.container}>
        <div className={s.content} onScroll={handleOnScroll} id="fiatTopUpWith">
          <TopUpWithFiatForm
            setValidForm={setValidForm}
            onSubmit={handleFormSubmit}
            selectCountry={selectCountry}
            setCountry={setCountry}
            selectDistrict={selectDistrict}
            setDistrict={setDistrict}
            districtOptions={districtOptions}
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
            value="Deposit Funds"
            onClick={() => setConfirmModal(true)}
            icon={<ArrowRightIcon />}
            disabled={
              !validForm ||
              loading ||
              !selectCountry ||
              (selectCountry.value === "US" && !selectDistrict) ||
              (selectCountry.value === "CA" && !selectDistrict)
            }
          />
        </div>

        {confirmModal && (
          <ItemBoughtErrorModal
            text={
              <>
                You&apos;re about to deposit{" "}
                <span className="violet">USDC</span> funds to Chronicle.
                Withdrawals can be made 2 weeks after funds are received to your
                wallet, including marketplace sales. Do you wish to continue?
              </>
            }
            error={errors.CONFIRM_TOPUP}
            onCancelClick={() => setConfirmModal(false)}
            onBuyClick={handleFormSubmit}
            loading={loading}
          />
        )}
      </div>
    </VerticalModal>
  );
};
