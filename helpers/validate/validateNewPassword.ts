export const validateNewPassword: any = (values: any) => {
  const errors: any = {};

  if (!values.password)
    errors.password = "Password seems to be invalid, please check..."; //TODO change text

  if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(^.{8,})$/.test(values.password))
    errors.password =
      "Password needs to be at least 8 characters long and must include a symbol and capital";

  return errors;
};
