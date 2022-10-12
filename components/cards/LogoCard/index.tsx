import React, { useState } from "react";
import cn from "classnames";
import s from "./style.module.scss";
import ReactPlayer from "react-player/lazy";
import { checkFormat } from "../../../helpers";
import Image from "next/image";
import { Timer } from "../..";
import { FireIcon } from "../../Icons";

interface ILogoCardProps {
  item: any;
  className?: string;
  disabled?: boolean;
  free?: boolean;
  onLoadPlay?: boolean;
  hideTime?: boolean;
  hideBurn?: boolean;
}

export const LogoCard = ({
  item,
  className,
  disabled,
  free,
  onLoadPlay,
  hideTime,
  hideBurn,
  ...rest
}: ILogoCardProps) => {
  const [pauseVideo, setPauseVideo] = useState(true);
  const [preview, setPreview] = useState(!!item?.logo_preview);
  const checkVideo = checkFormat(item?.logo, "mp4");

  const hangleRightClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    setPauseVideo((prevState) => !prevState);
  };

  const handleMouseLeave = () => {
    setPauseVideo(true);
    if (preview) setPreview(false);
  };
  const handleMouseEnter = () => {
    setPauseVideo(false);
    if (preview) setPreview(false);
  };

  return (
    <div
      className={cn([s.logo, className], { [s.isDisables]: disabled })}
      {...rest}
    >
      {checkVideo && !preview ? (
        <ReactPlayer
          playing={!pauseVideo}
          loop
          url={item.logo}
          className={s.video}
          width="100%"
          height="100%"
          muted={disabled || !!process?.env?.NEXT_PUBLIC_ENABLE_SOUND_VIDEO}
          playsinline
          onClick={handleClick}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          onContextMenu={hangleRightClick}
        />
      ) : (
        <>
          {(item?.logo_preview || item?.logo) && (
            <Image
              src={preview ? item?.logo_preview : item?.logo}
              alt={item?.name || "logo card"}
              layout="fill"
              onMouseEnter={handleMouseEnter}
            />
          )}
        </>
      )}

      {free ||
        (item?.is_redeem_only && (
          <div className={s.free}>
            {item?.is_redeem_only ? "Claim code only" : "limited offer"}
          </div>
        ))}
      {item?.finish_datetime && !hideTime && (
        <div className={s.timer}>
          <Timer lastDate={item?.finish_datetime} hasIcon />
        </div>
      )}
      {item?.burned_nft_num && !hideBurn && (
        <div className={s.burn}>
          <FireIcon />
          <span>{item.burned_nft_num} items burned</span>
        </div>
      )}
    </div>
  );
};
