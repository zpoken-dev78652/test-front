import React, { useState } from "react";
import cn from "classnames";
import {
  CustomAuthCode,
  CustomButton,
  CustomTabs,
  ItemBoughtErrorModal,
  LogoCard,
  Modal,
  PriceInput,
} from "../..";
import {
  postCreateOffers,
  profileActions,
  selectProfileError,
  selectProfileInfoMessage,
  selectUserData,
} from "../../../redux";
import { useRedux } from "../../../hooks";
import s from "./TradeStepsModal.module.scss";
import {
  curencyForSelect,
  errors,
  infoMessages,
  offerMaxLimit,
  Routes,
} from "../../../constants";
import { nFormatter, priceToNumber, transformPrice } from "../../../helpers";
import { ArrowRightIcon, CrossIcon, LinkIcon } from "../../Icons";
import { BalanceCurrency, SelectOption } from "../../../types";

type TradeStepsModalProps = {
  item: any;
  onClose?: () => void;
  userId: string | number;
};

export const TradeStepsModal = ({
  item,
  onClose = () => {},
  userId,
}: TradeStepsModalProps) => {
  const [select, dispatch] = useRedux();
  const [authCode, setAuthCode] = useState("");
  const [selectCurrency, setSelectCurrency] = useState<SelectOption>(
    curencyForSelect[0]
  );

  const infoMessage = select(selectProfileInfoMessage);
  const error = select(selectProfileError);
  const user = select(selectUserData);

  const { setError, setProfileModalByKey } = profileActions;

  const [price, setPrice] = useState<number>();
  const itemsForSell = item?.duplicates?.filter((el: any) => !el.offer_id);
  const [selectItem, setSelectItem] = useState(itemsForSell[0]);
  const isTotpActive = user?.is_totp_active;
  const tabs = ["Step 1", "Step 2", ...(isTotpActive ? ["Step 3"] : [])];
  const [selectTab, setSelectTab] = useState(tabs[0]);

  const loading = infoMessage.some(
    (info) => info === infoMessages.LOADING_CREATE_OFFER
  );

  const isValid = () => {
    if (selectTab === tabs[0]) return true;
    if (selectTab === tabs[1]) {
      const nPrice = priceToNumber(price || 0);
      return (
        nPrice &&
        nPrice >= 0.8 &&
        nPrice <= offerMaxLimit[selectCurrency.value as BalanceCurrency]
      );
    }

    if (selectTab === tabs[2]) return authCode.length === 6;
  };

  const handleNext = async () => {
    if (selectTab === tabs[0]) {
      setSelectTab(tabs[1]);
      return;
    }

    if (selectTab === tabs[1] && isTotpActive) {
      setSelectTab(tabs[2]);
      return;
    }

    dispatch(
      postCreateOffers({
        price: {
          value: price && priceToNumber(price),
          currency: selectCurrency.value,
        },
        nft_id: selectItem?.nft_id,
        item,
        ...(isTotpActive && { totp_code: authCode }),
      })
    );
  };

  const handleClose = () => {
    dispatch(setError(""));
  };

  const handleOkModal = () => {
    dispatch(setError(""));
    onClose();
    dispatch(setProfileModalByKey("wallet"));
  };

  return (
    <>
      <Modal type="vertical" isCloseBtnHidden onClose={onClose}>
        <div className={s.tradeModalWrap}>
          <div>
            <CustomTabs
              name="tradeSteps"
              tabs={tabs}
              selectTab={selectTab}
              className={s.tabs}
            />
          </div>
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
            {selectTab === "Step 1" && (
              <>
                <p className={s.desc}>
                  Select a copy which you want to sell or trade
                </p>
                {itemsForSell.length && (
                  <div className={s.items}>
                    {itemsForSell.map((el: any) => (
                      <div
                        key={el.nft_index}
                        className={cn([s.item], {
                          [s.isActive]: el.nft_index === selectItem.nft_index,
                        })}
                        onClick={() => setSelectItem(el)}
                      >
                        {item.num_in_collection}. #{el.nft_index} /{" "}
                        {item.total_nft_num}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {selectTab === "Step 2" && (
              <>
                <div className={s.selectDesc}>
                  {item.num_in_collection}. #{selectItem?.nft_index} /{" "}
                  {item.total_nft_num}
                </div>
                <PriceInput
                  title="Choose currency and price"
                  name="price_steps_modal"
                  placeholder="0.00"
                  message={`min ${selectCurrency.value} 0.80 max ${
                    selectCurrency.value
                  } ${nFormatter({
                    num: offerMaxLimit[selectCurrency.value as BalanceCurrency],
                    endingPlus: false,
                  })}`}
                  error={!!price && !isValid()}
                  value={price}
                  onChange={(e: any) => setPrice(e.target.value)}
                  currency={selectCurrency}
                  setCurrency={setSelectCurrency}
                />
                <div className={s.detail}>
                  <div className={s.detailItem}>
                    <span className={s.detailName}>SERVICE FEE</span>
                    <span className={s.detailValue}>
                      <span className={selectCurrency.value as string}>
                        {selectCurrency.value}
                      </span>{" "}
                      {transformPrice(
                        (priceToNumber(price || 0) * 0.05).toFixed(2)
                      )}
                    </span>
                  </div>
                  <div className={s.detailItem}>
                    <span className={s.detailName}>YOU’LL RECEIVE</span>
                    <span className={s.detailValue}>
                      <span className={selectCurrency.value as string}>
                        {selectCurrency.value}
                      </span>{" "}
                      {transformPrice(
                        (priceToNumber(price || 0) * 0.95).toFixed(2)
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}

            {selectTab === "Step 3" && (
              <CustomAuthCode
                onChange={setAuthCode}
                onComplete={handleNext}
                className={s.authCode}
                label="SECURITY VERIFICATION"
                list={[
                  error === errors.INVALID_TOTP_CODE
                    ? "Invalid code. Please try again."
                    : "Enter the 6-digit code from your authentication app (such as Duo or Google Authenticator)",
                ]}
                isInvadil={error === errors.INVALID_TOTP_CODE}
                onSubmit={handleNext}
                disabledSubmit={!isValid()}
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
              value={"next"}
              icon={<ArrowRightIcon />}
              onClick={handleNext}
              disabled={!isValid()}
              loading={loading}
            />
          </div>
        </div>
      </Modal>
      {(error === errors.NO_ONFIDO_ID || error === errors.OFFER_NO_CONTENT) && (
        <ItemBoughtErrorModal
          error={error}
          onCancelClick={handleClose}
          onBuyClick={handleOkModal}
          {...(error === errors.OFFER_NO_CONTENT && {
            text: errors.OFFER_NO_CONTENT,
          })}
        />
      )}
    </>
  );
};
