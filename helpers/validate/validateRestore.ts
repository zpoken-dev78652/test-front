import { errors } from ".";
import { isValidEmail } from "./isValidEmail";
import { validatePhone } from "./validatePhone";

export const validateRestore: any = (values: any) => {
  const errors: any = {};

  if (!isValidEmail(values.email))
    errors.email = "Please enter your email address"; //TODO change text

  return errors;
};
