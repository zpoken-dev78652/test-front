import React, { useMemo } from "react";
import cn from "classnames";
import { transformPrice } from "../../../helpers";
import { CustomButton, NotFoundItem, Tooltip } from "../..";
import Avatar from "../../../public/img/big_avatar.png";
import { BeatLoader, ClipLoader } from "react-spinners";
import { useMediaQuery } from "../../../hooks";
import { mobileWidth, Routes } from "../../../constants";
import { LogoCard } from "../LogoCard";
import Image from "next/image";
import s from "./FeaturesCardList.module.scss";
import { LinkIcon, SubtractIcon } from "../../Icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { IconNotFoundItemsIcon } from "../../../public/icons";
import { useRouter } from "next/router";

type CardsContainerPropsType = {
  data: any;
  userId?: string;
  type?: "four-filtering" | "four" | "five";
  withoutLink?: boolean;
  typeAdd?: string;
  handleSelectItem?: (id: string) => void;
  handleDeleteItem?: (id: string) => void;
  handleSelectAvatar?: (url: string) => void;
  handleChangeItem?: (id: string) => void;
  handleOnCardClick?: (id: string, type?: string) => void;
  loading?: boolean;
  hideSellerName?: boolean;
  clickById?: boolean;
  handleNext: () => void;
  hasMore: boolean;
  noItemsTitle?: string;
  noItemsDesc?: string;
  scrollableTarget?: React.ReactNode;
};

type FeaturesCardPropsType = {
  handleSelectItem?: (id: string) => void;
  handleDeleteItem?: (id: string) => void;
  handleSelectAvatar?: (url: string) => void;
  handleChangeItem?: (id: string) => void;
  handleOnCardClick?: (id: string, type?: string) => void;
  item: any;
  withoutLink?: boolean;
  userId?: string;
  loading?: boolean;
  hideSellerName?: boolean;
  clickById?: boolean;
};

