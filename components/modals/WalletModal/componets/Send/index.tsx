import React, { FC, useEffect, useRef, useState } from "react";
import { ButtonToFiat } from "..";
import {
  CustomAuthCode,
  CustomButton,
  DetailRow,
  ItemBoughtErrorModal,
  Or,
} from "../../../..";
import {
  errors,
  infoMessages,
  withdrawMaxLimit,
  withdrawMinLimit,
} from "../../../../../constants";
import {
  nFormatter,
  priceToNumber,
  transformPrice,
} from "../../../../../helpers";
import { useDebouncedEffect, useRedux } from "../../../../../hooks";
import {
  getWithdrawableBalanceAsync,
  getWithdrawFeeAsync,
  postWithdraw,
  profileActions,
  selectProfileInfoMessage,
  selectWalletError,
  selectWithdrawableBalance,
  selectWithdrawFee,
} from "../../../../../redux";
import { BalanceCurrency } from "../../../../../types";
import { CustomInput } from "../../../../CustomInput";
import { CopyIcon, DownloadIcon } from "../../../../Icons";
import { PriceInput } from "../../../../PriceInput";

import s from "./Send.module.scss";

type SendPropsType = {
  walletCurrency: BalanceCurrency;
};

const initialValues = {
  amount: "",
  address: "",
  authCode: "",
};

