import { errors } from ".";

export const validatePhone = (value: string) => {
  if (!value) return errors.REQUIRED;
  return /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){12}(\s*)?$/i.test(value)
    ? undefined
    : errors.PHONE;
};
