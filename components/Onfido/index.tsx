import React, { FC, useEffect, useState } from "react";
import "onfido-sdk-ui/dist/style.css";
import { useRedux } from "../../hooks";
import { SdkHandle } from "onfido-sdk-ui";
import { postOnfidoCkeck, selectProfileError } from "../../redux";
import { useRouter } from "next/router";
import cn from "classnames";
import { errors } from "../../helpers";
import s from "./Onfido.module.scss";
const onfidoContainerId = "onfido-sdk-wrapper";

let OnfidoSDK: any;

type OnfidoProps = {
  onfidoKey?: string;
  onCompleteFunc?: () => void;
};

export const Onfido: FC<OnfidoProps> = ({
  onfidoKey,
  onCompleteFunc = () => {},
}) => {
  const [onfidoInstance, setOnfidoInstance] = useState<SdkHandle | null>(null);
  const [select, dispatch] = useRedux();
  const { reload } = useRouter();
  const profileError = select(selectProfileError);

  useEffect(() => {
    async function fetchMyAPI() {
      OnfidoSDK = await import("onfido-sdk-ui");
    }
    fetchMyAPI();

    return () => {
      console.log("tear down", onfidoInstance);
      onfidoInstance && onfidoInstance.tearDown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (OnfidoSDK && onfidoKey && !onfidoInstance) {
      const instance = OnfidoSDK.init({
        token: onfidoKey,
        containerId: onfidoContainerId,
        useModal: false,
        steps: ["welcome", "document", "face", "complete"],
        onComplete: () => {
          dispatch(postOnfidoCkeck());
          onCompleteFunc();
          setTimeout(() => {
            reload();
          }, 2000);
        },
        customUI: {
          fontFamilyTitle: "Staatliches",
          fontSizeTitle: "25px",
          fontWeightTitle: "400",
          fontWeightSubtitle: "400",
          colorContentTitle: "#fff",
          fontFamilySubtitle: "Montserrat",
          fontSizeSubtitle: "13px",
          colorContentSubtitle: "rgba(255,255,255, 0.5)",
          fontFamilyBody: "Montserrat",
          fontSizeBody: "13px",
          colorContentBody: "#fff",
          colorBackgroundSurfaceModal: "#111212",
          borderRadiusSurfaceModal: "0",
          colorBorderSurfaceModal: "rgba(255,255,255, 0.1)",
          colorBackgroundAlertInfo: "#D06CFF",
          colorBackgroundButtonPrimary: "#D06CFF",
          colorBackgroundButtonPrimaryHover: "#dd95ff",
          colorBackgroundButtonPrimaryActive: "#9748bc",
          colorBorderButtonPrimary: "#D06CFF",
          borderRadiusButton: "0",

          //DocTypeButton
          colorBackgroundDocTypeButton: "transparent",
          colorContentDocTypeButton: "#fff",
          colorBorderDocTypeButtonHover: "#fff",
          colorBorderDocTypeButtonActive: "#fff",
          colorBorderDocTypeButton: "rgba(255,255,255, 0.1)",

          colorBorderLinkUnderline: "#D06CFF",
          colorBackgroundLinkHover: "#dd95ff",
          colorBackgroundLinkActive: "#9748bc",

          colorContentButtonSecondaryText: "#fff",
          colorBorderButtonSecondary: "#fff",
          colorBackgroundButtonSecondaryHover: "rgba(255,255,255,.2)",
          colorBackgroundButtonSecondaryActive: "#e4b0b019",
          colorBackgroundAlertError: "#FF002E",

          colorBackgroundButtonCameraHover: "#dd95ff",
          colorBackgroundButtonCameraActive: "#9748bc",
        },
      });

      setOnfidoInstance(instance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onfidoKey, OnfidoSDK]);

  return (
    <div
      id={onfidoContainerId}
      className={cn({ [s.onfidoHide]: profileError !== errors.NO_ONFIDO_ID })}
    />
  );
};
