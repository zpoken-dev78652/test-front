export const priceToNumber = (price: string | number) =>
  +String(price).replace(/[^.\d]/g, "");
