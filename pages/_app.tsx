import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import firebase from "../firebase/initFirebase";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../redux";
import "semantic-ui-css/semantic.min.css";
import "./index.scss";
import "../components/DragAndDrop/custom-image-crop.css";
import { useWindowSize } from "../hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Meta } from "../container";
import { TechnicalWorks } from "../components";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "");

firebase();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  const [_, height] = useWindowSize();

  useEffect(() => {
    document.documentElement.style.setProperty("--fullHeight", `${height}px`);
  }, [height]);

  useEffect(() => {
    document.documentElement.style.setProperty("--fullHeight", `${height}px`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Provider store={store}>
      <Elements stripe={promise}>
        <Meta />
        <ToastContainer className="customToastify" />
        {getLayout(<Component {...pageProps} />)}

        {/* REMOVE WITH TechnicalWorks */}
        {/* <TechnicalWorks /> */}
      </Elements>
    </Provider>
  );
}

export default MyApp;
