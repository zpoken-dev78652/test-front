import React from "react";
import { CustomTabs } from "../../../..";
import { walletTabs } from "../../../../../constants";
import { useRedux } from "../../../../../hooks";
import {
  profileActions,
  selectBalance,
  selectProfileModalsInfo,
} from "../../../../../redux";
import { TabsWalletModalType } from "../../../../../redux/profile/profile.types";
import { BalanceCurrency } from "../../../../../types";
import { WalletAccordion } from "../../../../WalletAccordion";
import { History, Receive, Send } from "../";

import s from "../WalletComponets.module.scss";

const wallets = [
  {
    currency: "XNL" as BalanceCurrency,
    title: "Chronicle - XNL",
    subTitle: "Aurora",
  },
  {
    currency: "USDC" as BalanceCurrency,
    title: "USD Coin - USDC",
    subTitle: "ERC20",
  },
];

export const Wallets = () => {
  const [select, dispatch] = useRedux();
  const balance = select(selectBalance);
  const profileModalsInfo = select(selectProfileModalsInfo);

  const { setSelectWallet, setSelectTab } = profileActions;
  return (
    <div className={s.wallets}>
      {wallets
        .map((w) => ({ ...w, value: balance[w.currency as BalanceCurrency] }))
        .map((wallet) => (
          <WalletAccordion
            key={wallet.currency}
            wallet={wallet}
            id={wallet.currency}
            expanded={profileModalsInfo.selectWallet}
            isLast={wallet.currency === wallets[wallets.length - 1].currency}
            setExpanded={(e) => dispatch(setSelectWallet(e))}
          >
            <CustomTabs
              selectTab={profileModalsInfo.seletTabModal}
              tabs={walletTabs}
              onChange={(e) => dispatch(setSelectTab(e as TabsWalletModalType))}
              className={s.walletsTabs}
              name="walletTabs"
            />

            <div className={s.wrapperContent}>
              {profileModalsInfo.seletTabModal === "deposit" && (
                <Receive walletCurrency={wallet.currency} />
              )}
              {profileModalsInfo.seletTabModal === "withdraw" && (
                <Send walletCurrency={wallet.currency} />
              )}
              {profileModalsInfo.seletTabModal === "history" && (
                <History walletCurrency={wallet.currency} />
              )}
            </div>
          </WalletAccordion>
        ))}
    </div>
  );
};
