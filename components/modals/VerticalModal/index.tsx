import React, { FC } from "react";
import { ArrowLeftIcon } from "../../Icons";
import { Modal } from "../../Modal";
import s from "./VerticalModal.module.scss";

type VerticalModalType = {
  onClose: () => void;
  handleBack?: () => void;
  header: string | React.ReactNode;
  children: React.ReactNode;
  isCloseBtnHidden?: boolean;
};

export const VerticalModal: FC<VerticalModalType> = ({
  children,
  header,
  handleBack,
  ...modalProps
}) => {
  return (
    <Modal type="vertical" {...modalProps}>
      <div className={s.verticalModal}>
        <div className={s.header}>
          {handleBack && (
            <ArrowLeftIcon className={s.arrow} size={12} onClick={handleBack} />
          )}
          {header}
        </div>
        <div className={s.content}>{children}</div>
      </div>
    </Modal>
  );
};
