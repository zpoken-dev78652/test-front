import { useState } from "react";
import { LoginLayout, RegistrationForm } from "../../components";
import { LoginRightSide, Meta } from "../../container";

import s from "./SignUp.module.scss";

export type TypeState = {
  login: string;
  email: string;
  password: string;
  checkbox: boolean;
};

const initState: TypeState = {
  login: "",
  email: "",
  password: "",
  checkbox: false,
};

const SignUp = () => {
  const [form, setForm] = useState<TypeState>(initState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const changeError = (errorObj: { [key: string]: string }) =>
    setErrors((err) => errorObj);

  const changeForm = (val: TypeState) => {
    setForm((state) => ({ ...state, ...val }));
    changeError({});
  };

  return (
    <>
      <Meta title="Chronicle | Sing Up" />
      <div className={s.wrapForm}>
        <div className={s.mobileHeader}>Register</div>

        <LoginRightSide label="Register">
          <RegistrationForm
            onChange={changeForm}
            data={form}
            errors={errors}
            changeError={changeError}
          />
        </LoginRightSide>
      </div>
    </>
  );
};

SignUp.getLayout = function getLayout(page: any) {
  return <LoginLayout>{page}</LoginLayout>;
};

export default SignUp;
