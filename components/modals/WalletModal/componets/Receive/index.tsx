import React, { FC, useEffect } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import {
  infoMessages,
  mobileWidth,
  setingsNotification,
} from "../../../../../constants";
import { IconCopyClickboard } from "../../../../../public/icons";
import { BalanceCurrency } from "../../../../../types";
import { CustomButton } from "../../../../CustomButton";
import { AlertIcon, CopyIcon } from "../../../../Icons";
import { Or } from "../../../../";
import { ButtonToFiat } from "..";

import s from "./Receive.module.scss";
import { useMediaQuery, useRedux } from "../../../../../hooks";
import {
  getBlockchainMethodsAsync,
  profileActions,
  selectBlockchainMethods,
  selectProfileInfoMessage,
} from "../../../../../redux";
import { ClipLoader } from "react-spinners";

type ReceivePropsType = {
  walletCurrency: BalanceCurrency;
};

export const Receive: FC<ReceivePropsType> = ({ walletCurrency }) => {
  const [select, dispatch] = useRedux();
  const isMobile = useMediaQuery(`(max-width: ${mobileWidth}px)`);

  const blockchainMethods = select(selectBlockchainMethods);
  const profileInfoMessage = select(selectProfileInfoMessage);

  const { setProfileModalByKey } = profileActions;

  const copyToClipBoard = async (copyMe: string) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      toast.success("copied to clipboard", {
        icon: IconCopyClickboard,
        ...setingsNotification,
      });
    } catch (err) {}
  };

  const handleFiatClick = () => {
    dispatch(setProfileModalByKey("deposit"));
  };

  useEffect(() => {
    if (blockchainMethods[walletCurrency]) return;
    dispatch(getBlockchainMethodsAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {profileInfoMessage.some(
        (info) => info === infoMessages.LOADING_BLOCKCHAIN_METHODS
      ) ? (
        <div className={s.spiner}>
          <ClipLoader color={"#fff"} size={60} />
        </div>
      ) : (
        <div className={s.info}>
          <div className={s.qrWrap}>
            <QRCode
              value={blockchainMethods[walletCurrency]}
              bgColor="transparent"
              fgColor="#fff"
              size={isMobile ? 234 : 120}
            />
          </div>
          <div className={s.infoContent}>
            <h4 className={s.title}>Receive {walletCurrency}</h4>
            <p className={`${s.address} ellipsis`}>
              {blockchainMethods[walletCurrency]}
            </p>
            <CustomButton
              className={s.btn}
              value="Copy"
              theme="transparent"
              icon={<CopyIcon />}
              onClick={() => copyToClipBoard(blockchainMethods[walletCurrency])}
              id="copyReceiveAddress"
            />
            <p className={s.warningMsg}>
              <AlertIcon fill="#fff" />
              Please send only {walletCurrency} to this address. Sending any
              other currencies may result funds loss.
            </p>
          </div>
        </div>
      )}

      {walletCurrency === "USDC" && (
        <>
          <Or className={s.or} />
          <ButtonToFiat value="Top up with fiat" onClick={handleFiatClick} />
        </>
      )}
    </div>
  );
};
