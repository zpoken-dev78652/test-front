import { useEffect, useState } from "react";
import { arrayToUrl } from "../helpers";
import { ComponentState } from "../reducers";

type UseStringifyFiltersProps = {
  data: ComponentState;
};

export const useStringifyFilters = ({
  data,
}: UseStringifyFiltersProps): { url: string } => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const { completeness, franchises, prices, sort, themes, types, currency } =
      data;
    const completenessBody = completeness
      ? completeness?.length === 2 || completeness?.length === 0
        ? ""
        : completeness?.includes("In Progress")
        ? "False"
        : "True"
      : "";
    const completenessUrl = completeness
      ? `completeness=${completenessBody}`
      : "";
    const themesUrl = themes?.length ? `theme=${arrayToUrl(themes)}` : "";
    const typesUrl = types?.length ? `type=${arrayToUrl(types)}` : "";
    const currencyUrl = currency?.length ? `currency=${currency}` : "";
    const franchisesUrl = franchises?.length
      ? `store=${franchises.join("%25")}`
      : "";

    const priceUrl =
      prices?.fromPrice && prices?.toPrice
        ? `price=${prices?.fromPrice}-${prices?.toPrice}`
        : !prices?.fromPrice && !prices?.toPrice
        ? ""
        : !prices?.fromPrice && prices?.toPrice
        ? `price=-${prices?.toPrice}`
        : `price=${prices?.fromPrice}-`;

    const sortUrl =
      sort?.sortField && sort?.sortDirection
        ? `${sort?.sortField}=${sort?.sortDirection}`
        : "";

    const url = [
      completenessUrl,
      priceUrl,
      sortUrl,
      themesUrl,
      currencyUrl,
      typesUrl,
      franchisesUrl,
    ]
      .filter((i) => i)
      .join("&");

    setUrl(`${url ? "&" : ""}${url}`);
  }, [data]);

  return { url };
};
