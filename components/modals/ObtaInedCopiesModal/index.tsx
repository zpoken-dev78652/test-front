import cn from "classnames";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { CustomButton, LogoCard, Modal } from "../..";
import { mobileWidth, Routes } from "../../../constants";
import { useMediaQuery } from "../../../hooks";
import { LinkIcon } from "../../Icons";
import s from "./ObtaInedCopiesModal.module.scss";

type ObtaInedCopiesModalProps = {
  item: any;
  name: string;
  userId: string;
  onClose: (e: boolean) => void;
};

export const ObtaInedCopiesModal: FC<ObtaInedCopiesModalProps> = ({
  item,
  name,
  userId,
  onClose,
}) => {
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);
  const { push } = useRouter();

  const handleOnCardClick = (id: string) => {
    onClose(false);
    push(`${Routes.NFT}/${id}`);
  };

  return (
    <Modal
      type="vertical"
      onClose={() => onClose(false)}
      isCloseBtnHidden={!isMobile}
      styleOnClose={s.closeIcon}
    >
      <div className={s.modal}>
        <div className={s.header}>
          <div className={s.head}>ObtaIned Copies</div>
        </div>
        <div className={s.main}>
          <LogoCard item={item} className={s.img} />
        </div>
        <div className={s.footer}>
          <div className={s.name}>{name}</div>
          <div className={s.btnLink}>
            <CustomButton
              theme="link"
              icon={<LinkIcon size={12} />}
              linkTo={`${Routes.PROFILE}/${userId}/collection/${item.collection_id}`}
              value={item.collection_name}
            />
          </div>
          <div className={s.nftList}>
            {item?.duplicates?.map((i: any, index: number) => (
              <div
                key={index}
                className={cn([s.nft], {
                  [s.current]: i.nft_token === item.nft_token,
                })}
                onClick={() => handleOnCardClick(i.nft_id)}
              >
                #{item.num_in_collection} | {i.nft_index} / {item.total_nft_num}{" "}
                | {i.nft_token ? `ID${i.nft_token}` : "Waiting for Token ID"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
