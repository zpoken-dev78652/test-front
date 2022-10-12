export const arrayToUrl = (arr: string[]) => {
  return arr?.map((el) => el.replaceAll(" ", "_")).join("%25");
};
