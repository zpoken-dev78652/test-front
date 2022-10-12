import cn from "classnames";
import { SortObject } from "../../helpers";
import { ChevronDownIcon } from "../Icons";
import s from "./SortedHeader.module.scss";

type SortedHeaderProps = {
  text: string;
  value: string;
  className?: string;
  sortObject: SortObject;
  as?: keyof JSX.IntrinsicElements;
  handleChangeSort: (val: string) => void;
  disable: boolean;
};

export const SortedHeader: React.FC<SortedHeaderProps> = ({
  text,
  value,
  sortObject,
  handleChangeSort,
  className,
  as: Wrapper = "td",
  disable,
}) => {
  return (
    <Wrapper className={cn(s.tdHeader, s.rightAlign, className)}>
      <button
        onClick={!disable ? () => handleChangeSort(value) : undefined}
        className={cn(
          s.button,
          sortObject.sortField === value ? s.active : "",
          sortObject.sortField === value && sortObject.sortType === "asc"
            ? s.inverted
            : ""
        )}
      >
        {text} <ChevronDownIcon />
      </button>
    </Wrapper>
  );
};
