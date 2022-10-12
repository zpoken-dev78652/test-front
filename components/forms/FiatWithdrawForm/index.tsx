/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import cn from "classnames";
import { change, Field, InjectedFormProps, reduxForm } from "redux-form";
import {
  CustomAuthCode,
  CustomSelect,
  Input,
  PoweredBy,
  PriceInputReduxForm,
} from "../..";
import Circle from "../../../public/img/circle_mini.png";
import {
  country,
  districtCanada,
  districtUS,
  errors,
  ibanCity,
  swiftCity,
  usCyti,
} from "../../../constants";
import { useRedux } from "../../../hooks";
import Image from "next/image";
import { priceToNumber, validateFiatWithdraw } from "../../../helpers";
import s from "./FiatWithdrawForm.module.scss";
import { SelectOption } from "../../../types";
import { selectWalletError, selectWithdrawableBalance } from "../../../redux";

type FiatWithdrawFormPropsType = {
  setValidForm: any;
  authCode: string;
  setAuthCode: (e: string) => void;
  selectDistrict?: SelectOption;
  setDistrict: any;
  handleFormSubmit: () => void;
};

export type FiatWithdrawFormValuesType = {
  amount: string;
  country: string;
  city: string;
  addressLine_1: string;
  addressLine_2: string;
  district: string;
  postalCode: string;
  bankCity: string;
  bankName: string;
  name: string;
  accountNumber: string;
  bankCountry: string;
  bankSelectCountry: string;
  routingNumber: string;
  selectBank: string;
};

const bankOptions = [
  {
    label: "US Bank Account",
    value: "US Bank Account",
  },
  {
    label: "Non US Bank Account - IBAN Supported",
    value: "Non US Bank Account - IBAN Supported",
  },
  {
    label: "Non US Bank Account - IBAN Not Supported",
    value: "Non US Bank Account - IBAN Not Supported",
  },
];

const FormFiatWithdraw: React.FC<
  InjectedFormProps<FiatWithdrawFormValuesType, FiatWithdrawFormPropsType> &
    FiatWithdrawFormPropsType
