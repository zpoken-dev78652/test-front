import React, { useEffect, useState } from "react";
import cn from "classnames";
import {
  CustomAuthCode,
  CustomButton,
  CustomInput,
  CustomTabs,
  ItemBoughtErrorModal,
  LogoCard,
  Modal,
} from "../..";
import {
  postWithdrawNftAsync,
  selectBoughtError,
  selectInfoMessage,
  storeActions,
} from "../../../redux";
import { useRedux } from "../../../hooks";
import s from "./WithdrawItemModal.module.scss";
import { errors, infoMessages, regex, Routes } from "../../../constants";
import {
  ArrowRightIcon,
  CopyIcon,
  CrossIcon,
  LinkIcon,
  UploadIcon,
} from "../../Icons";
import { useRouter } from "next/router";

type WithdrawItemModalProps = {
  item: any;
  onClose?: () => void;
  userId: string | number;
};
const initialValues = {
  address: "",
  authCode: "",
};

export const WithdrawItemModal = ({
  item,
  onClose = () => {},
  userId,
}: WithdrawItemModalProps) => {
  const [select, dispatch] = useRedux();
  const { push } = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errorsForm, setError] = useState(initialValues);
  const [acceptModal, setAcceptModal] = useState(false);
  const [target, setTarget] = useState({
    address: false,
    authCode: false,
  });

  const infoMessage = select(selectInfoMessage);
  const error = select(selectBoughtError);

  const { removeInfoMessage, setError: setStoreError } = storeActions;

  const itemsForSell = item?.duplicates?.filter((el: any) => !el.offer_id);
  const [selectItem, setSelectItem] = useState(itemsForSell[0]);
  const tabs = ["Step 1", "Step 2", "Step 3"];
  const [selectTab, setSelectTab] = useState(tabs[0]);

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

  const pastFromClipBoard = async () => {
    const readText = await navigator.clipboard.readText();
    handleValues("address", readText);
  };

  const loading = infoMessage.some(
    (info) => info === infoMessages.LOADING_WITHDRAW_NFT
  );

  const isValid = () => {
    if (selectTab === tabs[0]) return true;
    if (selectTab === tabs[1]) {
      return target.address && values.address && !errorsForm.address;
    }

    if (selectTab === tabs[2])
      return target.address && values.address && values.authCode.length === 6;
  };

  const handleNext = async () => {
    if (selectTab === tabs[0]) {
      setSelectTab(tabs[1]);
      return;
    }

    if (selectTab === tabs[1]) {
      setSelectTab(tabs[2]);
      return;
    }

    dispatch(
      postWithdrawNftAsync({
        nft_id: selectItem?.nft_id,
        address: values.address,
        totp_code: values.authCode,
      })
    );
  };

  const handleCloseInfoModal = () => {
    onClose();
    dispatch(setStoreError(""));
  };

  useEffect(() => {
    const adressError = (e: string) => {
      if (!e) return "Address is required";
      if (e && !regex.ethereum.test(e)) return "Address is bad";
      return "";
    };

    setError({
      address: adressError(values?.address),
      authCode: values?.authCode.length === 6 ? "" : "Auth code is required",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (infoMessage.some((el) => el === infoMessages.WITHDRAW_NFT_SUCCESS)) {
      dispatch(removeInfoMessage(infoMessages.WITHDRAW_NFT_SUCCESS));
      push({
        pathname: `/profile/${userId}/collection`,
        query: { tab: "items" },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoMessage]);

  return (
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
          )}

          {selectTab === "Step 3" && (
            <div>
              <p className={s.infoText}>
                You wish to withdraw the NFT from your Chronicle profile
                permanently, and the wallet address you have provided{" "}
                <span className={s.addres}>{values.address}</span> is the
                intended recipient.
              </p>
              <CustomAuthCode
                onChange={(e) => handleValues("authCode", e)}
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
                disabledSubmit={!isValid() || values.authCode.length !== 6}
              />
            </div>
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
            theme={selectTab === "Step 3" ? "red" : "violet"}
            value={selectTab === "Step 3" ? "withdraw" : "next"}
            icon={selectTab === "Step 3" ? <UploadIcon /> : <ArrowRightIcon />}
            onClick={handleNext}
            disabled={!isValid()}
            loading={loading}
          />
        </div>
      </div>
      {error === errors.WITHDRAW_NOT_NFT && (
        <ItemBoughtErrorModal
          error={errors.SOMETHING_WENT_WRONG}
          text={errors.WITHDRAW_NOT_NFT}
          onCancelClick={handleCloseInfoModal}
        />
      )}
    </Modal>
  );
};
