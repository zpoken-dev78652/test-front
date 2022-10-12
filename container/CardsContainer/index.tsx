import React, { useState, useEffect } from "react";
import cn from "classnames";
import { ReactNode } from "react";
import {
  category,
  curencyForSelect,
  itemTypes,
  mobileWidth,
  rangePrice,
  sortsInFilterinPage,
} from "../../constants";
import { useMediaQuery } from "../../hooks";

import s from "./CardsContainer.module.scss";
import { CustomSelect, CustomTabs } from "../../components";
import { IconRrefresh } from "../../public/icons";
import {
  CHANGE_CURRENCY,
  CHANGE_FROM_PRICE,
  CHANGE_SORT_FIELD,
  CHANGE_THEMES,
  CHANGE_TO_PRICE,
  CHANGE_TYPES,
} from "../../reducers";
import { ChevronUpIcon } from "../../components/Icons";
import { SelectOption } from "../../types";

type CardsContainerPropsType = {
  header: string | ReactNode;
  isOpenSort?: boolean;
  noHeader?: boolean;
  hideCurrency?: boolean;
  dispatchComponent?: any;
  tabs?: string[];
  selectTab?: string;
  onChange?: (e: string) => void;
  onBtnClick?: () => void;
  handleSortClick?: () => void;
};

export const CardsContainer: React.FC<CardsContainerPropsType> = ({
  header,
  children,
  dispatchComponent,
  noHeader,
  selectTab,
  onChange,
  tabs,
  hideCurrency,
}) => {
  const [priceRangeValue, setPriceRangeValue] = useState<any>("");
  const [sortBy, setSortBy] = useState("");
  const [currency, setCurrency] = useState<SelectOption>();
  const [categoryValue, setCategoryValue] = useState([]);
  const [itemTypesValue, setItemTypesValue] = useState([]);
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);
  const [isOpenFilter, setisOpenFilter] = useState<boolean>();

  const isSelectFilter =
    !!priceRangeValue ||
    !!sortBy ||
    !!categoryValue.length ||
    !!currency ||
    !!itemTypesValue.length;

  const handleItemTypesValue = (item: any) => {
    setItemTypesValue(item);
    const data = item.map((el: any) => el.value);
    dispatchComponent({
      type: CHANGE_TYPES,
      data: data && data.length ? data : null,
    });
  };

  const handlePriceRangeValue = (item: any) => {
    setPriceRangeValue(item);
    dispatchComponent({ type: CHANGE_FROM_PRICE, data: item.min || 0 });
    dispatchComponent({ type: CHANGE_TO_PRICE, data: item.max });
  };

  const handleSortBy = (item: any) => {
    setSortBy(item);
    dispatchComponent({ type: CHANGE_SORT_FIELD, data: item });
  };

  const handleChangeCurrency = (item: SelectOption) => {
    setCurrency(item);
    dispatchComponent({ type: CHANGE_CURRENCY, data: item.value });
  };

  const handleCategoryValue = (item: any) => {
    setCategoryValue(item);
    const data = item.map((el: any) => el.value);
    dispatchComponent({
      type: CHANGE_THEMES,
      data: data && data.length ? data : null,
    });
  };

  useEffect(() => {
    setisOpenFilter(!isMobile);
  }, [isMobile]);

  const handleRefresh = () => {
    setPriceRangeValue("");
    setSortBy("");
    setCategoryValue([]);
    setItemTypesValue([]);
    setisOpenFilter(false);
  };

  return (
    <div className={s.container}>
      {!noHeader && (
        <div className={s.header}>
          <h3>{header}</h3>
          <div className={s.wrapperFilters}>
            <div className={s.tabs}>
              {tabs && selectTab && (
                <CustomTabs
                  tabs={tabs}
                  selectTab={selectTab}
                  onChange={onChange}
                  name="cardsContainer"
                />
              )}
            </div>
            <div className={s.filterTogles}>
              {isSelectFilter && (
                <div className={s.filterBtn} onClick={handleRefresh}>
                  Reset <IconRrefresh />
                </div>
              )}
              <div
                className={s.filterBtn}
                onClick={() => setisOpenFilter((prevState) => !prevState)}
              >
                Filtering
                <ChevronUpIcon
                  className={cn([s.filterIcon], { [s.isOpen]: isOpenFilter })}
                />
              </div>
            </div>
            {isOpenFilter && (
              <div className={s.buttons}>
                {!hideCurrency && (
                  <CustomSelect
                    label="currency"
                    value={currency}
                    onChange={handleChangeCurrency}
                    options={curencyForSelect}
                    className={s.btn}
                  />
                )}
                <CustomSelect
                  label="price range"
                  options={rangePrice}
                  value={priceRangeValue}
                  onChange={handlePriceRangeValue}
                  className={s.btn}
                />
                <CustomSelect
                  label="Sort by"
                  options={sortsInFilterinPage}
                  value={sortBy}
                  onChange={handleSortBy}
                  className={s.btn}
                />
                <CustomSelect
                  label="Category"
                  options={category}
                  isMultiple
                  value={categoryValue}
                  onChange={handleCategoryValue}
                  className={s.btn}
                />
                <CustomSelect
                  label="item type"
                  options={itemTypes}
                  isMultiple
                  value={itemTypesValue}
                  onChange={handleItemTypesValue}
                  className={s.btn}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
