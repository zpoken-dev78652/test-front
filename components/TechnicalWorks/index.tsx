import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { CustomButton } from "..";
import { IconBigWarning } from "../../public/icons";
import { RefreshIcon } from "../Icons";
import s from "./TechnicalWorks.module.scss";
import { Logo } from "../../components";
import { Routes } from "../../constants";
import { useRedux } from "../../hooks";
import { getLoginImgAsync, selectLoginImg } from "../../redux";

export const TechnicalWorks = () => {
  const [select, dispatch] = useRedux();
  const { reload } = useRouter();
  const { asPath, replace } = useRouter();

  const loginBaner = select(selectLoginImg);

  useEffect(() => {
    replace(Routes.HOME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  useEffect(() => {
    dispatch(getLoginImgAsync());
  }, [dispatch]);

  return (
    <div className={s.technicalWorks}>
      <div className={s.logoWrap}>
        <Logo />
      </div>

      <div
        className={s.banner}
        style={{ backgroundImage: `url(${loginBaner})` }}
      ></div>
      <div>
        <div className={s.content}>
          <IconBigWarning className={s.icon} />
          <h3 className={s.title}>WEBSITE MAINTENANCE</h3>
          <p className={s.desc}>
            We&apos;re currently upgrading Chronicle with new and exciting
            features to add to your collectible experience. This process
            won&apos;t take long, please check back with us soon. Thank you for
            your patience.
          </p>
          <CustomButton
            value="Refresh"
            theme="transparent"
            icon={<RefreshIcon />}
            className={s.btn}
            onClick={reload}
          />
        </div>
      </div>
    </div>
  );
};
