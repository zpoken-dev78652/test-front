import React, { useState } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import s from "./CardForm.module.scss";

type CardFormProps = {
  handleChangeCardField?: (e: any) => void;
};

export const CardForm: React.FC<CardFormProps> = ({
  handleChangeCardField = () => {},
}) => {
  const [errorMessage, setErrorMessage] = useState<null | string | undefined>(
    null
  );

  const cardStyle = {
    style: {
      base: {
        color: "#FFFFFF",
        iconColor: "#FFFFFF",
        "::placeholder": {
          color: "#a09ba2",
        },
      },
      invalid: {
        color: "#FFFFFF",
        iconColor: "rgba(255, 255, 255, 0.4)",
        backgroundColor: "transparent",
      },
    },
  };
  const handleChange = (e: StripeCardElementChangeEvent) => {
    if (e.error) {
      setErrorMessage(
        "Oops... We’re struggling to identify this payment method. Please check the input data."
      );
    } else {
      setErrorMessage(null);
    }

    handleChangeCardField(e);
  };

  return (
    <form id="payment-form">
      <CardElement
        id="cardElement"
        options={cardStyle}
        onChange={handleChange}
      />
      {errorMessage && <p className={s.errorMessage}>{errorMessage}</p>}
    </form>
  );
};
