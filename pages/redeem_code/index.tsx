import React, { useState } from "react";
import { CustomButton, CustomInput, MainLayout } from "../../components";
import { CustomMaskInput } from "../../components/CustomMaskInput";
import { ArrowRightIcon } from "../../components/Icons";
import { errors, infoMessages } from "../../constants";
import { useRedux } from "../../hooks";
import {
  postApplyRedeemCouponAsync,
  selectBoughtError,
  selectInfoMessage,
  storeActions,
} from "../../redux";
import s from "./RedeemCode.module.scss";

const RedeemCodePage = () => {
  const [coupon, setCoupon] = useState("");
  const [select, dispatch] = useRedux();

  const error = select(selectBoughtError);
  const infoMessage = select(selectInfoMessage);

  const { setError } = storeActions;

  const handleRedeem = () => {
    dispatch(postApplyRedeemCouponAsync(coupon));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error === errors?.COUPON_IS_NOT_VALID) {
      dispatch(setError(""));
    }

    setCoupon(e?.target?.value);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        <div className={s.codeSide}>
          <h1>Redeem Code</h1>
          <div>
            <div className={s.inputWrap}>
              <CustomMaskInput
                placeholder="Enter Redemption Code"
                name="Redeem Code"
                value={coupon}
                onChange={handleChange}
                errorMessage={error || ""}
                mask={[
                  /\w/,
                  /\w/,
                  /\w/,
                  /\w/,
                  "-",
                  /\w/,
                  /\w/,
                  /\w/,
                  /\w/,
                  "-",
                  /\w/,
                  /\w/,
                  /\w/,
                  /\w/,
                  "-",
                  /\w/,
                  /\w/,
                  /\w/,
                  /\w/,
                ]}
              />
            </div>
            <CustomButton
              value="redeem"
              icon={<ArrowRightIcon />}
              onClick={handleRedeem}
              loading={infoMessage.some(
                (info) => info === infoMessages.LOADING_APPLY_COUPON
              )}
              disabled={!coupon}
            />
          </div>
        </div>
        <div className={s.line} />
        <div className={s.infoSide}>
          <h2>About Code Redemption</h2>
          <p>
            Before redeeming a code, register account on Chronicle or log in to
            your account. Once a code is redeemed, the redemption cannot be
            revoked. Make sure you log into the correct account before redeeming
            the code.
          </p>
          <p>
            After redeeming a code, you will receive the redeemed item through
            in-service notification, make sure to check that out.
          </p>
          <p>
            Pay attention to the redemption conditions and validity period of
            the redemption code. A code cannot be redeemed after it expires.
          </p>
        </div>
      </div>
    </div>
  );
};

RedeemCodePage.getLayout = function getLayout(page: any) {
  return <MainLayout noSpaceBottom>{page}</MainLayout>;
};

export default RedeemCodePage;