> = ({
  handleSubmit,
  setValidForm,
  valid,
  setDistrict,
  selectDistrict,
  authCode,
  setAuthCode,
  handleFormSubmit,
}) => {
  const [select, dispatch] = useRedux();
  const [selectBank, setselectBank] = useState<SelectOption>();
  const [selectCountryBank, setCountryBank] = useState<SelectOption>();
  const [bankSelectCountry, setBankSelectCountry] = useState<SelectOption>();
  const [countryOptions, setCountryOptions] = useState(usCyti);

  const form = select((state) => state.form.fiatWithdraw);
  const walletError = select(selectWalletError);
  const withdrawableBalance = select(selectWithdrawableBalance);

  const checkBalance =
    (withdrawableBalance?.USDC || 0) <
    (form?.values?.amount ? priceToNumber(form?.values?.amount) : 0);

  useEffect(() => {
    setselectBank(bankOptions[0]);
  }, []);

  useEffect(() => {
    if (!selectBank) return;
    setCountryOptions(
      selectBank.value === bankOptions[0].value
        ? usCyti
        : selectBank.value === bankOptions[1].value
        ? ibanCity
        : swiftCity
    );
  }, [selectBank]);

  useEffect(() => {
    setCountryBank(countryOptions[0]);
  }, [countryOptions]);

  useEffect(() => {
    if (!selectBank) return;
    if (selectBank.value === "Non US Bank Account - IBAN Supported") {
      dispatch(change("fiatWithdraw", "routingNumber", null));
    }
    dispatch(change("fiatWithdraw", "selectBank", selectBank?.value));
  }, [selectBank]);

  useEffect(() => {
    if (!selectCountryBank) return;
    dispatch(
      change("fiatWithdraw", "selectCountryBank", selectCountryBank?.label)
    );
    dispatch(change("fiatWithdraw", "country", selectCountryBank?.value));
  }, [selectCountryBank]);

  useEffect(() => {
    if (!bankSelectCountry) return;
    dispatch(
      change("fiatWithdraw", "bankSelectCountry", bankSelectCountry?.value)
    );
  }, [bankSelectCountry]);

  useEffect(() => {
    if (!districtOptions || !selectDistrict) return;
    if (districtOptions.every((el) => el.value !== selectDistrict.value)) {
      setDistrict(districtOptions[0]);
    }
  }, [selectDistrict, setDistrict]);

  const districtOptions =
    selectCountryBank?.value === "US"
      ? districtUS
      : selectCountryBank?.value === "CA"
      ? districtCanada
      : undefined;

  useEffect(() => {
    if (
      !selectCountryBank?.value ||
      !bankSelectCountry?.value ||
      !selectBank?.value ||
      checkBalance ||
      (districtOptions && !selectDistrict?.value)
    ) {
      return setValidForm(false);
    }

    setValidForm(valid && authCode.length === 6 && !checkBalance);
  }, [
    valid,
    selectCountryBank,
    bankSelectCountry,
    selectBank,
    districtOptions,
    selectDistrict,
    authCode.length,
    checkBalance,
  ]);

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <div className={s.input}>
        <Field
          name="amount"
          startTest="USDC"
          placeholder="0.00"
          title="Amount"
          component={PriceInputReduxForm}
          message="min USDC 26 max USDC 25K"
          errorMessage={
            checkBalance ? "You do not have enough funds to withdraw" : ""
          }
        />
      </div>

      <div className={s.infoList}>
        <p className={s.info}>
          Please note there is a fixed fee of USDC 25 on all fiat withdrawals.
          The amount will be automatically charged once your withdrawal is
          processed.
        </p>
      </div>

      <div className={s.bankElements}>
        <div className={s.powered}>
          <PoweredBy value={<Image src={Circle} className={s.img} />} />
        </div>
        <CustomSelect
          theme="crypto"
          font="montserrat"
          label="Bank Account"
          options={bankOptions}
          value={selectBank}
          onChange={(e: any) => setselectBank(e)}
          idTargetScroll="WithdrawContent"
        />
        <Field
          name="accountNumber"
          placeholder={
            selectBank?.value === bankOptions[1].value
              ? "IBAN"
              : "Account Number"
          }
          component={Input}
        />
        {selectBank?.value !== bankOptions[1].value && (
          <Field
            name="routingNumber"
            placeholder="Routing Number"
            component={Input}
          />
        )}
        <Field name="name" placeholder="Full name" component={Input} />
      </div>

      <div className={s.input}>
        <div className={s.input}>
          <CustomSelect
            theme="crypto"
            header="Country"
            font="montserrat"
            label="Country"
            options={countryOptions}
            value={selectCountryBank}
            onChange={(e: any) => setCountryBank(e)}
            idTargetScroll="WithdrawContent"
          />
        </div>
      </div>
      <div className={s.input}>
        <Field name="city" placeholder="City" label="City" component={Input} />
      </div>
      <div className={s.input}>
        <Field
          name="addressLine_1"
          placeholder="Address line 1"
          label="address line 1"
          component={Input}
        />
      </div>
      <div className={s.input}>
        <Field
          name="addressLine_2"
          placeholder="Address line 2"
          label="address line 2"
          component={Input}
        />
      </div>
      <div className={s.input}>
        {districtOptions ? (
          <CustomSelect
            theme="crypto"
            header="State / Province"
            font="montserrat"
            label="State / Province"
            options={districtOptions}
            value={selectDistrict}
            onChange={(e: any) => setDistrict(e)}
            idTargetScroll="WithdrawContent"
            style={{ height: "38px" }}
          />
        ) : (
          <Field
            name="district"
            placeholder="State / Province"
            label="State / Province"
            component={Input}
          />
        )}
      </div>
      <div className={cn(s.input, s.last)}>
        <Field
          name="postalCode"
          placeholder="Postal / Zip Code"
          label="postal code"
          maxLength={7}
          component={Input}
        />
      </div>
      <div className={s.input}>
        <Field
          name="bankName"
          placeholder="Bank name"
          label="Bank name"
          component={Input}
        />
      </div>
      <div className={s.input}>
        <CustomSelect
          theme="crypto"
          header="Bank Country"
          font="montserrat"
          label="Bank Country"
          options={country}
          value={bankSelectCountry}
          onChange={(e: any) => setBankSelectCountry(e)}
          idTargetScroll="WithdrawContent"
        />
      </div>
      <div className={s.input}>
        <Field
          name="bankCity"
          placeholder="Bank City"
          label="Bank City"
          component={Input}
        />
      </div>

      <div className={s.input}>
        <CustomAuthCode
          onChange={setAuthCode}
          onComplete={handleFormSubmit}
          className={s.authCode}
          label="SECURITY VERIFICATION"
          list={[
            walletError === errors.INVALID_TOTP_CODE
              ? "Invalid code. Please try again."
              : "Enter the 6-digit code from your authentication app (such as Duo or Google Authenticator)",
          ]}
          isInvadil={walletError === errors.INVALID_TOTP_CODE}
          onSubmit={handleFormSubmit}
          disabledSubmit={!valid || authCode.length !== 6}
        />
      </div>
    </form>
  );
};

export const FiatWithdrawForm = reduxForm<
  FiatWithdrawFormValuesType,
  FiatWithdrawFormPropsType
>({
  form: "fiatWithdraw",
  validate: validateFiatWithdraw,
  shouldValidate: () => true,
  //   enableReinitialize: true,
})(FormFiatWithdraw);
