import React, { Dispatch, SetStateAction } from "react";
import { Routes } from "../../../constants";
import { MysteryBoxItem } from "../../../types";
import { CustomButton } from "../../CustomButton";
import { LinkIcon, SubtractIcon } from "../../Icons";
import { Tooltip } from "../../Tooltip";
import { LogoCard } from "../LogoCard";
import s from "./CommonMysteryBoxCard.module.scss";

type CommonMysteryBoxCardProps = {
  userId: string;
  item: MysteryBoxItem;
  setSelectedItem: Dispatch<SetStateAction<MysteryBoxItem | null>>;
};

export const CommonMysteryBoxCard: React.FC<CommonMysteryBoxCardProps> = ({
  item,
  userId,
  setSelectedItem,
}) => {
  const handleCardClick = () => setSelectedItem(item);

  return (
    <div className={s.container} onClick={handleCardClick}>
      <LogoCard item={item} />
      <div className={s.content}>
        <p className={s.name}>
          {item.name}
          <span className={s.icon}>
            {item.ipowner && (
              <>
                <SubtractIcon
                  className={s.nameIcon}
                  size={12}
                  data-tip
                  data-for={item.name + item.id}
                  data-offset="{'top': -5, 'left': -1}"
                />
                <Tooltip id={item.name + item.id}>
                  <span className={s.ipowner}>{item.ipowner}</span>
                </Tooltip>
              </>
            )}
          </span>
        </p>
        <div className={s.wrapBtnCollection}>
          <CustomButton
            theme="link"
            icon={<LinkIcon size={12} />}
            linkTo={
              userId
                ? `${Routes.PROFILE}/${userId}/collection/${item.collection_id}`
                : "#"
            }
            value={item.collection_name}
            className={s.linkBtn}
          />
        </div>
        <p className={s.row}>In the box: {item.items_in_mystery_box}</p>
        <p className={s.row}>Drop chance: {item.drop_chance}%</p>
      </div>
    </div>
  );
};
