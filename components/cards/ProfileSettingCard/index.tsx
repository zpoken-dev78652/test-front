import cn from "classnames";
import React, { FC, HTMLAttributes } from "react";
import { CustomButton } from "../..";
import { ArrowRightIcon } from "../../Icons";
import { IconProps } from "../../Icons/type";
import s from "./ProfileSettingCard.module.scss";

type ProfileSettingCardProps = HTMLAttributes<HTMLDivElement> & {
  icon: FC<IconProps>;
  title: string;
  desc?: string;
  btnValue?: string;
  verified: boolean;
  disableBtn?: boolean;
  btnFunc?: () => void;
};

export const ProfileSettingCard: FC<ProfileSettingCardProps> = ({
  icon: Icon,
  title,
  desc,
  btnValue,
  verified,
  className,
  disableBtn,
  btnFunc = () => {},
}) => {
  return (
    <div
      className={cn([s.profileSetting, className], {
        [s.isVerified]: verified,
      })}
    >
      <div className={s.titleWrap}>
        <Icon
          className={s.icon}
          fill={verified ? "#8FFF00" : "#fff"}
          size={12}
        />
        <h4 className={s.title}>{title}</h4>
      </div>
      {(desc || btnValue) && (
        <div className={s.bottom}>
          {desc && <p className={s.desc}>{desc}</p>}
          {btnValue && (
            <CustomButton
              className={s.btn}
              value={btnValue}
              theme={!verified ? "violet" : "link"}
              icon={!verified && <ArrowRightIcon />}
              onClick={btnFunc}
              disabled={disableBtn}
            />
          )}
        </div>
      )}
    </div>
  );
};
