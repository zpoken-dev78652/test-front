import React, { useEffect, useState } from "react";
import cn from "classnames";
import s from "./AdvancedFiltering.module.scss";
import { Franchise } from "../../types";
import { useMediaQuery, useRedux } from "../../hooks";
import { mobileWidth, sortsInFilterinPage } from "../../constants";
import {
  CHANGE_COMPLETENNES,
  CHANGE_FRANCHISES,
  CHANGE_FROM_PRICE,
  CHANGE_SORT_FIELD,
  CHANGE_THEMES,
  CHANGE_TO_PRICE,
  CHANGE_TYPES,
  RESET_FIELDS,
} from "../../reducers";
import { reset } from "redux-form";
import { IconRrefresh } from "../../public/icons";
import { PriceRangeForm, RadioList, ThemeForm } from "..";
import { ChevronUpIcon } from "../Icons";

type AdvancedFilteringPropsType = {
  data: any;
  dispatchComponent: any;
  type: string;
  completeness?: string[];
  selectedTab?: string;
  itemTypes?: string[];
  themes?: string[];
  franchises?: Franchise[];
};

export const AdvancedFiltering: React.FC<AdvancedFilteringPropsType> = ({
  data,
  type,
  itemTypes,
  dispatchComponent,
  franchises,
  themes,
  completeness,
  selectedTab,
}) => {
  const [_, dispatch] = useRedux();
  const [isOpenSorts, setIsOpenSorts] = useState<boolean>(false);
  const [isOpenTheme, setIsOpenTheme] = useState<boolean>(false);
  const [isOpenFilter, setisOpenFilter] = useState<boolean>();
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);

  const changeSort = (data: any) =>
    dispatchComponent({ type: CHANGE_SORT_FIELD, data });
  const changeFromPrice = (data: number) =>
    dispatchComponent({ type: CHANGE_FROM_PRICE, data });
  const changeToPrice = (data: number) =>
    dispatchComponent({ type: CHANGE_TO_PRICE, data });

  const handleRefresh = () => {
    dispatch(reset("themes"));
    dispatch(reset("types"));
    dispatchComponent({ type: RESET_FIELDS });
  };

  const handleAddThemes = (obj: any) => {
    const data = Object.entries(obj)
      .map((i) => (!i[1] ? "" : i[0]))
      .filter((i) => i);
    dispatchComponent({
      type: CHANGE_THEMES,
      data: data && data.length ? data : null,
    });
  };
  const handleAddTypes = (i: string) => {
    const newData = data.types || [];
    const arrTypes = newData.includes(i)
      ? newData.filter((el: any) => el !== i)
      : [...newData, i];
    dispatchComponent({ type: CHANGE_TYPES, data: arrTypes });
  };

  useEffect(() => {
    setisOpenFilter(!isMobile);
  }, [isMobile]);

  const handleAddFranchises = (i: string) =>
    dispatchComponent({ type: CHANGE_FRANCHISES, data: i });

  const handleAddCompleteness = (i: string) =>
    dispatchComponent({ type: CHANGE_COMPLETENNES, data: i });

  return (
    <div className={`${s.filters} ${s[type]}`}>
      <div className={s.headers}>
        <div className={s.header}>
          {selectedTab && isMobile ? `All ${selectedTab}` : "Filters"}
        </div>
        <div className={s.filterTogles}>
          <div className={s.filterBtn} onClick={handleRefresh}>
            Reset <IconRrefresh />
          </div>
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
      </div>
      {isOpenFilter && (
        <div>
          {type === "store" && (
            <div className={s.sorts}>
              <div className={s.sortsHeader}>
                <div className={s.title}>Price range</div>
              </div>
              <PriceRangeForm
                changeFromPrice={changeFromPrice}
                changeToPrice={changeToPrice}
                prices={data.prices}
              />
            </div>
          )}
          {type === "store" && (
            <div className={s.sorts}>
              <div
                className={s.sortsHeader}
                onClick={() => setIsOpenSorts((state) => !state)}
              >
                <div className={s.title}>Sort by</div>
                <div className={`${s.icon} ${!isOpenSorts ? s.rotate : ""}`}>
                  <ChevronUpIcon />
                </div>
              </div>
              {isOpenSorts && (
                <div className={s.sortsList}>
                  <div className={s.list}>
                    <RadioList
                      value={data.sort}
                      setValue={changeSort}
                      lists={sortsInFilterinPage}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {themes && (
            <div className={s.theme}>
              <div
                className={s.sortsHeader}
                onClick={() => setIsOpenTheme((state) => !state)}
              >
                <div className={s.title}>Category</div>
                <div className={`${s.icon} ${!isOpenTheme ? s.rotate : ""}`}>
                  <ChevronUpIcon />
                </div>
              </div>
              {isOpenTheme && (
                <div className={s.themeList}>
                  <ThemeForm
                    formName="themes"
                    onChange={handleAddThemes}
                    data={themes}
                  />
                </div>
              )}
            </div>
          )}
          {franchises && (
            <div className={s.theme}>
              <div className={s.sortsHeader}>
                <div className={s.title}>Franchises</div>
              </div>
              <div className={s.franchises}>
                {franchises.map((i: Franchise) => (
                  <div
                    key={i.id}
                    className={`${s.franchise} ${
                      data.franchises && data.franchises.includes(i.id)
                        ? s.selected
                        : ""
                    }`}
                    onClick={() => handleAddFranchises(i.id)}
                  >
                    {i.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          {itemTypes && (
            <div className={s.theme}>
              <div className={s.sortsHeader}>
                <div className={s.title}>items type</div>
              </div>
              <div className={s.themeList}>
                <ThemeForm
                  formName="types"
                  handleOnClick={handleAddTypes}
                  data={itemTypes}
                />
              </div>
            </div>
          )}

          {completeness && (
            <div className={s.theme}>
              <div className={s.sortsHeader}>
                <div className={s.title}>Completeness</div>
              </div>
              <div className={s.themeList}>
                <ThemeForm
                  formName="types"
                  data={completeness}
                  handleOnClick={handleAddCompleteness}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
