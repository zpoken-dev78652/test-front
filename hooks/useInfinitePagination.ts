import { useCallback, useEffect, useState } from "react";
import { useRedux } from ".";
import { globalActions, selectCountInfinityPage } from "../redux";
import { usePrevious } from "./usePrevious";

type useInfinitePaginationProps = {
  query: any;
  selectData: any;
  resetFunc: any;
  perPage?: number;
  id?: string;
  url?: string;
  type?: string;
  isFetch?: boolean;
  queryProps?: { [k: string]: string | number };
};

type useInfinitePaginationReturn<T> = {
  items: T;
  page: number;
  hasMore: boolean;
  handleNext: () => void;
  handleRefetch: () => void;
};

export const useInfinitePagination = <T = []>({
  query,
  selectData,
  resetFunc,
  perPage = 32,
  url = "",
  isFetch = true,
  id,
  type,
  queryProps,
}: useInfinitePaginationProps): useInfinitePaginationReturn<T> => {
  const [hasMore, setHasMore] = useState(true);

  const [select, dispatch] = useRedux();
  const page = select(selectCountInfinityPage);

  const oldState = usePrevious({ url, page, isFetch, type });

  const data: any = select(selectData);

  const { setCountInfinityPage } = globalActions;

  const fetchObjects = useCallback(
    () =>
      dispatch(
        query({
          id,
          url,
          page: oldState?.url !== url ? 1 : page,
          perPage,
          ...queryProps,
          ...(type && { type }),
        })
      ),
    [dispatch, query, id, url, oldState?.url, page, perPage, type]
  );

  useEffect(() => {
    dispatch(setCountInfinityPage(1));
    setHasMore(true);
    dispatch(resetFunc());
    console.log(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, resetFunc, url]);

  useEffect(() => {
    if (!isFetch) return;
    if (
      oldState?.url === url &&
      page === 1 &&
      oldState?.isFetch === isFetch &&
      oldState.type === type
    )
      return;

    if (oldState?.url !== url || oldState.type !== type) {
      dispatch(setCountInfinityPage(1));
      dispatch(resetFunc());
    }

    fetchObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, page, perPage, query, url, type, isFetch]);

  const handleNext = () => {
    dispatch(setCountInfinityPage(page + 1));
    // setPage((prevState) => prevState + 1);
  };

  useEffect(() => {
    if (data?.total_results >= 0) {
      setHasMore(data?.num_pages > data?.page_number);
    }
  }, [data, data?.total_results]);

  useEffect(() => {
    if (!isFetch) {
      dispatch(setCountInfinityPage(1));
      setHasMore(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetch]);

  const handleRefetch = () => {
    fetchObjects();
  };

  return {
    items: data?.data,
    page,
    hasMore,
    handleNext,
    handleRefetch,
  };
};
