import React from "react";
import { useEffect } from "react";
import { CardForm, PoweredBy, ThemeForm } from "../../..";
import { useRedux } from "../../../../hooks";
import { postStripeSecretAsync, selectitemForBuy } from "../../../../redux";
import s from "./NewCard.module.scss";

type NewCardProps = {
  handleChangeCardField?: (e: any) => void;
  item: any;
  type: string;
};

export const NewCard: React.FC<NewCardProps> = ({
  item,
  type,
  handleChangeCardField,
}) => {
  const [_, dispatch] = useRedux();

  useEffect(() => {
    if (item?.client_secret) return;
    dispatch(
      postStripeSecretAsync({
        id: item?.id,
        default_price: {
          value: item.default_price.value,
          currency: "USDC",
        },
        type,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={s.cardContainer}>
      <div className={s.desc}>
        <PoweredBy value="stripe" />
      </div>
      <CardForm handleChangeCardField={handleChangeCardField} />
      <div className={s.checkbox}>
        <ThemeForm formName="saveCard" data={["Save for future payments"]} />
      </div>
    </div>
  );
};
