import { validateEmptyFields } from ".";

export const validateUserFullName: any = (values: any) => {
  const errors: any = {};

  // const isForbiddenSymbol = /^(?=.*[#$!(*)@_`,<>=+-])/;
  const regex = "^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$";

  if (values?.ssn && values?.ssn?.search(regex) !== 0) {
    errors.ssn = "Invalid ssn";
  }

  validateEmptyFields(values, "first_name", "Required", errors);
  validateEmptyFields(values, "last_name", "Required", errors);
  validateEmptyFields(values, "country", "Required", errors);
  validateEmptyFields(values, "city", "Required", errors);
  validateEmptyFields(values, "amount", "Required", errors);
  validateEmptyFields(values, "line1", "Required", errors);
  validateEmptyFields(values, "district", "Required", errors);
  validateEmptyFields(values, "ssn", "Required", errors);
  validateEmptyFields(values, "postalCode", "Required", errors);
  return errors;
};
