import { Routes } from "../constants";

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: Routes.HOME,
      permanent: false,
    },
  };
};

const Index = () => <div />;

export default Index;
