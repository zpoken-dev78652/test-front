import { regex } from "../constants";

export const transformToId = (arrString: string[]) =>
  arrString
    .map((string) => string.replace(regex.numberWithLetter, "_"))
    .join("_");
