import React from "react";
import { IconLogo, IconLogoBig } from "../../public/icons";
import { Routes } from "../../constants";
import s from "./Logo.module.scss";
import Link from "next/link";

type LogoType = {
  min?: boolean;
};

export const Logo: React.FC<LogoType> = ({ min = true }) => {
  return (
    <Link href={Routes.HOME}>
      <a className={min ? s.min : s.container}>
        {min ? <IconLogo width={150} /> : <IconLogoBig />}
      </a>
    </Link>
  );
};
