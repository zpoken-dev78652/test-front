import { isValidEmail } from "./isValidEmail";

export const validateRegistration: any = (values: any) => {
  const errors: any = {};

  const isForbiddenSymbol = /^(?=.*[#$!(*)@_`,<>=+-])/;

  if (!isValidEmail(values.email))
    errors.email = "Email seems to be invalid, please check..."; //TODO change text

  if (!values.password)
    errors.password = "Password seems to be invalid, please check..."; //TODO change text

  if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(^.{8,})$/.test(values.password))
    errors.password =
      "Password needs to be at least 8 characters long and must include a symbol and capital";

  if (!values.checkbox) errors.checkbox = "adasdasd";

  return errors;
};
