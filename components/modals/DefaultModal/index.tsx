import React from "react";
import { CustomButton, Modal } from "../..";
import { IconCompleted } from "../../../public/icons";
import { CrossIcon } from "../../Icons";
import s from "./DefaultModal.module.scss";

type DefaultModalProps = {
  header: string;
  handleCancel: () => void;
  handleSubmit: () => void;
  children: JSX.Element;
  disabledSubtit?: boolean;
};

export const DefaultModal = ({
  disabledSubtit,
  header,
  handleCancel,
  handleSubmit,
  children,
}: DefaultModalProps) => {
  return (
    <Modal isCloseBtnHidden={true}>
      <div className={s.defaultModal}>
        <div className={s.title}>{header}</div>
        <div>{children}</div>
        <div className={s.btns}>
          <CustomButton
            theme="transparent"
            icon={<CrossIcon />}
            value="nevermind"
            onClick={handleCancel}
            id={`${header.replaceAll(" ", "_").toLowerCase()}_nevermind`}
          />
          <CustomButton
            disabled={disabledSubtit}
            theme="violet"
            icon={<IconCompleted />}
            value="save"
            onClick={handleSubmit}
            id={`${header.replaceAll(" ", "_").toLowerCase()}_save`}
          />
        </div>
      </div>
    </Modal>
  );
};
