import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop from "react-image-crop";
import { Counter, CustomButton, SelectAvatarAsNFT } from "..";
import { useRedux } from "../../hooks";
import Placeholder from "../../public/img/placeholder_load_img.png";
import { setUserDataAsync } from "../../redux";
import { ImageIcon, TrashIcon } from "../Icons";
import s from "./DragAndDrop.module.scss";

export const DragAndDrop = ({
  selectImg,
  handleOnDrop,
  handleOnCropComplete,
  handleClearToDefault,
  hadleOnImageLoaded,
  imageMaxSize,
  handleSelectAvatarFromItem,
  acceptedFileTypes,
  errors,
  handleCancel,
  loader,
  setLoader,
}: any) => {
  const isVertical = selectImg && selectImg.width > selectImg.height;
  const [crop, setCrop] = useState<any>({
    x: 0,
    y: 0,
    aspect: 1 / 1,
    unit: "%",
    ...(isVertical ? { height: 100 } : { width: 100 }),
  });
  const [_, dispatch] = useRedux();
  const [openMyItemsModal, setOpenMyItemsModal] = useState(false);
  const [count, setCount] = useState(0);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: handleOnDrop,
    noClick: true,
    noKeyboard: true,
    accept: acceptedFileTypes,
    maxSize: imageMaxSize,
    multiple: false,
  });

  const handleSelectAvatar = (item: any) => {
    handleSelectAvatarFromItem(item);
    setOpenMyItemsModal(false);
  };

  useEffect(() => {
    if (!selectImg?.name) return setLoader(true);

    const interval = setTimeout(() => {
      if (selectImg.url) {
        dispatch(setUserDataAsync({ logo_link: selectImg.url }));
        clearInterval(interval);
        handleCancel();
        return;
      }

      setLoader(false);
      clearInterval(interval);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectImg]);

  return (
    <div>
      {!selectImg ? (
        <>
          <div {...getRootProps()} className={s.dragAndDrop}>
            <input {...getInputProps()} />
            <h3 className={s.title}>
              <span className="violetLink" onClick={open}>
                Upload
              </span>{" "}
              or drag and drop file here
            </h3>
            <p className={s.or}>or</p>
            <CustomButton
              className={s.btn}
              theme="violet"
              icon={<ImageIcon />}
              value="Select from my items  "
              onClick={() => setOpenMyItemsModal(true)}
            />
            <p className={s.desc}>
              <span>PNG, JPG, JPEG</span>
              <span>{"< 2Mb"}</span>
            </p>
          </div>

          {!!errors.length && (
            <div className={s.errors}>
              {errors.map((el: any) => (
                <p key={el} className={s.error}>
                  {el}
                </p>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className={s.cropperWrap}>
            {!loader ? (
              <ReactCrop
                src={selectImg.imgSrc}
                crop={crop}
                onComplete={handleOnCropComplete}
                onChange={(newCrop) => setCrop(newCrop)}
                onImageLoaded={hadleOnImageLoaded}
              />
            ) : (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={Placeholder} />
            )}

            <div className={s.wrapperInfo}>
              <div className={s.nameWrap}>
                <ImageIcon />
                <span className={s.name}>{selectImg.name}</span>
              </div>
              {!loader ? (
                <CustomButton
                  className={s.btnRemove}
                  theme="red"
                  icon={<TrashIcon />}
                  value="remove"
                  onClick={handleClearToDefault}
                />
              ) : (
                <div className={s.loader}>
                  <p className={s.count}>
                    <Counter duration={2} setCount={setCount} />%
                  </p>
                  <div className={s.bg} style={{ width: `${count}%` }} />
                </div>
              )}
            </div>
          </div>
          {!!errors.length && (
            <div className={s.errors}>
              {errors.map((el: any) => (
                <p key={el} className={s.error}>
                  {el}
                </p>
              ))}
            </div>
          )}
        </>
      )}

      {openMyItemsModal && (
        <SelectAvatarAsNFT
          onClose={() => setOpenMyItemsModal(false)}
          handleSelectItem={handleSelectAvatar}
        />
      )}
    </div>
  );
};
