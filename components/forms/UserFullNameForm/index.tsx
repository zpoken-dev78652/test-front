import moment from "moment";
import React, { useEffect, useState } from "react";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { CustomButton, CustomDatePicker, CustomSelect, MaskInput } from "../..";
import { country, districtCanada, districtUS } from "../../../constants";
import { validateUserFullName } from "../../../helpers";
import { useRedux } from "../../../hooks";
import { selectUserData } from "../../../redux";
import { SelectOption } from "../../../types";
import { ArrowRightIcon } from "../../Icons";
import { Input } from "../../Input";
import s from "./UserFullNameForm.module.scss";

type UserFullNamePropsType = {
  date: Date | null;
  setDate: (e: Date) => void;
};

export type UserFullNameValuesType = {
  firstname: string;
  lastname: string;
};

const UserFullName: React.FC<
  InjectedFormProps<UserFullNameValuesType, UserFullNamePropsType> &
    UserFullNamePropsType
> = ({ handleSubmit, valid, date, setDate, change }) => {
  const [select] = useRedux();
  const user = select(selectUserData);
  const changeDate = (date: Date) => setDate(date);
  const [selectCountry, setCountry] = useState<SelectOption>();

  const [selectDistrict, setDistrict] = useState<SelectOption>();

  const districtOptions =
    selectCountry?.value === "US"
      ? districtUS
      : selectCountry?.value === "CA"
      ? districtCanada
      : undefined;

  useEffect(() => {
    if (!districtOptions || !selectDistrict) return;
    if (districtOptions.every((el) => el?.value !== selectDistrict?.value)) {
      setDistrict(districtOptions[0]);
    }

    if (districtOptions && !selectDistrict) {
      setDistrict(districtOptions[0]);
    }
  }, [selectDistrict, districtOptions, setDistrict]);

  const year = moment().diff(date, "years", false);

  const customValidateBtn = () => {
    if (!valid) return true;

    if (!user.birthday && !date) return true;
    if (!user.birthday && date && year < 18) return true;
    if (!selectCountry) return true;

    if (selectCountry?.value === "US" && !selectDistrict) return true;
    if (selectCountry?.value === "CA" && !selectDistrict) return true;

    return false;
  };

  useEffect(() => {
    if (!selectCountry) return;
    change("country", selectCountry?.value);
  }, [selectCountry, change]);

  useEffect(() => {
    if (!selectDistrict) return;
    change("district", selectDistrict?.value);
  }, [change, selectDistrict]);

  useEffect(() => {
    if (!date) return;
    change("birthday", moment(date).format("YYYY-MM-DD"));
  }, [change, date]);

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <div className={s.container} id="userFullName">
        <div className={s.input}>
          <Field
            name="first_name"
            type="text"
            placeholder="First Name"
            label="First Name"
            component={Input}
          />
        </div>
        <div className={s.input}>
          <Field
            name="last_name"
            type="text"
            placeholder="Last Name"
            label="Last Name"
            component={Input}
          />
        </div>

        {!user.birthday && (
          <div className={`${s.input} ${s.datePicker}`}>
            <Field
              name="birthday"
              type="text"
              placeholder="Birthday"
              label="Birthday"
              date={date}
              changeDate={changeDate}
              component={CustomDatePicker}
              error={
                year < 18 &&
                "You must be at least 18 years old to use the Chronicle platform."
              }
            />
          </div>
        )}

        <div className={s.input}>
          <CustomSelect
            theme="crypto"
            header="Country"
            font="montserrat"
            label="Country"
            options={country}
            value={selectCountry}
            onChange={(e: any) => setCountry(e)}
            idTargetScroll="userFullName"
          />
        </div>
        {selectCountry?.value === "US" && (
          <div className={s.input}>
            <Field
              name="ssn"
              placeholder="SSN"
              type="text"
              mask={[
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              label="SSN"
              component={MaskInput}
            />
          </div>
        )}
        <div className={s.input}>
          <Field
            name="city"
            placeholder="City"
            label="City"
            component={Input}
          />
        </div>
        <div className={s.input}>
          <Field
            name="line1"
            placeholder="Address line 1"
            label="address line 1"
            component={Input}
          />
        </div>
        <div className={s.input}>
          <Field
            name="line2"
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
              idTargetScroll="userFullName"
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
      </div>

      <div className={s.btnWrap}>
        <CustomButton
          value="continue to verification"
          type="submit"
          onClick={handleSubmit}
          icon={<ArrowRightIcon />}
          disabled={customValidateBtn()}
          className={s.btn}
        />
      </div>
    </form>
  );
};

export const UserFullNameForm = reduxForm<
  UserFullNameValuesType,
  UserFullNamePropsType
>({
  form: "userFullName",
  validate: validateUserFullName,
  shouldValidate: () => true,
  enableReinitialize: true,
})(UserFullName);
