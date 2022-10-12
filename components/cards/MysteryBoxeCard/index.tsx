import React, { FC, useEffect, useRef, useState } from "react";
import cn from "classnames";
import { CustomButton } from "../../CustomButton";
import { InfoCircleIcon } from "../../Icons";
import { MysteryBox } from "../../../types";
import { nFormatter } from "../../../helpers";
import { useMediaQuery } from "../../../hooks";
import { mobileWidth } from "../../../constants";
import { useRouter } from "next/router";
import s from "./MysteryBoxeCard.module.scss";
import { MysteryBoxPrice } from "../..";

type MysteryBoxeCardProps = {
  data: MysteryBox;
  handleBuyClick: (item: any) => void;
};

export const MysteryBoxeCard: FC<MysteryBoxeCardProps> = ({
  data,
  handleBuyClick,
}) => {
  const list = useRef<HTMLDivElement>(null);
  const { push } = useRouter();
  const [position, setPosition] = useState(0);
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);
  const widthBlock = isMobile ? 69 : 100;
  const countElement = data?.item_logo_previews.slice(
    0,
    isMobile ? 5 : 10
  ).length;

  const handleWindowEvent = () => {
    const wrapperWidth = list?.current?.offsetWidth || 0;

    setPosition(
      (wrapperWidth - widthBlock) / (countElement - 1) <= widthBlock
        ? (wrapperWidth - widthBlock) / (countElement - 1)
        : widthBlock
    );
  };

  useEffect(() => {
    handleWindowEvent();
    window.addEventListener("resize", handleWindowEvent);
    return () => {
      window.removeEventListener("resize", handleWindowEvent);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeatil = () => push(`/store/mysterybox/${data.id}`);

  return (
    <div
      className={s.mysteryBoxe}
      style={{ backgroundImage: `url(${data?.logo})` }}
    >
      <div className={s.rarity}>{data?.mystery_box_type} Mystery Box</div>
      <div className={s.contentWrap}>
        <div className={s.content}>
          <h3 className={s.title}>{data?.name}</h3>
          <p className={s.desc}>{data?.description}</p>
        </div>
        <MysteryBoxPrice item={data} handleBuyClick={handleBuyClick} />
      </div>
      <div className={s.itemsWrapper}>
        <div className={s.items} ref={list}>
          {data?.item_logo_previews?.slice(0, 10).map((el, idx) => (
            <div
              key={idx}
              style={{
                left: `${idx * position}px`,
                backgroundImage: `url(${el})`,
              }}
              className={cn([s.item, s[`item-${idx + 1}`]])}
            ></div>
          ))}
        </div>
        <div className={s.info}>
          <h6 className={s.count}>{nFormatter({ num: data?.items_count })}</h6>
          <p className={s.desc}>Available Items</p>
          {!isMobile && (
            <CustomButton
              theme="transparent"
              value="details"
              icon={<InfoCircleIcon />}
              onClick={handleDeatil}
            />
          )}
        </div>
      </div>

      {isMobile && (
        <CustomButton
          className={s.infoBtnMobile}
          theme="transparent"
          value="details"
          icon={<InfoCircleIcon />}
          onClick={handleDeatil}
        />
      )}
    </div>
  );
};
