import React, { useEffect } from "react";
import {
  CustomButton,
  ItemBoughtErrorModal,
  MainLayout,
} from "../../../components";
import { CartIcon } from "../../../components/Icons";
import { errors, Routes } from "../../../constants";
import { useRedux } from "../../../hooks";
import {
  getBalanceAsync,
  getCircleTransactionStatus,
  profileActions,
  selectProfileError,
} from "../../../redux";
import s from "../3dsecure.module.scss";

export const getServerSideProps = async (context: any) => {
  const { query } = context;
  if (!query?.paymentId) {
    return {
      redirect: {
        destination: Routes.STORE,
        permanent: false,
      },
    };
  }
  return {
    props: { paymentId: query?.paymentId },
  };
};

type SuccessPageProps = {
  paymentId: string;
};

const SuccessPage = ({ paymentId }: SuccessPageProps) => {
  const { setError } = profileActions;
  const [select, dispatch] = useRedux();
  const profileError = select(selectProfileError);

  const handleCloseError = () => dispatch(setError(""));

  useEffect(() => {
    dispatch(getCircleTransactionStatus({ transaction_id: paymentId }));
  }, [dispatch, paymentId]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(getBalanceAsync());
    }, 2000);

    const interval = setInterval(() => {
      dispatch(getBalanceAsync());
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <>
      <div className={s.container}>
        <p className={s.text}>Congratulations!</p>
        <p className={s.smallText}>Your transaction was successful</p>
        <div className={s.buttonWrap}>
          <CustomButton
            value="back to store"
            icon={<CartIcon />}
            theme="violet"
            linkTo="/store"
          />
        </div>
      </div>
      {profileError === errors.PENDING_TOPUP && (
        <ItemBoughtErrorModal
          error={profileError}
          onCancelClick={handleCloseError}
        />
      )}
    </>
  );
};

SuccessPage.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default SuccessPage;
