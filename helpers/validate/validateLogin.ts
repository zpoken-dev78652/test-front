import { isValidEmail } from "./isValidEmail";

export const validateLogin: any = (values: any) => {
  const errors: any = {};

  if (!isValidEmail(values.login))
    errors.login = "Email seems to be invalid, please check..."; //TODO change text

  if (!values.password)
    errors.password = "Password seems to be invalid, please check..."; //TODO change text

  if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(^.{8,})$/.test(values.password))
    errors.password =
      "Password needs to be at least 8 characters long and must include a symbol and capital";

  if (!values.login)
    errors.login = "Email seems to be invalid, please check..."; //TODO change text

  return errors;
};
