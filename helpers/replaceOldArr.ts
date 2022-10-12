export const replaceOldArr = ({
  oldArr,
  newArr,
  key,
}: {
  oldArr: { [key: string]: any }[];
  newArr: { [key: string]: any }[];
  key: string;
}) =>
  newArr.reduce(
    (result: any, item: any) => {
      if (result.some((i: any) => i[key] === item[key])) {
        const indexUpdatedElemnt = result.findIndex(
          (el: any) => el[key] === item[key]
        );
        return [
          ...result.slice(0, indexUpdatedElemnt),
          item,
          ...result.slice(indexUpdatedElemnt + 1),
        ];
      } else result.push(item);
      return result;
    },
    [...oldArr]
  );
