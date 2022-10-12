import React, { useState, useEffect } from "react";
import { OnlyNumberInputs } from "../..";
import { rangePriceBtn } from "../../../constants";
import { IconRectangle } from "../../../public/icons";
import s from "./PriceRangeForm.module.scss";

type PriceRangeFormPropsType = {
  prices: {
    fromPrice: number;
    toPrice: number;
  };
  changeFromPrice: any;
  changeToPrice: any;
};

export const PriceRangeForm: React.FC<PriceRangeFormPropsType> = ({
  prices,
  changeFromPrice,
  changeToPrice,
}) => {
  const [selectedBtn, setSelectedBtn] = useState<any>(null);

  useEffect(() => {
    if (!selectedBtn) return;
    const selected = rangePriceBtn.find((i) => i.id === selectedBtn);
    changeFromPrice(selected && selected.min ? selected.min : "");
    changeToPrice(selected && selected.max ? selected.max : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBtn]);

  useEffect(() => {
    if (!prices.fromPrice && !prices.toPrice) setSelectedBtn(null);
  }, [prices]);

  const onChangeFromPrice = (e: any) => {
    const value = Number(e.target.value);

    if (isNaN(value)) return;

    changeFromPrice(value);
    setSelectedBtn(null);
  };

  const onChangeToPrice = (e: any) => {
    const value = Number(e.target.value);

    if (isNaN(value)) return;

    changeToPrice(value);
    setSelectedBtn(null);
  };

  return (
    <div className={s.priceCountList}>
      <div className={s.inputs}>
        <div className={s.input}>
          <OnlyNumberInputs
            label="From"
            value={prices.fromPrice}
            onChange={onChangeFromPrice}
          />
        </div>
        <div className={s.rectangle}>
          <IconRectangle />
        </div>
        <div className={s.input}>
          <OnlyNumberInputs
            label="To"
            value={prices.toPrice}
            onChange={onChangeToPrice}
          />
        </div>
      </div>
      {rangePriceBtn.map((i) => (
        <div
          className={`${s.priceCount} ${
            selectedBtn === i.id ? s.selected : ""
          }`}
          onClick={() => setSelectedBtn(i.id)}
          key={i.id}
        >
          {i.max && i.min && `$${i.min} to $${i.max}`}
          {!i.min && i.max && `Under $${i.max}`}
          {i.min && !i.max && `$${i.min} and over`}
        </div>
      ))}
    </div>
  );
};
