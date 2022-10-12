import React from "react";
import { CustomButton } from "../../components";
import { CartIcon } from "../Icons";

import s from "./ComingSoon.module.scss";

export const ComingSoon = (): JSX.Element => {
  return (
    <div className={s.container}>
      <h3 className={s.title}>Coming soon</h3>
      <p className={s.text}>
        We&apos;re still working on this section of Chronicle. Stay tuned.
      </p>
      <div className={s.buttonWrap}>
        <CustomButton
          value="back to New drops"
          theme="violet"
          icon={<CartIcon />}
          linkTo="/store"
        />
      </div>
    </div>
  );
};
