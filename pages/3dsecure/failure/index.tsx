import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { CustomButton, MainLayout } from "../../../components";
import { CartIcon } from "../../../components/Icons";
import { Routes } from "../../../constants";
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

type FailurePageProps = {
  paymentId: string;
};

const FailurePage = ({ paymentId }: FailurePageProps) => {
  return (
    <div className={s.container}>
      <p className={s.text}>Sorry!</p>
      <p className={s.smallText}>Your transaction failed.</p>
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

FailurePage.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default FailurePage;
