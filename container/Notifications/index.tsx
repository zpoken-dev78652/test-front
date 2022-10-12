/* eslint-disable jsx-a11y/alt-text */
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import reactStringReplace from "react-string-replace";
import { BeatLoader } from "react-spinners";
import InfiniteScroll from "react-infinite-scroll-component";
import { NotificationBox } from "../../public/icons";
import { useNotification, useOnScreen } from "../../hooks";
import { GenericObject, NotificatioType } from "../../types";
import { CustomButton } from "../../components";
import s from "./Notifications.module.scss";

export type DivRefType = React.MutableRefObject<GenericObject<HTMLDivElement>>;

type NotificationProps = {
  item: NotificatioType;
  value: DivRefType;
  changeReadNotification: (val: string) => void;
};

export const Notification: React.FC<NotificationProps> = ({
  item,
  value,
  changeReadNotification,
}) => {
  const isVisible = useOnScreen(value, item.id);

  useEffect(() => {
    if (!isVisible || item.is_read) return;

    changeReadNotification(item.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, item]);

  const changeInputRef = (id: string) => (v: HTMLDivElement) => {
    if (!value) return;
    value.current[id] = v;
  };

  const getTimeAgo = (deliveryTime: string) => {
    const deliveryDate = moment(deliveryTime);
    const timestamp = moment(
      deliveryDate,
      "ddd MMM DD YYYY HH:mm:ss GMT"
    ).fromNow();
    return timestamp;
  };

  const replaceText = (text: string) => {
    const replaceBr = reactStringReplace(text, "\\n", (_, index) => (
      <br key={`${item.id}_br_${index}`} />
    ));

    const replaceBalance = reactStringReplace(
      replaceBr,
      "{balance}",
      (_, index) => (
        <span key={`${item.id}_balance_${index}`} className="white">
          {item.data.balance}
        </span>
      )
    );

    const replaceName = reactStringReplace(
      replaceBalance,
      "{item_name}",
      () => <span key={`${item.id}_name`}>{item.data.item_name}</span>
    );

    const replaceValue = reactStringReplace(
      replaceName,
      "{value}",
      (_, index) => (
        <span key={`${item.id}_value_${index}`} className="white">
          {typeof item.data.price?.value === "number"
            ? item.data.price?.value || 0
            : "error type value"}
        </span>
      )
    );

    return reactStringReplace(replaceValue, "{currency}", () => (
      <span
        key={`${
          item.id
        }_currency_${Math.random()}_${Math.random()}_${Math.random()}`}
        className={item.data.price?.currency}
      >
        {item.data.price?.currency || ""}
      </span>
    ));
  };

  return (
    <div className={s.item} ref={changeInputRef(item.id)}>
      <div className={s.left}>
        <div className={s.checkRead}>
          <div className={!item.is_read ? s.noRead : s.read}></div>
        </div>
        <div className={s.avatar}>
          <Image src={item.favicon} width="100%" height="100%" />
        </div>
        <div className={s.desc}>
          <h3>{replaceText(item.title)}</h3>
          <h4 className={s.gray}>{replaceText(item.body)}</h4>
          <h4 className={s.time}>{getTimeAgo(item.delivered_at)}</h4>
        </div>
      </div>
      <div className={s.image}>
        {item.data.logo && (
          <Image src={item.data.logo} width="80px" height="80px" />
        )}
      </div>
    </div>
  );
};

export const Notifications: React.FC = () => {
  const [isOpenDropdown, setOpenDropdown] = useState<boolean>(false);

  const ref: DivRefType = useRef({});

  const {
    items,
    hasMore,
    unreadNotifiaction,
    handleNext,
    handleMarkAsRead,
    changeReadNotification,
  } = useNotification(isOpenDropdown, 3);

  const handleOpenDropdown = (val: boolean) => () => setOpenDropdown(val);

  return (
    <div
      className={s.dropdown}
      onMouseEnter={handleOpenDropdown(true)}
      onMouseLeave={handleOpenDropdown(false)}
    >
      <div className={s.dropbtn}>
        {unreadNotifiaction > 0 && (
          <div className={s.count}>{unreadNotifiaction}</div>
        )}
        <NotificationBox width="12px" height="12px" />
      </div>
      <div className={s.dropdownContent}>
        <div className={s.header}>
          <span>Notifications</span>
          <CustomButton
            theme="link"
            value="Mark all as read"
            onClick={handleMarkAsRead}
            disabled={!Boolean(unreadNotifiaction)}
          />
        </div>
        <InfiniteScroll
          scrollableTarget="scrollableHistoryContent"
          dataLength={items.length}
          next={handleNext}
          hasMore={hasMore}
          height={300}
          loader={
            <div className={s.loader}>
              <BeatLoader size={10} color="#fff" />
            </div>
          }
        >
          <div className={s.notificationContent}>
            {items.map((i) => (
              <Notification
                item={i}
                key={i.id}
                value={ref}
                changeReadNotification={changeReadNotification}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};
