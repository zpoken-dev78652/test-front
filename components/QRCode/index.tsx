import React, { FC } from "react";
import CodeQR from "react-qr-code";
import { ClipLoader } from "react-spinners";
import s from "./QRCode.module.scss";

type QRCodeProps = {
  value: string;
  desc?: string;
  loading?: boolean;
  secret: string;
};

export const QRCode: FC<QRCodeProps> = ({ value, desc, secret, loading }) => {
  return (
    <div className={s.qrCode}>
      {loading ? (
        <div className={s.loader}>
          <ClipLoader size={60} color="#fff" />
        </div>
      ) : (
        <>
          <CodeQR
            value={value}
            bgColor="transparent"
            fgColor="#fff"
            size={169}
          />
          <p className={s.qrDesc}>
            {desc ||
              "Or copy and paste the following code to the autentification app"}
          </p>
          <h5 className={s.qrKey}>{secret}</h5>
        </>
      )}
    </div>
  );
};
