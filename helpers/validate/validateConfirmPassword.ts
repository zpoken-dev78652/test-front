import { errors } from ".";
import { email } from "redux-form-validators";
import { isValidEmail } from "./isValidEmail";

export const validateConfirmPassword: any = (values: any) => {
  const errors: any = {};

  if (!values.password) errors.password = "type password"; //TODO change text

  if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(^.{8,})$/.test(values.password))
    errors.password =
      "Password needs to be at least 8 characters long and must include a symbol and capital";

  if (!values.confirmPassword) errors.confirmPassword = "type password"; //TODO change text

  if (
    !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(^.{8,})$/.test(values.confirmPassword)
  )
    errors.confirmPassword = "Password seems to be invalid, please check...";

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword =
      "Oh-oh... Password confirmation doesn't match.Please check both fields and make sure all is correct before proceeding.";
  }

  return errors;
};
