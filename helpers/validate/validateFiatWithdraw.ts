import { FiatWithdrawFormValuesType } from "../../components";

export const validateEmptyFields = (
  values: any,
  value: string,
  message: string,
  errors: any
) => {
  if (
    !values[`${value}`] ||
    (values[`${value}`] && !values[`${value}`].trim())
  ) {
    errors[`${value}`] = message;
  }
};

export const validateFiatWithdraw = (values: FiatWithdrawFormValuesType) => {
  let errors: any = {};

  if (values.amount && Number(values.amount.replace(/\s/g, "")) < 26) {
    errors.amount = "Should be 26 USDC or bigger";
  }
  if (
    values.amount &&
    Number(
      values.amount.slice(1, values.amount.length + 1).replace(/\s/g, "")
    ) > 25000
  ) {
    errors.amount = "Should be 25 000 USDC or less";
  }

  if (values.selectBank !== "Non US Bank Account - IBAN Supported") {
    validateEmptyFields(values, "routingNumber", "Required", errors);
  }

  validateEmptyFields(values, "name", "Required", errors);
  validateEmptyFields(values, "country", "Required", errors);
  validateEmptyFields(values, "city", "Required", errors);
  validateEmptyFields(values, "amount", "Required", errors);
  validateEmptyFields(values, "accountNumber", "Required", errors);
  validateEmptyFields(values, "addressLine_1", "Required", errors);
  validateEmptyFields(values, "district", "Required", errors);
  validateEmptyFields(values, "postalCode", "Required", errors);
  validateEmptyFields(values, "bankName", "Required", errors);
  validateEmptyFields(values, "selectCountryBank", "Required", errors);
  validateEmptyFields(values, "bankSelectCountry", "Required", errors);
  validateEmptyFields(values, "bankCity", "Required", errors);

  return errors;
};
