import React from "react";
import { CustomButton } from "../..";
import { transformToId } from "../../../helpers";

import { CrossIcon } from "../../Icons";
import { Modal } from "../../Modal";
import { DublicateItemModal } from "../DublicateItemModal";
import { modal } from "./data";
import s from "./ItemBoughtErrorModal.module.scss";

type ItemBoughtErrorModalProps = {
  error?: string | null | undefined;
  onCancelClick: () => void;
  onBuyClick?: (e?: any) => void;
  listWithTitle?: { title: string; value: string }[];
  header?: string;
  text?: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  disableSecondaryBtn?: boolean;
  list?: string[];
  titleList?: string;
};

export const ItemBoughtErrorModal: React.FC<ItemBoughtErrorModalProps> = ({
  error,
  listWithTitle,
  onCancelClick,
  onBuyClick,
  header,
  text,
  loading,
  icon,
  list,
  titleList,
  disableSecondaryBtn,
}) => {
  const data = modal(error);

  return (
    <Modal isCloseBtnHidden={true}>
      <DublicateItemModal
        icon={icon || data?.icon}
        header={header || data?.title}
        text={text || data?.desc}
        listWithTitle={listWithTitle || data?.listWithTitle}
        list={list || data?.list}
        titleList={titleList || data?.titleList}
      >
        <div className={s.buttons}>
          <CustomButton
            theme={
              data?.buttonTheme
                ? data?.buttonTheme
                : data?.secondButton
                ? "transparent"
                : "violet"
            }
            icon={data?.buttonIcon || <CrossIcon />}
            value={data?.secondButton || data.button}
            onClick={onCancelClick}
            id={transformToId([
              header || data?.title,
              data?.secondButton || data.button,
            ])}
          />
          {data?.secondButton && (
            <CustomButton
              theme="violet"
              icon={data.iconBtn}
              value={data.button}
              onClick={onBuyClick}
              loading={loading}
              disabled={disableSecondaryBtn}
              id={transformToId([header || data?.title, data.button])}
            />
          )}
        </div>
      </DublicateItemModal>
    </Modal>
  );
};
