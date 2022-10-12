/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect } from "react";
import cn from "classnames";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import {
  CustomSelect,
  DetailRow,
  Input,
  MaskInput,
  PoweredBy,
  PriceInputReduxForm,
} from "../..";
import Circle from "../../../public/img/circle_mini.png";
import {
  circleTopUpWithBankCard,
  priceToNumber,
  transformPrice,
  validateFiatTopUpWith,
} from "../../../helpers";
import Image from "next/image";
import {
  country,
  creditCardMask,
  cvvMask,
  dateYearMask,
} from "../../../constants";
import s from "./TopUpWithFiatForm.module.scss";
import { useRedux } from "../../../hooks";
import { SelectOption, SelectOptions } from "../../../types";

type TopUpWithFiatFormPropsType = {
  setValidForm: any;
  selectCountry?: SelectOption;
  setCountry: any;
  selectDistrict?: SelectOption;
  setDistrict: any;
  districtOptions?: SelectOptions;
};

export type TopUpWithFiatFormValuesType = {
  amount: string;
  ccname: string;
  cardnumber: string;
  expiry: string;
  cvc: string;
  country: string;
  city: string;
  addressLine_1: string;
  addressLine_2: string;
  district: string;
  postalCode: string;
};

const FormTopUpWithFiat: React.FC<
  InjectedFormProps<TopUpWithFiatFormValuesType, TopUpWithFiatFormPropsType> &
    TopUpWithFiatFormPropsType
> = ({
  handleSubmit,
  setValidForm,
  valid,
  selectCountry,
  setCountry,
  setDistrict,
  selectDistrict,
  districtOptions,
}) => {
  useEffect(() => {
    setValidForm(valid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid]);

  const [select] = useRedux();

  const { values } = select((state) => state.form.fiatTopUpWith);

  useEffect(() => {
    if (!districtOptions || !selectDistrict) return;
    if (districtOptions.every((el) => el.value !== selectDistrict.value)) {
      setDistrict(districtOptions[0]);
    }
  }, [selectDistrict, districtOptions, setDistrict]);

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <div className={s.input}>
        <Field
          name="amount"
          startTest="USDC"
          placeholder="0.00"
          title="Your deposit"
          component={PriceInputReduxForm}
          message="min USDC 0.80 max USDC 3K"
        />
      </div>
      <div className={s.info}>
        <div className={s.row}>
          <DetailRow
            title="Payment"
            value={transformPrice(priceToNumber(values?.amount || 0))}
            type="price"
            valueCurrency="USD"
          />
        </div>
        <div className={s.row}>
          <DetailRow
            title="Transaction Fee"
            value={transformPrice(
              (
                circleTopUpWithBankCard(priceToNumber(values?.amount || 0)) -
                priceToNumber(values?.amount || 0)
              ).toFixed(2)
            )}
            type="price"
            valueCurrency="USD"
          />
        </div>
        <div className={s.row}>
          <DetailRow
            title="Network Fee"
            value={transformPrice(0)}
            type="price"
            valueCurrency="USD"
          />
        </div>
        <div className={s.row}>
          <DetailRow
            title="Purchase Total"
            value={transformPrice(
              circleTopUpWithBankCard(priceToNumber(values?.amount || 0))
            )}
            type="price"
            valueCurrency="USD"
          />
        </div>
      </div>

      <div className={s.bankElements}>
        <div className={s.powered}>
          <PoweredBy value={<Image src={Circle} className={s.img} />} />
        </div>

        <div>
          <Field
            name="ccname"
            placeholder="CARD HOLDER"
            component={Input}
            label="Credit / Debit Card"
          />

          <div className={s.creditCard}>
            <Field
              name="cardnumber"
              placeholder="**** **** **** ****"
              component={MaskInput}
              mask={creditCardMask}
              guide={false}
              className={s.maskInput}
              wrapperСlassName={s.maskInputWrap}
              hideError
            />
            <Field
              className={cn(s.maskInput, s.date)}
              name="expiry"
              placeholder="MM/YY"
              component={MaskInput}
              mask={dateYearMask}
              guide={false}
              hideError
            />
            <Field
              className={cn(s.maskInput, s.cvv)}
              name="cvc"
              placeholder="CVC"
              component={MaskInput}
              mask={cvvMask}
              guide={false}
              hideError
            />
          </div>
        </div>
      </div>

      <div className={s.input}>
        <CustomSelect
          theme="crypto"
          header="Country"
          font="montserrat"
          label="Country"
          options={country}
          value={selectCountry}
          onChange={(e: any) => setCountry(e)}
          idTargetScroll="fiatTopUpWith"
        />
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
            idTargetScroll="fiatTopUpWith"
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
      <div className={s.input}>
        <Field
          name="postalCode"
          placeholder="Postal / Zip Code"
          label="Postal / Zip Code"
          component={Input}
          maxLength={7}
        />
      </div>
    </form>
  );
};

export const TopUpWithFiatForm = reduxForm<
  TopUpWithFiatFormValuesType,
  TopUpWithFiatFormPropsType
>({
  form: "fiatTopUpWith",
  validate: validateFiatTopUpWith,
  shouldValidate: () => true,
  //   enableReinitialize: true,
})(FormTopUpWithFiat);
