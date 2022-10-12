import { useState } from "react";
import { useRedux } from ".";
import { base64StringtoFile, image64toCanvasRef } from "../helpers";
import { setUserDataAsync } from "../redux";

function extractImageFileExtensionFromBase64(base64Data: any) {
  return base64Data.substring(
    "data:image/".length,
    base64Data.indexOf(";base64")
  );
}

export const useDragAndDrop = (canvas: any) => {
  const [_, dispatch] = useRedux();
  const [loader, setLoader] = useState(true);
  const [selectImg, setSelectImg] = useState<any>();
  const [errors, setErrors] = useState<string[]>([]);
  const imageMaxSize = 2000000; // bytes
  const acceptedFileTypes = "image/png, image/jpg, image/jpeg";
  const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {
    return item.trim();
  });

  const verifyFile = (files: any) => {
    if (files && files.length > 0) {
      const currentFile = files[0] || files[0].file;
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;

      if (currentFileSize > imageMaxSize) {
        setErrors([
          `This file is not allowed. ${currentFileSize} bytes is too large, maximum ${imageMaxSize}`,
        ]);
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        setErrors(["This file is not allowed. Only images are allowed."]);
        return false;
      }

      return true;
    }
  };

  const handleOnDrop = (files: any, rejectedFiles: any) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      verifyFile(rejectedFiles);
    }

    if (files && files.length > 0) {
      const isVerified = verifyFile(files);

      if (isVerified) {
        const currentFile = files[0];
        setSelectImg({ name: files[0].name });
        const myFileItemReader = new FileReader();

        myFileItemReader.addEventListener(
          "load",
          () => {
            const myResult = myFileItemReader.result;
            setSelectImg((prevState: any) => ({
              ...prevState,
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult),
            }));
          },
          false
        );

        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  const handleOnCropComplete = (crop: any, pixelCrop: any) => {
    if (!canvas) return;
    const canvasRef = canvas.current;
    const { imgSrc } = selectImg;
    if (pixelCrop.height === 0 || pixelCrop.width === 0) {
      setErrors(["Select crop image"]);
      return;
    }
    setErrors([]);
    image64toCanvasRef(canvasRef, imgSrc, pixelCrop);
  };

  const handleUploadCropImg = ({ id }: { id: string }) => {
    const canvasRef = canvas.current;
    if (!canvasRef) return;
    const { imgSrcExt, name } = selectImg;

    const imageData64 = canvasRef.toDataURL("image/" + imgSrcExt);
    const myNewCroppedFile = base64StringtoFile(imageData64, name);

    let avatar = new FormData();
    avatar.append("logo", myNewCroppedFile);

    dispatch(setUserDataAsync({ file: avatar }));
  };

  const handleClearToDefault = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSelectImg(null);
    setErrors([]);
  };

  const hadleOnImageLoaded = (img: any) => {
    setSelectImg((prevState: any) => ({
      ...prevState,
      width: img.width,
      height: img.height,
    }));
  };

  const handleSelectAvatarFromItem = async (item: any) => {
    setSelectImg(() => ({
      isLick: true,
      url: item?.logo_preview,
      name: item?.name,
    }));
  };

  return {
    selectImg,
    imageMaxSize,
    acceptedFileTypes,
    errors,
    loader,
    setLoader,
    handleOnDrop,
    handleOnCropComplete,
    handleUploadCropImg,
    handleClearToDefault,
    hadleOnImageLoaded,
    handleSelectAvatarFromItem,
  };
};
