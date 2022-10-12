import React, { FC } from "react";
import { HistoryTable } from "../../../..";
import { useRedux } from "../../../../../hooks";
import { profileActions, selectWalletHistory } from "../../../../../redux";
import { BalanceCurrency } from "../../../../../types";
import { CustomButton } from "../../../../CustomButton";
import { ArrowRightIcon } from "../../../../Icons";

type HistoryPropsType = {
  walletCurrency: BalanceCurrency;
};

export const History: FC<HistoryPropsType> = ({ walletCurrency }) => {
  const [select, dispatch] = useRedux();

  const { setProfileModalByKey } = profileActions;

  const handleFiatClick = () => {
    dispatch(setProfileModalByKey("history"));
  };

  const { data } = select(selectWalletHistory);

  return (
    <>
      <HistoryTable currency={walletCurrency} perPage={10} />
      {data?.length > 9 && (
        <CustomButton
          theme="transparent"
          value="older transactions"
          icon={<ArrowRightIcon />}
          onClick={handleFiatClick}
        />
      )}
    </>
  );
};
