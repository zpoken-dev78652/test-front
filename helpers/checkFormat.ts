export const checkFormat = (el: any, format?: string) => {
  return format ? el?.split('.')?.pop() === format : el?.split('.')?.pop();
};
