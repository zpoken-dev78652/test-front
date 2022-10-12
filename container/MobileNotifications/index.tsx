import React, { useRef } from "react";
import cn from "classnames";
import { NotificationBox } from "../../public/icons";
import { useNotification } from "../../hooks";
import { DivRefType, Notification } from "../Notifications";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { CustomButton } from "../../components";
import s from "./MobileNotifications.module.scss";

type MobileNotificationsPropsType = {
  type: "" | "NOTIFICATION" | "MENU";
  isOpenDropdown: boolean;
  toogleMenu: (type: "" | "NOTIFICATION" | "MENU") => () => void;
};

export const MobileNotifications: React.FC<MobileNotificationsPropsType> = ({
  type,
  isOpenDropdown,
  toogleMenu,
}) => {
  const ref: DivRefType = useRef({});

  const {
    items,
    hasMore,
    unreadNotifiaction,
    handleNext,
    handleMarkAsRead,
    changeReadNotification,
  } = useNotification(isOpenDropdown, 6);

  return (
    <div className={cn([s.mobileMenu], { [s.open]: type })}>
      {!type && (
        <div
          onClick={toogleMenu("NOTIFICATION")}
          className={s.notificationrWrap}
        >
          <div className={s.dropbtn}>
            {unreadNotifiaction ? (
              <div className={s.count}>{unreadNotifiaction}</div>
            ) : (
              <></>
            )}
            <NotificationBox width="14px" height="16px" />
          </div>
        </div>
      )}
      {type === "NOTIFICATION" && (
        <div className={s.contentWrap}>
          <div className={s.top}>Notifications</div>
          <div className={s.readAll}>
            <CustomButton
              theme="link"
              value="Mark all as read"
              onClick={handleMarkAsRead}
            />
          </div>
          <InfiniteScroll
            scrollableTarget="scrollableHistoryContent"
            dataLength={items.length}
            next={handleNext}
            hasMore={hasMore}
            height={800}
            loader={
              <div className={s.loader}>
                <BeatLoader size={10} color="#fff" />
              </div>
            }
          >
            {items.map((i) => (
              <Notification
                item={i}
                key={i.id}
                value={ref}
                changeReadNotification={changeReadNotification}
              />
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};
