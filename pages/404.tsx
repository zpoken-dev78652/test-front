import { CustomButton, MainLayout } from "../components";
import { CartIcon } from "../components/Icons";

import s from "./NotFoundPage.module.scss";

const NotFoundPage = (): JSX.Element => {
  return (
    <div className={s.container}>
      <h1 className={s.number}>404</h1>
      <p className={s.text}>Nothing found...</p>
      <p className={s.smallText}>
        ...maybe the page you&apos;re looking for has been removed, or it never
        existed...
      </p>
      <div className={s.buttonWrap}>
        <CustomButton
          value="back to store"
          icon={<CartIcon />}
          theme="violet"
          linkTo="/store"
        />
      </div>
    </div>
  );
};

NotFoundPage.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default NotFoundPage;
