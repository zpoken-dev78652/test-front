import { useEffect } from "react";
import {
  checkNotificationUpdate,
  getNotifications,
  profileActions,
  readNotification,
  selectNotifications,
  selectUnreadNotification,
} from "../redux";
import { NotificatioType } from "../types";
import { useInfinitePagination } from "./useInfinitePagination";
import { useRedux } from "./useRedux";

export const useNotification = (isOpenDropdown: boolean, count: number) => {
  const [select, dispatch] = useRedux();

  const { resetWallet } = profileActions;

  const unreadNotifiaction: number = select(selectUnreadNotification);

  const { items, handleNext, hasMore } = useInfinitePagination<
    NotificatioType[]
  >({
    query: getNotifications,
    selectData: selectNotifications,
    resetFunc: resetWallet,
    perPage: count,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkNotificationUpdate(isOpenDropdown));
    }, 60000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenDropdown]);

  const changeReadNotification = (id: string) => {
    const item = items.find((i) => i.id === id);

    if (item?.is_read) return;

    setTimeout(() => {
      dispatch(readNotification(id));
    }, 5000);
  };
  const handleMarkAsRead = () => dispatch(readNotification());
  return {
    items,
    hasMore,
    unreadNotifiaction,
    handleNext,
    handleMarkAsRead,
    changeReadNotification,
  };
};
