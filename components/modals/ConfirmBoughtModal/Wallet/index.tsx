import React from "react";
import { CustomButton } from "../../..";
import { transformPrice } from "../../../../helpers";
import { useRedux } from "../../../../hooks";

import { profileActions, selectBalance } from "../../../../redux";
import { BalanceCurrency } from "../../../../types";
import { CreditCardIcon } from "../../../Icons";
import s from "./Wallet.module.scss";

type WalletPropsType = {
  itemCurrency: BalanceCurrency;
};

export const Wallet: React.FC<WalletPropsType> = ({ itemCurrency }) => {
  const [select, dispatch] = useRedux();
  const balance = select(selectBalance);

  const { setProfileModalByKey, setSelectWallet } = profileActions;

  const handleTopUp = () => {
    dispatch(setProfileModalByKey("wallet"));
    dispatch(setSelectWallet(itemCurrency));
  };

  return (
    <div className={s.cardContainer}>
      {balance?.noWallet ? (
        <CustomButton
          theme="link"
          value="Set up wallet"
          onClick={() => dispatch(setProfileModalByKey("wallet"))}
        />
      ) : (
        <>
          <div className={s.rignt}>
            <div>
              <div className={s.header}>Balance</div>
              <div className={`${s.walletValue} ${itemCurrency}`}>
                {itemCurrency}{" "}
                <span>
                  {balance.isFeatched && transformPrice(balance[itemCurrency])}
                </span>
              </div>
            </div>
          </div>
          <div className={s.btn}>
            <CustomButton
              theme="violet"
              icon={<CreditCardIcon />}
              value="top up"
              style={{ height: "32px" }}
              onClick={handleTopUp}
            />
          </div>
        </>
      )}
    </div>
  );
};
