/* eslint-disable @next/next/no-img-element */
import cl from "classnames";
import React from "react";
import Image from "next/image";
import { Logo } from "../../components";
import InstagramColorIcon from "../../public/icons/socials/instagram_color.png";
import s from "./Footer.module.scss";
import {
  FacebookColorIcon,
  FacebookFooterIcon,
  InstagramIcon,
  MediumColorIcon,
  MediumIcon,
  TelegramColorIcon,
  TelegramIcon,
  TiktokColorIcon,
  TiktokIcon,
  TwitterColorIcon,
  TwitterIcon,
  YoutubeColorIcon,
  YoutubeIcon,
} from "../../components/Icons";
import moment from "moment";

export const Footer: React.FC = () => {
  const footerSocial = [
    {
      icon: <InstagramIcon size={20} />,
      iconHover: (
        <Image
          src={InstagramColorIcon}
          width="100%"
          height="100%"
          alt="instagram"
        />
      ),
      link: "https://www.instagram.com/chronicle.nft/",
      name: "instagram",
    },
    {
      icon: <FacebookFooterIcon size={20} />,
      iconHover: <FacebookColorIcon size={32} />,
      link: "https://www.facebook.com/chronicle.xnl",
      name: "facebook",
    },
    {
      icon: <TiktokIcon />,
      iconHover: <TiktokColorIcon size={32} />,
      link: "https://www.tiktok.com/@chroniclexnl",
      name: "tiktok",
    },
    {
      icon: <YoutubeIcon />,
      iconHover: <YoutubeColorIcon size={32} />,
      link: "https://www.youtube.com/channel/UC8vNl3Stg081xEoU3H-AtXw",
      name: "youtube",
    },
    {
      icon: <TwitterIcon />,
      iconHover: <TwitterColorIcon size={32} />,
      link: "https://twitter.com/ChronicleXNL",
      name: "twitter",
    },
    {
      icon: <TelegramIcon />,
      iconHover: <TelegramColorIcon size={32} />,
      link: "https://t.me/chroniclecommunity",
      name: "telegram",
    },
    {
      icon: <MediumIcon />,
      iconHover: <MediumColorIcon size={32} />,
      link: "https://medium.com/@chronicle.xnl",
      name: "medium",
    },
  ];

  return (
    <div className={s.footer}>
      <div className={s.container}>
        <div className={s.leftSide}>
          <div className={s.logo}>
            <Logo />
          </div>
          <div className={s.email}>contact@chronicle.io</div>
          <div className={s.descriptions}>
            Chronicle © {moment().format("YYYY")}. All rights reserved.
          </div>
          <div className={s.descriptions}>
            Chronicle is committed to delivering eco-friendly NFTs 🌿
          </div>
          <div className={s.links}>
            <a
              href="https://www.chronicle.io/terms"
              className={s.link}
              target="_blank"
              rel="noreferrer"
            >
              Terms of use
            </a>
            <a
              href="https://www.chronicle.io/privacy"
              className={s.link}
              target="_blank"
              rel="noreferrer"
            >
              Privacy policy
            </a>
          </div>
        </div>
        <div className={s.rightSide}>
          <div className={s.icons}>
            {footerSocial.map((social) => (
              <a
                href={social.link}
                key={social.name}
                className={cl([s.link, s[social.name]])}
                target="_blank"
                rel="noreferrer"
              >
                <div className={s.icon}>{social.icon}</div>
                <div className={s.iconHover}>{social.iconHover}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
