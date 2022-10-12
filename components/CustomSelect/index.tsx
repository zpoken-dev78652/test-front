/* eslint-disable jsx-a11y/alt-text */
import React, {
  useState,
  HTMLAttributes,
  useCallback,
  useRef,
  useEffect,
} from "react";

import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import { curencyForSelect, icons, mobileWidth } from "../../constants";
import { useMediaQuery } from "../../hooks";
import { createPortal } from "react-dom";
import Image from "next/image";
import s from "./CustomSelect.module.scss";
import { CheckIcon, ChevronDownIcon, CrossIcon } from "../Icons";

interface ICustomSelectProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  theme?: "crypto" | "default" | "phone";
  font?: "montserrat" | "staatliches";
  header?: string;
  options: any;
  value: any;
  onChange: any;
  isMultiple?: boolean;
  idTargetScroll?: string;
}

export const CustomSelect = ({
  label,
  options,
  isMultiple,
  value,
  theme = "default",
  header,
  onChange,
  className,
  font = "staatliches",
  idTargetScroll,
  ...rest
}: ICustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);

  const [positionElement, setPositionElement] = useState<any>();
  const sel = useRef<HTMLInputElement>(null);
  const opt = useRef<HTMLInputElement>(null);
  const container =
    document.getElementById("portal") ?? document.createElement("div");

  const containerScroll =
    idTargetScroll && document.getElementById(idTargetScroll);

  const handleMultiValue = (item: any) => {
    if (typeof value === "string") return;
    if (value.some((el: any) => el.value === item.value)) {
      onChange(value.filter((el: any) => el.value !== item.value));
    } else {
      onChange(value.concat(item));
    }
  };

  const handleValue = (item: any) => {
    onChange(item);
    setTimeout(() => {
      setIsOpen(false);
    }, 5);
  };

  const isChecked = (item: any) => {
    if (isMultiple) {
      if (typeof value === "string") return;
      return value.some((el: any) => el.value === item.value);
    } else {
      return item?.value === value?.value;
    }
  };

  const checkIsSelect = () => {
    return isMultiple ? value.length : value;
  };

  const clearValue = (e: any) => {
    e.stopPropagation();
    onChange(isMultiple ? [] : "");
  };

  const handleWindowEvent = () => {
    setPositionElement(sel?.current?.getBoundingClientRect());
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setPositionElement(sel?.current?.getBoundingClientRect());
  };

  useEffect(() => {
    if (containerScroll) {
      containerScroll.addEventListener("resize", handleWindowEvent);
      containerScroll.addEventListener("scroll", handleWindowEvent);
    }
    window.addEventListener("resize", handleWindowEvent);
    window.addEventListener("scroll", handleWindowEvent);
    return () => {
      if (containerScroll) {
        containerScroll.removeEventListener("resize", handleWindowEvent);
        containerScroll.removeEventListener("scroll", handleWindowEvent);
      }
      window.removeEventListener("resize", handleWindowEvent);
      window.removeEventListener("scroll", handleWindowEvent);
    };
  }, [containerScroll]);

  const positionOptions = useCallback(() => {
    if (!positionElement) return { dir: "bottom", styles: {} };

    const heightOption = opt?.current?.offsetHeight || 0;
    const pageHeight = containerScroll
      ? window.innerHeight
      : document.documentElement.scrollHeight;
    const pageScrollTop = document.documentElement.scrollTop;

    const style = {
      minWidth: positionElement.width,
      left: positionElement.left,
    };

    if (
      pageHeight >
      positionElement.top +
        pageScrollTop +
        positionElement.height +
        heightOption
    ) {
      return {
        styles: {
          ...style,
          top: positionElement.top + positionElement.height,
        },
        dir: "top",
      };
    }

    return {
      styles: {
        ...style,
        top: positionElement.top - heightOption,
      },
      dir: "bottom",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionElement]);

  const { dir, styles } = positionOptions();

  return (
    <div className={cn([className])}>
      {header && <p className={s.header}>{header}</p>}

      <div
        className={cn([s.select, s[theme], s[font]], {
          [s.open]: isOpen,
          [s.isSelect]: checkIsSelect(),
        })}
        {...rest}
        onClick={toggleOpen}
        ref={sel}
      >
        <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
          <>
            <h5
              className={cn(s.label, {
                [value?.label]: curencyForSelect.some(
                  (c) => c.value === (value?.label || label)
                ),
              })}
            >
              {theme === "default" || theme === "phone" ? (
                <>
                  {value?.flag && (
                    <div className={s.flag}>
                      <img src={value?.flag} alt={value?.name} />
                    </div>
                  )}
                  {value?.label || label}
                </>
              ) : value?.label ? (
                <>
                  {value.icon && (
                    <div className={s.icon}>
                      <Image
                        src={icons[value.icon]}
                        width="100%"
                        height="100%"
                      />
                    </div>
                  )}
                  {
                    <span className={cn([s.titleOption, value.label])}>
                      {value.label}
                    </span>
                  }
                </>
              ) : (
                label
              )}
            </h5>
            {createPortal(
              <div
                className={cn([
                  s.options,
                  s[theme],
                  {
                    [s.open]: isOpen,
                    [s.borderBottom]: dir === "bottom",
                    [s.borderTop]: dir === "top",
                  },
                ])}
                ref={opt}
                style={styles}
              >
                {options.map((el: any) => {
                  const { icon: Icon } = el;
                  return (
                    <div
                      key={
                        el.value +
                        el.label +
                        (theme === "phone" ? el?.flag : el.label)
                      }
                      className={cn([s.option, { [s.checked]: isChecked(el) }])}
                      onClick={() =>
                        isMultiple ? handleMultiValue(el) : handleValue(el)
                      }
                    >
                      <div
                        className={cn([s.checkbox], {
                          [s.multiple]: isMultiple,
                        })}
                      >
                        <CheckIcon size={7} className={s.checkIcon} />
                      </div>
                      {el?.icon && (
                        <div className={s.icon}>
                          <Image src={icons[Icon]} width="100%" height="100%" />
                        </div>
                      )}
                      {value?.flag && (
                        <div className={s.flag}>
                          <img src={el?.flag} alt={el?.name} />
                        </div>
                      )}
                      <span className={cn([s.titleOption, el.label])}>
                        {el.label}
                      </span>
                    </div>
                  );
                })}
              </div>,
              container
            )}

            {checkIsSelect() && !isOpen && theme === "default" && !isMobile ? (
              <CrossIcon
                className={s.clearIcon}
                size={isMobile ? 16 : 12}
                onClick={(e: any) => clearValue(e)}
              />
            ) : (
              <ChevronDownIcon
                size={isMobile ? 16 : 12}
                className={s.sortIcon}
                onClick={toggleOpen}
              />
            )}
          </>
        </OutsideClickHandler>
      </div>
    </div>
  );
};
