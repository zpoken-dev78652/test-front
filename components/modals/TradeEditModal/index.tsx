import React, { useEffect, useState } from "react";
import {
  CustomAuthCode,
  CustomButton,
  LogoCard,
  Modal,
  PriceInput,
} from "../..";
import {
  putEditOffers,
  selectChronicleTradeStatus,
  selectUserData,
  tradeActions,
  TypeTrade,
} from "../../../redux";
import { useMediaQuery, useRedux } from "../../../hooks";
import {
  errors,
  infoMessages,
  mobileWidth,
  offerMaxLimit,
  Routes,
} from "../../../constants";

import s from "./TradeEditModal.module.scss";
import { priceToNumber, transformPrice } from "../../../helpers";
import { useRouter } from "next/router";
import { ArrowRightIcon, CrossIcon, LinkIcon } from "../../Icons";
import { BalanceCurrency } from "../../../types";

type TradeStepsModalProps = {
  item: any;
  onClose?: () => void;
  userId: string | number;
};

export const TradeEditModal = ({
  item,
  onClose,
  userId,
}: TradeStepsModalProps) => {
  const { asPath } = useRouter();
  const [select, dispatch] = useRedux();
  const [authCode, setAuthCode] = useState("");
  const { error, infoMessage }: Partial<TypeTrade> = select(
    selectChronicleTradeStatus
  );
  const user = select(selectUserData);
  const isTotpActive = user?.is_totp_active;

  const { removeInfoMessage, setError } = tradeActions;

  const [price, setPrice] = useState(item.default_price.value);
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);
  const loading = infoMessage.some(
    (info) => info === infoMessages.LOADING_EDIT_OFFER
  );

  const isValid = () => {
    const nPrice = priceToNumber(price);
    if (nPrice === item.default_price.value) return false;
    return (
      nPrice &&
      nPrice >= 0.8 &&
      nPrice <= offerMaxLimit[item.default_price.currency as BalanceCurrency]
    );
  };

  const handleEdit = async () => {
    dispatch(
      putEditOffers(
        item,
        {
          price: {
            value: priceToNumber(price),
            currency: item.default_price.currency,
          },
          ...(isTotpActive && { totp_code: authCode }),
        },
        asPath.startsWith("/store/nft")
      )
    );
  };

  useEffect(() => {
    if (infoMessage.some((info) => info === infoMessages.EDDIDED_OFFER)) {
      dispatch(removeInfoMessage(infoMessages.EDDIDED_OFFER));
      onClose && onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoMessage]);

  useEffect(() => {
    return () => {
      dispatch(setError(""));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      type="vertical"
      isCloseBtnHidden={!isMobile}
      styleOnClose={s.closeIcon}
      onClose={onClose}
    >
      <div className={s.tradeModalWrap}>
        <div className={s.header}>Edit Listing</div>
        <div className={s.content}>
          <LogoCard item={item} className={s.img} />
          <div className={s.name}>
            #{item.num_in_collection} - {item.item_name}
          </div>
          <div className={s.btnLink}>
            <CustomButton
              theme="link"
              icon={<LinkIcon />}
              linkTo={`${Routes.PROFILE}/${userId}/collection/${item.collection_id}`}
              value={item.collection_name}
            />
          </div>
          <div className={s.selectDesc}>
            {item.num_in_collection}. #{item.nft_index} / {item.total_nft_num}
          </div>
          <PriceInput
            placeholder="0.00"
            name="price_trade_edit"
            startTest={item.default_price.currency}
            error={!!price && !isValid()}
            value={price}
            onChange={(e: any) => setPrice(e.target.value)}
            errorMessage={
              priceToNumber(price) === item?.default_price?.value
                ? "Current price"
                : ""
            }
          />
          <div className={s.detail}>
            <div className={s.detailItem}>
              <span className={s.detailName}>SERVICE FEE</span>
              <span className={s.detailValue}>
                <span className={item?.default_price?.currency}>
                  {item?.default_price?.currency}
                </span>{" "}
                {transformPrice((priceToNumber(price || 0) * 0.05).toFixed(2))}
              </span>
            </div>
            <div className={s.detailItem}>
              <span className={s.detailName}>YOU’LL RECEIVE</span>
              <span className={s.detailValue}>
                <span className={item?.default_price?.currency}>
                  {item?.default_price?.currency}
                </span>{" "}
                {transformPrice((priceToNumber(price || 0) * 0.95).toFixed(2))}
              </span>
            </div>
          </div>
          {isTotpActive && (
            <CustomAuthCode
              onChange={setAuthCode}
              onComplete={handleEdit}
              className={s.authCode}
              label="SECURITY VERIFICATION"
              list={[
                error === errors.INVALID_TOTP_CODE
                  ? "Invalid code. Please try again."
                  : "Enter the 6-digit code from your authentication app (such as Duo or Google Authenticator)",
              ]}
              isInvadil={error === errors.INVALID_TOTP_CODE}
              onSubmit={handleEdit}
              disabledSubmit={
                !isValid() || (isTotpActive && authCode.length !== 6)
              }
            />
          )}
        </div>
        <div className={s.btns}>
          <CustomButton
            className={s.btnIcon}
            theme="transparent"
            value="Cancel"
            icon={<CrossIcon />}
            onClick={onClose}
          />
          <CustomButton
            className={s.btnIcon}
            theme="violet"
            value={"Create listing"}
            icon={<ArrowRightIcon />}
            onClick={handleEdit}
            disabled={!isValid() || (isTotpActive && authCode.length !== 6)}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};
