import { transformPrice } from "../../helpers";
import { useRedux } from "../../hooks";
import { selectUserData, storeActions } from "../../redux";
import { MysteryBox } from "../../types";
import { CustomButton } from "../CustomButton";
import { EMAIL_NOT_VERIFIED } from "../modals/ItemBoughtErrorModal/data";
import cn from "classnames";

import s from "./MysteryBoxPrice.module.scss";

type MysteryBoxPriceProps = {
  item: MysteryBox;
  type?: string;
  handleBuyClick: (item: any) => void;
};

export const MysteryBoxPrice: React.FC<MysteryBoxPriceProps> = ({
  item,
  type,
  handleBuyClick,
}) => {
  const [select, dispatch] = useRedux();
  const user = select(selectUserData);
  const { setError } = storeActions;

  const handleTryOne = () => {
    if (user.id && !user.is_email_verified)
      return dispatch(setError(EMAIL_NOT_VERIFIED));
    if (!user.id) return dispatch(setError("Unauthorized"));
    handleBuyClick(item);
  };

  return (
    <div className={type ? s.detailPrice : s.priceWrap}>
      <div className={s.price}>
        <div className={cn([s.currency, item?.default_price?.currency])}>
          {item?.default_price?.currency}
        </div>
        <div className={s.value}>
          {transformPrice(item?.default_price.value)} <span>/ Item</span>
        </div>
      </div>
      <div className={s.btns}>
        <CustomButton
          className={item?.bundle_price ? s.btn : cn(s.btn, s.fullBtn)}
          theme={item?.bundle_price ? "transparent" : "violet"}
          onClick={handleTryOne}
          value="try your luck"
        />
        {item?.bundle_price && (
          <CustomButton
            className={s.btn}
            value={
              <div className={s.btn__value}>
                <span>Item ×10</span>
                <span className={s.transition}>
                  <span className={item?.default_price?.currency}>
                    {item?.default_price?.currency}
                  </span>{" "}
                  {transformPrice(item?.bundle_price)}
                </span>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};
