import React, { FC, useEffect, useRef, useState } from "react";
import { useDragAndDrop, useInterval, useRedux } from "../../../hooks";
import {
  deleteUserAsync,
  globalActions,
  GlobalModals,
  profileActions,
  resetTotpAsync,
  selectBoughtError,
  selectIsUnique,
  selectProfileError,
  selectProfileInfoMessage,
  selectSettingsModal,
  selectUserData,
  setUserDataAsync,
  storeActions,
} from "../../../redux";
import { VerticalModal } from "../VerticalModal";
import s from "./PersonalSettingsModal.module.scss";
import Avatar from "../../../public/img/chronicle_avatar.png";
import Image from "next/image";
import moment from "moment";
import {
  ArrowRightIcon,
  CameraIcon,
  EditIcon,
  EmailIcon,
  LockIcon,
  PhoneIcon,
  TrashIcon,
} from "../../Icons";
import {
  CustomAuthCode,
  CustomButton,
  DefaultModal,
  DragAndDrop,
  ItemBoughtErrorModal,
  ProfileSettingCard,
  UserNameForm,
} from "../..";
import { errors, infoMessages } from "../../../constants";
import { DISCARD_CHANGES } from "../ItemBoughtErrorModal/data";

type PersonalSettingsModalType = {
  handleClose: () => void;
};

