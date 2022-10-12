export const numberWithSpaces = (x: string | number) => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const transformPrice = (price: number | string | undefined): string => {
  if (price == 0) return "0.00";
  if (!price) return `${price}`;

  if (Number.isInteger(price)) {
    return numberWithSpaces(`${price}.00`);
  } else {
    return price?.toString().split(".").pop()?.length === 1
      ? numberWithSpaces(`${price}0`)
      : numberWithSpaces((+price).toFixed(2));
  }
};
