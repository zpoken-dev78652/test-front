import React, { FC, useEffect, useState } from "react";
import { countryIsoCodes } from "../../constants";
import s from "./PhoneNumberInput.module.scss";
import { CustomButton } from "../CustomButton";
import { useInterval, useRedux } from "../../hooks";
import { profileActions, verifyPhoneNumberAsync } from "../../redux";
import ReactPhoneInput, { CountryData } from "react-phone-input-2";
import { startsWith } from "lodash";
import cn from "classnames";

import "react-phone-input-2/lib/style.css";

type PhoneNumberInputProps = {
  error?: string;
};

export const PhoneNumberInput: FC<PhoneNumberInputProps> = ({ error }) => {
  const [phone, setPhone] = useState<{
    value: string;
    data: CountryData | {};
    event: React.ChangeEvent<HTMLInputElement>;
    formattedValue: string;
  }>();
  const [disableVeriftBtn, setDisableVeriftBtn] = useState(false);
  const [time, setTime] = useState(0);
  const [fullNumber, setFullNumber] = useState(false);
  const [validate, setValidate] = useState(false);
  const [_, dispatch] = useRedux();

  const { setVerifyPhone } = profileActions;

  const handleNerify = () => {
    setTime(59);
    setDisableVeriftBtn(true);
    dispatch(setVerifyPhone(`+${phone?.value}`));
    dispatch(verifyPhoneNumberAsync({ phone: `+${phone?.value}` }));
  };

  useInterval(
    () => {
      setTime((prevState) => prevState - 1);
    },
    time > 0 ? 1000 : null
  );

  useEffect(() => {
    if (time <= 0) {
      setDisableVeriftBtn(false);
      return;
    }
  }, [time]);

  return (
    <div>
      <div className={s.wrapperLabel}>
        <h4 className={s.label}>Phone number</h4>
        {time > 0 && <p className="violet">Try again ({time})</p>}
      </div>
      <div className={s.phoneVerify}>
        <ReactPhoneInput
          value={phone?.value}
          onChange={(value, data: CountryData, event, formattedValue) => {
            setFullNumber(value.slice(data.dialCode.length).length >= 7);
            setPhone({ value, data, event, formattedValue });
          }}
          containerClass={s.container}
          inputClass={cn([s.input], { [s.error]: error })}
          buttonClass={cn([s.button], { [s.error]: error })}
          dropdownClass={s.dropdown}
          searchClass={s.search}
          country={"us"}
          enableSearch
          disableSearchIcon
          autocompleteSearch
          specialLabel=""
          onlyCountries={countryIsoCodes}
          isValid={(inputNumber, country, countries: any) => {
            return countries.some((country: any) => {
              setValidate(
                startsWith(inputNumber, country.dialCode) ||
                  startsWith(country.dialCode, inputNumber)
              );
              return (
                startsWith(inputNumber, country.dialCode) ||
                startsWith(country.dialCode, inputNumber)
              );
            });
          }}
        />
        <CustomButton
          value="Get Code"
          className={s.btn}
          disabled={disableVeriftBtn || !fullNumber || !validate}
          onClick={handleNerify}
        />
      </div>

      <div className={cn([s.list], { [s.error]: error })}>
        {error ? (
          <p className={s.item}>{error}</p>
        ) : (
          <>
            <p className={s.item}>
              Please enter active phone number only you have direct access to;
            </p>
            <p className={s.item}>
              Your phone number will only be used for security purposes.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
