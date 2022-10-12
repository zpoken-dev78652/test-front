import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { CustomButton, Modal } from "../..";
import { ArrowRightIcon, CrossIcon } from "../../Icons";

import s from "./TotpModal.module.scss";

type TotpModalProps = {
  handleOk: () => void;
  handleSkip: () => void;
};

export const TotpModal: React.FC<TotpModalProps> = ({
  handleOk,
  handleSkip,
}) => {
  return (
    <Modal>
      <div className={s.container}>
        <div className={s.icon}>
          <img src={"/img/gifs/Loader.gif"} alt="loader" />
        </div>

        <h4 className={s.title}>Welcome to Chronicle!</h4>
        <p className={s.desc}>Set up Two-Factor Authentication</p>
        <p className={s.desc}>
          You&apos;re almost there! To enjoy the full platform including
          accessing the USDC withdrawal functionality we recommend setting up
          2FA for your security. Click Finalize Account now to set this up. Be
          sure to have your mobile phone nearby.
        </p>
        <div className={s.btns}>
          <CustomButton
            value="skip for now"
            theme="transparent"
            icon={<CrossIcon />}
            onClick={handleSkip}
          />
          <CustomButton
            value="finalize account"
            icon={<ArrowRightIcon />}
            onClick={handleOk}
          />
        </div>
      </div>
    </Modal>
  );
};
