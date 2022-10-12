import React from "react";
import s from "./Banner.module.scss";
import { useMediaQuery } from "../../hooks";
import { mobileWidth } from "../../constants";

type BannerPropsType = {
  data?: any;
};

export const Banner: React.FC<BannerPropsType> = ({ data }) => {
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);

  const urlImg = isMobile
    ? data?.collection_banner?.mobile
    : data?.collection_banner?.desktop;

  return (
    <div
      className={s.banner}
      style={{
        backgroundImage: `url(${urlImg})`,
      }}
    >
      {data && (
        <div className={s.counts}>
          <div className={s.count}>
            <div className={s.digits}>
              {data.collection_counter.current_num_unique}/
              {data.collection_counter.full_num}
            </div>
            <div className={s.name}>progress</div>
          </div>
          <div className={s.count}>
            <div className={s.digits}>
              {data.collection_counter.current_num}
            </div>
            <div className={s.name}>Items total</div>
          </div>
          <div className={s.count}>
            <div className={s.digits}>
              {data.collection_counter.current_num_unique}
            </div>
            <div className={s.name}>unique items</div>
          </div>
        </div>
      )}
    </div>
  );
};
