// Convert a Base64-encoded string to a File object
export const base64StringtoFile = (base64String: any, filename: any) => {
  let arr = base64String.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Download a Base64-encoded file

export const downloadBase64File = (base64Data: any, filename: any) => {
  let element = document.createElement("a");
  element.setAttribute("href", base64Data);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// Extract an Base64 Image's File Extension
export function extractImageFileExtensionFromBase64(base64Data: any) {
  return base64Data.substring(
    "data:image/".length,
    base64Data.indexOf(";base64")
  );
}

const culcPosition = (width: number, procent: number) =>
  (width * procent) / 100;

// Base64 Image to Canvas with a Crop
export const image64toCanvasRef = (
  canvasRef: any,
  image64: any,
  pixelCrop: any
) => {
  const canvas = canvasRef; // document.createElement('canvas');

  const ctx = canvas.getContext("2d");
  const image = new Image();

  image.src = image64;
  image.onload = function () {
    const nWidth = culcPosition(image.width, pixelCrop.width);
    const nHeight = culcPosition(image.height, pixelCrop.height);
    canvas.width = nWidth;
    canvas.height = nHeight;
    ctx.drawImage(
      image,
      culcPosition(image.width, pixelCrop.x),
      culcPosition(image.height, pixelCrop.y),
      nWidth,
      nHeight,
      0,
      0,
      nWidth,
      nHeight
    );
  };
};