const FeaturesCard: React.FC<FeaturesCardPropsType> = ({
  userId,
  handleSelectItem,
  item,
  handleOnCardClick,
  handleDeleteItem,
  handleChangeItem,
  handleSelectAvatar,
  withoutLink,
  hideSellerName,
  clickById,
}) => {
  const { push } = useRouter();
  const FREE = item?.default_price?.value === 0 && !item?.is_sold_out;
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);
  const isMyItem = item?.seller_id === userId;

  const handleClick = () => {
    handleOnCardClick &&
      handleOnCardClick(
        item.nft_id && !clickById
          ? item.nft_id
          : item.purpose === "auction"
          ? item?.auction_id
          : item.id,
        item.purpose === "auction" ? "auctions" : ""
      );
  };

  const btnValue = () => {
    if (item?.is_redeem_only) return "redeem";
    if (item.purpose === "mystery_box") return "mystery box";
    if (item.purpose === "auction") return "go to auction";
    if (item.purpose === "not_set") return "Not available";
    if (isMyItem) return "manage";
    return "buy";
  };

  const btnClick = () => {
    console.log(item);
    if (item?.is_redeem_only) return push(Routes.REDEEM_CODE);
    console.log("1");
    if (item.purpose === "mystery_box" || item.purpose === "not_set") return;
    if (isMyItem) return handleClick();
    !!handleSelectItem && handleSelectItem(item);
  };

  return (
    <div
      className={cn([s.card], {
        [s.disabled]: item.nft_index === 0,
        [s.soldOut]: item.is_sold_out,
      })}
      onClick={handleClick}
    >
      {item?.seller_name && !item?.release_datetime && !hideSellerName && (
        <div className={s.sellerName}>
          <div className={s.avatar}>
            <Image
              src={item?.seller_logo || Avatar}
              alt={item.seller_name}
              width="100%"
              height="100%"
            />
          </div>
          <span className="ellipsis">{item.seller_name}</span>
        </div>
      )}
      <div className={s.logoWrapper}>
        <LogoCard
          item={item}
          disabled={item.nft_index === 0 || item.is_sold_out}
          free={FREE}
        />
        {item.nft_counter && item.nft_counter > 1 ? (
          <div className={s.count}>×{item.nft_counter}</div>
        ) : (
          <></>
        )}
      </div>
      <div className={s.content}>
        {isMobile && item.ipowner && !item?.item_name && (
          <div className={s.ipownerMobile}>
            <SubtractIcon className={s.nameIcon} size={12} />
            <span className={s.ipowner}>{item.ipowner}</span>
          </div>
        )}
        <div className={cn([s.header, s.lineText])}>
          <span>{item.name || item?.item_name}</span>
          {item.ipowner && !isMobile && !item?.item_name && (
            <>
              <SubtractIcon
                className={s.nameIcon}
                size={12}
                data-tip
                data-for={item?.name + item?.id}
                data-offset="{'top': -5, 'left': -1}"
              />
              <Tooltip id={item?.name + item?.id}>
                <span className={s.ipowner}>{item.ipowner}</span>
              </Tooltip>
            </>
          )}
        </div>
        {!withoutLink && (
          <div className={s.wrapBtnCollection}>
            <CustomButton
              theme="link"
              onClick={(e: any) => e.stopPropagation()}
              icon={<LinkIcon size={12} />}
              linkTo={
                userId
                  ? `${Routes.PROFILE}/${
                      !userId ? item.seller_id : userId
                    }/collection/${item.collection_id}`
                  : "#"
              }
              value={item.collection_name}
              className={s.linkBtn}
            />
          </div>
        )}
        {item.nft_index !== 0 ? (
          <div className={s.descriptions}>
            #{item.num_in_collection} — {item.nft_index ? "" : "Сirculation"}{" "}
            {item.nft_index
              ? `${item.nft_index.toLocaleString("ru-RU")} / `
              : ""}
            {item?.total_nft_num?.toLocaleString("ru-RU")}
          </div>
        ) : (
          <div className={s.descriptions}>#{item.num_in_collection}</div>
        )}
      </div>
      {(handleSelectItem || handleDeleteItem || handleChangeItem) && (
        <div className={s.contentBottom}>
          <div className={s.price}>
            {item?.default_price?.value === 0 ? (
              <span className={s.free}>FREE</span>
            ) : (
              <div className={cn(s.priceWrap, item.default_price.currency)}>
                {item.default_price && item.default_price.currency}{" "}
                <span>
                  {(item.default_price || item?.auction_sold_price) &&
                    transformPrice(
                      item?.auction_sold_price?.value ||
                        item.default_price.value
                    )}
                </span>
              </div>
            )}
          </div>
          {handleSelectItem &&
            (item.is_sold_out ? (
              <div className={s.soldOutBtn}>sold out</div>
            ) : (
              <CustomButton
                theme={
                  FREE
                    ? "turquoise"
                    : item.purpose === "not_set"
                    ? "transparent"
                    : "violet"
                }
                value={FREE ? "GET" : btnValue()}
                onClick={(e: any) => {
                  e.stopPropagation();

                  btnClick();
                }}
                className={s.btn}
                {...(!item?.is_redeem_only && {
                  linkTo: (() => {
                    switch (item.purpose) {
                      case "mystery_box":
                        return Routes.STORE;
                      case "auction":
                        return `${Routes.AUCTIONS}/${item?.auction_id}`;
                      default:
                        return undefined;
                    }
                  })(),
                })}
              />
            ))}
        </div>
      )}

      {handleSelectAvatar && (
        <div className={s.selectAvaBtn}>
          <CustomButton
            onClick={() => handleSelectAvatar(item)}
            icon={<LinkIcon size={12} />}
            value="Select"
          />
        </div>
      )}
    </div>
  );
};

export const FeaturesCardList: React.FC<CardsContainerPropsType> = ({
  data,
  type,
  handleOnCardClick,
  loading,
  handleNext,
  hasMore,
  noItemsTitle,
  noItemsDesc,
  scrollableTarget,
  ...rest
}) => {
  return (
    <div>
      {loading && !data.length && (
        <div className={s.spiner}>
          <ClipLoader color={"#fff"} size={60} />
        </div>
      )}

      <InfiniteScroll
        dataLength={data.length}
        next={handleNext}
        className={cn(s.children, s.wrapCards)}
        hasMore={hasMore}
        scrollableTarget={scrollableTarget || null}
        loader={
          data.length ? (
            <div className={s.loader}>
              <BeatLoader size={10} color="#fff" />
            </div>
          ) : null
        }
      >
        {data.map((item: any, index: number) => (
          <FeaturesCard
            item={item}
            key={index}
            handleOnCardClick={
              item.nft_index === 0 ? undefined : handleOnCardClick
            }
            {...rest}
          />
        ))}
      </InfiniteScroll>

      {!loading && !data?.length && (
        <NotFoundItem
          icon={<IconNotFoundItemsIcon />}
          header={noItemsTitle ?? "You have no item yet"}
          text={noItemsDesc ?? "At the moment there is no item"}
        />
      )}
    </div>
  );
};