export const Send: FC<SendPropsType> = ({ walletCurrency }) => {
  const [select, dispatch] = useRedux();

  const [values, setValues] = useState(initialValues);
  const [errorsForm, setError] = useState(initialValues);
  const [target, setTarget] = useState({
    amount: false,
    address: false,
    authCode: false,
  });

  const [validForm, setValidForm] = useState(false);

  const {
    setProfileModalByKey,
    removeInfoMessage,
    closeAllProfileModal,
    setSelectWallet,
    setSelectTab,
    setWithdrawFee,
  } = profileActions;

  const withdrawableBalance = select(selectWithdrawableBalance);
  const walletError = select(selectWalletError);
  const profileInfoMesg = select(selectProfileInfoMessage);
  const withdrawFee = select(selectWithdrawFee);

  const pastFromClipBoard = async () => {
    const readText = await navigator.clipboard.readText();
    handleValues("address", readText);
  };

  const handleValues = (key: string, e: string) => {
    setValues((prevState) => ({
      ...prevState,
      [key]: e,
    }));

    setTarget((prevState) => ({
      ...prevState,
      [key]: true,
    }));
  };

  const handleFiatClick = () => {
    dispatch(setProfileModalByKey("withdraw"));
  };

  const handleClose = () => {
    dispatch(removeInfoMessage("full"));
  };

  const handleFormSubmit = () => {
    dispatch(
      postWithdraw({
        address: values?.address,
        amount: priceToNumber(values?.amount),
        totp_code: +values?.authCode,
        currency: walletCurrency,
        ...(walletCurrency === "USDC" && {
          chain: "ETH",
        }),
      })
    );
  };

  useEffect(() => {
    dispatch(getWithdrawableBalanceAsync());

    return () => {
      dispatch(setWithdrawFee(null));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setError({
      amount: values?.amount ? "" : "Amount is required",
      address: values?.address ? "" : "Address is required",
      authCode: values?.authCode.length === 6 ? "" : "Address is required",
    });

    if (priceToNumber(values?.amount) > withdrawableBalance[walletCurrency]) {
      setError((prevState) => ({
        ...prevState,
        amount: "You do not have enough funds to withdraw",
      }));
      setValidForm(false);
      return;
    }

    if (priceToNumber(values?.amount) > withdrawMaxLimit[walletCurrency]) {
      setError((prevState) => ({
        ...prevState,
        amount: `Max ${walletCurrency} ${nFormatter({
          num: withdrawMaxLimit[walletCurrency],
          endingPlus: false,
        })}`,
      }));
      setValidForm(false);
      return;
    }

    if (priceToNumber(values?.amount) < withdrawMinLimit[walletCurrency]) {
      setError((prevState) => ({
        ...prevState,
        amount: `Min ${walletCurrency} ${withdrawMinLimit[walletCurrency]}`,
      }));
      setValidForm(false);
      return;
    }

    setValidForm(
      !!values?.amount &&
        !!values?.address &&
        values?.authCode.length === 6 &&
        walletError !== errors?.MAXIMUM_NUM_AVAILABLE_WITHDRAWALS
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (profileInfoMesg.some((el) => el === infoMessages.WITHDRAW_SUCCESS)) {
      dispatch(removeInfoMessage("full"));
      dispatch(closeAllProfileModal());
      dispatch(setSelectWallet(""));
      dispatch(setSelectTab("deposit"));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileInfoMesg]);

  useDebouncedEffect(
    () => {
      if (priceToNumber(values.amount) > 0 && walletCurrency === "XNL") {
        dispatch(
          getWithdrawFeeAsync({ withdraw_amount: priceToNumber(values.amount) })
        );
      }
    },
    250,
    [values.amount]
  );

  return (
    <div>
      <div className={s.info}>
        <h4 className={s.title}>Send {walletCurrency}</h4>
        <div className={s.withdrawal}>
          <p className={s.withdrawalTitle}>Available for withdrawal:</p>
          <span>
            <span className={walletCurrency}>{walletCurrency}</span>{" "}
            {transformPrice(withdrawableBalance[walletCurrency])}
          </span>
        </div>
        <p className={s.desc}>
          Any funds that were added to the account during the last 14 work days
          are currently unavailable for withdrawal but they are still yours and
          will be available after the buffer period ends.
        </p>

        <form>
          <div className={s.inputRow}>
            <h5 className={s.label}>Receiver Address</h5>
            <div className={s.inputWrap}>
              <CustomInput
                placeholder="Receiver Address"
                name="Receiver Address"
                value={values.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleValues("address", e?.target?.value)
                }
                errorMessage={
                  target?.address && errorsForm?.address
                    ? errorsForm?.address
                    : ""
                }
              />
              <CustomButton
                value="paste"
                onClick={pastFromClipBoard}
                icon={<CopyIcon />}
                theme="transparent"
                className={s.btn}
                id="paste"
              />
            </div>
          </div>
          <div className={s.inputRow}>
            <h5 className={s.label}>
              <span className={walletCurrency}>{walletCurrency}</span> amount
            </h5>
            <div className={s.inputWrap}>
              <PriceInput
                placeholder="0.00"
                message="min $26 max $10K"
                name="amount_send"
                value={values.amount}
                onChange={(e: any) => handleValues("amount", e.target.value)}
                errorMessage={
                  target?.amount && errorsForm?.amount ? errorsForm?.amount : ""
                }
              />
              <CustomButton
                value="max"
                onClick={() =>
                  handleValues(
                    "amount",
                    `$${withdrawableBalance[walletCurrency]}`
                  )
                }
                icon={<DownloadIcon />}
                theme="transparent"
                className={s.btn}
                id="max_send"
              />
            </div>

            {walletCurrency === "XNL" && (
              <div>
                <DetailRow
                  title="Fee"
                  value={transformPrice(withdrawFee?.fee || 0)}
                  type="price"
                  valueCurrency={walletCurrency}
                  className={s.amountDetail}
                  loading={profileInfoMesg.some(
                    (el) => el === infoMessages.LOADING_WITHDRAW_FEE
                  )}
                />
                <DetailRow
                  title="To be withdraw"
                  value={transformPrice(withdrawFee?.withdraw_after_fee || 0)}
                  type="price"
                  valueCurrency={walletCurrency}
                  className={s.amountDetail}
                  loading={profileInfoMesg.some(
                    (el) => el === infoMessages.LOADING_WITHDRAW_FEE
                  )}
                />
              </div>
            )}
          </div>
          <div className={s.inputRow}>
            <CustomAuthCode
              onChange={(e) => handleValues("authCode", e)}
              onComplete={handleFormSubmit}
              className={s.authCode}
              label="SECURITY VERIFICATION"
              list={[
                walletError === errors.INVALID_TOTP_CODE
                  ? "Invalid code. Please try again."
                  : "Enter the 6-digit code from your authentication app (such as Duo or Google Authenticator)",
              ]}
              isInvadil={walletError === errors.INVALID_TOTP_CODE}
              onSubmit={handleFormSubmit}
              disabledSubmit={!validForm || values.authCode.length !== 6}
            />
          </div>
          <CustomButton
            value="withdraw"
            onClick={handleFormSubmit}
            disabled={!validForm}
            loading={profileInfoMesg.some(
              (el) => el === infoMessages.LOADING_WITHDROW
            )}
          />
        </form>
      </div>
      {walletCurrency === "USDC" && (
        <>
          <Or className={s.or} />
          <ButtonToFiat value="Withdraw to fiat" onClick={handleFiatClick} />
        </>
      )}

      {profileInfoMesg.some((el) => el === errors.WITHDRAW_ERROR) && (
        <ItemBoughtErrorModal
          error={errors.WITHDRAW_ERROR}
          onCancelClick={handleClose}
          text={walletError}
        />
      )}
    </div>
  );
};
