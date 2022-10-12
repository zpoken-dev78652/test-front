import { email } from "redux-form-validators";

export const isValidEmail = (string: string) => {
    return !email()(string);
};