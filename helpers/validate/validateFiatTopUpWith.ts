import moment from "moment";
import { validateEmptyFields } from ".";
import { TopUpWithFiatFormValuesType } from "../../components";
import { priceToNumber } from "../priceToNumber";

export const validateFiatTopUpWith = (values: TopUpWithFiatFormValuesType) => {
  let errors: any = {};

  if (values.amount && Number(values.amount.replace(/\s/g, "")) < 0.8) {
    errors.amount = "Should be 0.8 USDC or bigger";
  }
  if (values.amount && priceToNumber(values.amount) > 3000) {
    errors.amount = "Should be 3 000 USDC or less";
  }

  if (values.cardnumber && values.cardnumber?.replace(/\s/g, "")?.length < 16) {
    errors.cardnumber = "Card number isn't correct";
  }

  if (
    values.expiry &&
    (+values.expiry?.split("/")[0] > 12 ||
      (+values.expiry?.split("/")[1] === +moment().format("YY") &&
        +values.expiry?.split("/")[0] < +moment().format("MM")))
  ) {
    errors.expiry = "Card month isn't correct";
  }

  if (values.expiry && +values.expiry?.split("/")[1] < +moment().format("YY")) {
    errors.expiry = "Card year isn't correct";
  }

  if (values.ccname?.split(" ").filter((str) => str !== "").length < 2) {
    errors.ccname = "Name isn't correct";
  }

  validateEmptyFields(values, "country", "Required", errors);
  validateEmptyFields(values, "city", "Required", errors);
  validateEmptyFields(values, "amount", "Required", errors);
  validateEmptyFields(values, "ccname", "Required", errors);
  validateEmptyFields(values, "cardnumber", "Required", errors);
  validateEmptyFields(values, "expiry", "Required", errors);
  validateEmptyFields(values, "cvc", "Required", errors);
  validateEmptyFields(values, "addressLine_1", "Required", errors);
  validateEmptyFields(values, "district", "Required", errors);
  validateEmptyFields(values, "postalCode", "Required", errors);

  return errors;
};
