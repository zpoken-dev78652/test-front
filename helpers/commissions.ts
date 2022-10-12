export const circleTopUpWithBankCard = (sum: number) => {
  return sum === 0 ? sum : +((sum + 0.3) / 0.971).toFixed(2);
};
