import { useRouter } from "next/router";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { CustomButton } from "../..";
import { Routes } from "../../../constants";
import { IconRegister } from "../../../public/icons";
import { LoginIcon } from "../../Icons";

import s from "./WelcomeModal.module.scss";

export const WelcomeModal: React.FC = () => {
  const { push } = useRouter();
  const handleReg = () => push(Routes.REGISTER);

  const handleSignIn = () => push(Routes.LOGIN);
  return (
    <div className={s.container}>
      <div className={s.content}>
        <div className={s.header}>
          Welcome to Chronicle!
          <br />
          Please sign in to continue.
          <div className={s.buttons}>
            <CustomButton
              value="register"
              icon={<IconRegister />}
              theme="transparent"
              onClick={handleReg}
            />

            <CustomButton
              value="sign in"
              icon={<LoginIcon />}
              onClick={handleSignIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