export const PersonalSettingsModal: FC<PersonalSettingsModalType> = ({
  handleClose,
}) => {
  const canvas = useRef<any>(null);
  const [select, dispatch] = useRedux();
  const [authCode, setAuthCode] = useState<string>();
  const [resetTotp, setResetTotp] = useState(false);
  const [showTotpForRemove, setShowTotpForRemove] = useState(false);
  const [totpForRemove, setTotpForRemove] = useState("");
  const [time, setTime] = useState(0);
  const [openEditNameModal, setOpenEditNameModal] = useState(false);
  const [openChangeAvaModal, setOpenChangeAvaModal] = useState(false);
  const [openPhoneWarningModal, setOpenPhoneWarningModal] = useState(false);
  const [openRemoveAcc, setOpenRemoveAcc] = useState(false);
  const [name, setName] = useState("");

  const { username } = select<any>((state) => state.form);
  const isUnique = select(selectIsUnique);
  const user = select(selectUserData);
  const profileInfoMessage = select(selectProfileInfoMessage);
  const profileError = select(selectProfileError);
  const error = select(selectBoughtError);
  const settingsModal = select(selectSettingsModal);

  const { setError } = storeActions;
  const { setSettingsModalByKey } = globalActions;
  const { removeInfoMessage, setProfileModalByKey } = profileActions;

  const ferifyKyc = user?.is_onfido_passed;
  const ferifyPhone = user?.is_phone_verified;
  const ferifyTotp = user?.is_totp_active;

  const {
    selectImg,
    imageMaxSize,
    acceptedFileTypes,
    errors: hookErrors,
    loader,
    setLoader,
    handleOnDrop,
    handleOnCropComplete,
    handleUploadCropImg,
    hadleOnImageLoaded,
    handleClearToDefault,
    handleSelectAvatarFromItem,
  } = useDragAndDrop(canvas);

  const handleKyc = () => {
    handleClose();
    dispatch(setProfileModalByKey("wallet"));
  };

  const resetTotpFunc = () => {
    if (!ferifyPhone) {
      setOpenPhoneWarningModal(true);
      return;
    }

    if (!ferifyTotp) {
      dispatch(setSettingsModalByKey(GlobalModals.totp));
      return;
    }

    if (ferifyTotp) {
      setTime(60);
    }

    dispatch(resetTotpAsync({}));
    setResetTotp(true);
  };

  const handleTotp = () => {
    if (
      authCode?.length !== 6 ||
      profileInfoMessage.some((el) => el === infoMessages.LOADING_TOTP)
    )
      return;

    if (ferifyTotp && resetTotp) {
      dispatch(resetTotpAsync({ code: authCode }));
      return;
    }
  };

  useInterval(
    () => {
      setTime((prevState) => prevState - 1);
    },
    time > 0 ? 1000 : null
  );

  const handleCancelChandeAva = () => {
    if (selectImg) handleClearToDefault();
    setOpenChangeAvaModal(false);
  };

  const handleSubmitChandeAva = () => {
    handleUploadCropImg({ id: user.id });
    setOpenChangeAvaModal(false);
  };

  const handleOpenChangeName = () => {
    setName(DISCARD_CHANGES === error ? name : user.username);
    dispatch(setError(null));
    setOpenEditNameModal(true);
  };

  const handleCancelEditName = () => {
    if (user.username !== name) {
      dispatch(setError(DISCARD_CHANGES));
    }

    setOpenEditNameModal(false);
  };

  const handleSubmitEditName = () => {
    dispatch(setUserDataAsync({ name }));
    setOpenEditNameModal(false);
  };

  const handleCloseWarningModal = () => {
    dispatch(setError(null));
  };

  const handleRemoveClick = () => {
    if (user?.is_totp_active && !totpForRemove) {
      setShowTotpForRemove(user?.is_totp_active);
      return;
    }

    setOpenRemoveAcc(true);
  };

  useEffect(() => {
    if (profileInfoMessage.some((el) => el === infoMessages.RESET_TOTP)) {
      setResetTotp(false);
      dispatch(removeInfoMessage("full"));
      dispatch(setSettingsModalByKey(GlobalModals.totp));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileInfoMessage]);

  useEffect(() => {
    if (settingsModal?.resetTotp) {
      dispatch(setSettingsModalByKey(GlobalModals.profile));
      resetTotpFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsModal]);

  useEffect(() => {
    if (profileError === errors.INVALID_TOTP_CODE) {
      setOpenRemoveAcc(false);
    }
  }, [profileError]);

  return (
    <VerticalModal onClose={handleClose} header="personal settings">
      <div className={s.profile}>
        <div className={s.avatarWrap}>
          <div className={s.avatar}>
            <Image
              src={user?.logo || Avatar}
              alt="avatar"
              width="100%"
              height="100%"
            />
            <div
              className={s.camera}
              onClick={() => setOpenChangeAvaModal(true)}
            >
              <CameraIcon />
            </div>
          </div>
        </div>

        <div className={s.bio}>
          <div className={`${s.nick}`}>
            <span className="ellipsis">{user && user.username}</span>
            <div className={s.editNameIcon}>
              <EditIcon onClick={handleOpenChangeName} size={12} />
            </div>
          </div>
          <div className={s.name}>
            {user && user.fullName ? user.fullName : user && user.username}{" "}
            {user?.registered_at && (
              <span className={s.data}>
                Since {moment(user?.registered_at).format("MMM YYYY")}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={s.personalSettings}>
        <div>
          <ProfileSettingCard
            title="Email is Verified"
            desc={user?.email}
            verified
            icon={EmailIcon}
            className={s.profileSetting}
          />

          <ProfileSettingCard
            title={`Phone Number is ${!ferifyPhone ? "Not " : ""}Verified`}
            desc={
              ferifyPhone
                ? `(**) ** ** ${user?.phone_last_digits}`
                : "To prevent from possibility of losing your account or any related data we need your phone number to be verified"
            }
            btnValue={ferifyPhone ? "" : "VERIFY"}
            verified={ferifyPhone}
            icon={PhoneIcon}
            className={s.profileSetting}
            btnFunc={() => dispatch(setSettingsModalByKey(GlobalModals.phone))}
          />

          <ProfileSettingCard
            title={`2FA is ${!ferifyTotp ? "Not " : ""}Set`}
            desc={
              ferifyTotp
                ? "Time-based One Time Password"
                : "In order to guarantee the security of your transactions and property we will need you to set up 2-factor authentication"
            }
            btnValue={
              ferifyTotp
                ? `Reset Authenticator ${time > 0 ? `(${time})` : ""}`
                : "Set up"
            }
            verified={ferifyTotp}
            icon={LockIcon}
            className={s.profileSetting}
            btnFunc={resetTotpFunc}
            disableBtn={time > 0 && ferifyTotp}
          />

          {resetTotp && (
            <div className={s.twoFaWrapper}>
              <CustomAuthCode
                onChange={setAuthCode}
                onComplete={handleTotp}
                className={s.authCode}
                label={"Verification"}
                list={[
                  profileError === errors.INVALID_PHONE_CODE ||
                  profileError === errors.SMS_MANY_REQUSTS
                    ? profileError === errors.SMS_MANY_REQUSTS
                      ? "Sorry, but you sent too many sms at the same time, please try again later."
                      : "It seems like this code is not the one that we've sent you, please check if the spelling is correct;"
                    : "You will receive 6 digits confirmation code.",
                ]}
                isInvadil={
                  profileError === errors.INVALID_PHONE_CODE ||
                  profileError === errors.SMS_MANY_REQUSTS
                }
                onSubmit={handleTotp}
                hideReset
              />
              <CustomButton
                value="Reset"
                disabled={
                  authCode?.length !== 6 ||
                  profileInfoMessage.some(
                    (el) => el === infoMessages.LOADING_TOTP
                  )
                }
                type="submit"
                icon={<ArrowRightIcon />}
                onClick={handleTotp}
              />
            </div>
          )}

          <div className={s.or}>
            <span className={s.line}></span>
            <span className={s.text}>KYC and Personal data</span>
            <span className={s.line}></span>
          </div>

          <ProfileSettingCard
            title={`KYC is ${!ferifyKyc ? "Not " : ""}Verified`}
            desc={
              !ferifyKyc
                ? "Please complete your identity verification to access the Chronicle Wallet for USDC payments and the secondary marketplace."
                : ""
            }
            btnValue={!ferifyKyc ? "Verify" : ""}
            verified={ferifyKyc}
            icon={LockIcon}
            btnFunc={handleKyc}
          />
        </div>
        <div className={s.removeWrap}>
          {showTotpForRemove && (
            <CustomAuthCode
              onChange={setTotpForRemove}
              onComplete={handleRemoveClick}
              className={s.authCode}
              label="SECURITY VERIFICATION"
              list={[
                profileError === errors.INVALID_TOTP_CODE
                  ? "Invalid code. Please try again."
                  : "Enter the 6-digit code from your authentication app (such as Duo or Google Authenticator)",
              ]}
              isInvadil={profileError === errors.INVALID_TOTP_CODE}
              onSubmit={handleRemoveClick}
              disabledSubmit={totpForRemove.length !== 6}
              autoFocus
            />
          )}
          <CustomButton
            theme="red"
            value="Remove account"
            icon={<TrashIcon />}
            onClick={handleRemoveClick}
            disabled={showTotpForRemove && totpForRemove.length !== 6}
          />
        </div>
      </div>

      {openChangeAvaModal && (
        <DefaultModal
          header="Upload Avatar"
          handleCancel={handleCancelChandeAva}
          handleSubmit={handleSubmitChandeAva}
          disabledSubtit={!!hookErrors.length || !selectImg || loader}
        >
          <>
            <DragAndDrop
              selectImg={selectImg}
              handleOnDrop={handleOnDrop}
              handleOnCropComplete={handleOnCropComplete}
              handleClearToDefault={handleClearToDefault}
              hadleOnImageLoaded={hadleOnImageLoaded}
              handleSelectAvatarFromItem={handleSelectAvatarFromItem}
              handleCancel={handleCancelChandeAva}
              imageMaxSize={imageMaxSize}
              acceptedFileTypes={acceptedFileTypes}
              errors={hookErrors}
              loader={loader}
              setLoader={setLoader}
            />
            <canvas ref={canvas} className={s.canvas}></canvas>
          </>
        </DefaultModal>
      )}

      {openEditNameModal && (
        <DefaultModal
          header="Change Display Name"
          handleCancel={handleCancelEditName}
          handleSubmit={handleSubmitEditName}
          disabledSubtit={!!username?.syncErrors || isUnique === false}
        >
          <UserNameForm
            value={name}
            changeValue={(e) => setName(e)}
            handleSubmit={handleSubmitEditName}
          />
        </DefaultModal>
      )}

      {error === DISCARD_CHANGES && (
        <ItemBoughtErrorModal
          error={DISCARD_CHANGES}
          onCancelClick={handleCloseWarningModal}
          onBuyClick={handleOpenChangeName}
        />
      )}

      {openPhoneWarningModal && (
        <ItemBoughtErrorModal
          error={errors.NO_VERIFY_PHONE}
          text="To get 2FA, verify your phone number with the code from message"
          onCancelClick={() => setOpenPhoneWarningModal(false)}
          onBuyClick={() => dispatch(setSettingsModalByKey(GlobalModals.phone))}
        />
      )}
      {openRemoveAcc && (
        <ItemBoughtErrorModal
          error={errors.REMOVE_ACCOUNT}
          onCancelClick={() => setOpenRemoveAcc(false)}
          onBuyClick={() =>
            dispatch(
              deleteUserAsync({ ...(totpForRemove && { totp: totpForRemove }) })
            )
          }
        />
      )}
    </VerticalModal>
  );
};
