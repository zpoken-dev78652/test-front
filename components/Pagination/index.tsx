import React, { useEffect, useState } from "react";
import cn from "classnames";
import { DOTS, usePagination } from "../../hooks";
import { SelectOption } from "../../types";
import { ChevronUpIcon } from "../Icons";
import s from "./Pagination.module.scss";

export type PaginationProps = {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  itemPerPage: SelectOption;
  changeStep: (i: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  totalElements,
  totalPages,
  currentPage,
  itemPerPage,
  changeStep,
}) => {
  const paginationRange = usePagination(
    totalElements,
    itemPerPage.value,
    1,
    currentPage
  );
  const [range, setRange] = useState<(number | string)[]>([]);

  useEffect(() => {
    setRange(paginationRange);
  }, [paginationRange]);

  const handlePrev = () => {
    if (currentPage === 1) return;
    changeStep(1);
  };

  const handleNext = () => {
    if (currentPage === totalPages) return;
    changeStep(totalPages);
  };

  const handleIndex = (i: number) => changeStep(i);

  return (
    <div className={s.pagination}>
      <div className={s.page_buttons}>
        <button onClick={handlePrev} className={s.prevBtn}>
          <ChevronUpIcon />
        </button>
        {range.map((i: number | string, index: number) => {
          if (i === DOTS) {
            return (
              <div key={index} className={s.dots}>
                {i}
              </div>
            );
          }
          return (
            <button
              key={`${i}-page`}
              className={cn(
                s.value,
                Number(i) === currentPage ? s.selected : undefined
              )}
              onClick={() => handleIndex(Number(i))}
            >
              {i}
            </button>
          );
        })}
        <button onClick={handleNext} className={s.netxBtn}>
          <ChevronUpIcon />
        </button>
      </div>
    </div>
  );
};
