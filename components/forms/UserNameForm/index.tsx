import React, { useEffect } from "react";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { infoMessages } from "../../../constants";
import { validateUserName } from "../../../helpers";
import { useRedux } from "../../../hooks";
import {
  isUserNameIsUnique,
  selectAuthInfoMessage,
  selectIsUnique,
  selectUserData,
} from "../../../redux";
import { Input } from "../../Input";
import s from "./UserNameForm.module.scss";

type UserNamePropsType = {
  value: string;
  changeValue: (e: string) => void;
  handleSubmit: () => void;
};

export type UserNameValuesType = {
  username: string;
};

const UserName: React.FC<
  InjectedFormProps<UserNameValuesType, UserNamePropsType> & UserNamePropsType
> = ({ value, change, changeValue, handleSubmit }) => {
  const [select, dispatch] = useRedux();
  const isUnique = select(selectIsUnique);
  const user = select(selectUserData);
  const authInfoMessage = select(selectAuthInfoMessage);

  useEffect(() => {
    change("username", value);
    if (!value) return;
    dispatch(isUserNameIsUnique(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmitForm}
      className={s.form}
    >
      <div className={s.container}>
        <div className={s.input}>
          <Field
            name="username"
            input={{
              value: value,
              onChange: (e: any) => changeValue(e.target.value),
            }}
            type="username"
            placeholder="Get creative here"
            component={Input}
            errors={
              isUnique === false &&
              user?.username !== value &&
              !authInfoMessage.some(
                (el) => el === infoMessages.LOADING_UNIQ_NAME
              )
            }
            descriptions="Should be unique"
          />
          {isUnique === false &&
            user?.username !== value &&
            !authInfoMessage.some(
              (el) => el === infoMessages.LOADING_UNIQ_NAME
            ) && (
              <div className={s.tipError}>
                Sorry... This username seems to be already taken.You can use
                letters, numbers, punctuation marks and special symbols. Get
                creative!
              </div>
            )}
          <ul>
            <li>Should NOT contain any inappropriate language;</li>
            <li>Can include letters, numbers and special symbols.</li>
          </ul>
        </div>
      </div>
    </form>
  );
};

export const UserNameForm = reduxForm<UserNameValuesType, UserNamePropsType>({
  form: "username",
  validate: validateUserName,
  shouldValidate: () => true,
  enableReinitialize: true,
})(UserName);
