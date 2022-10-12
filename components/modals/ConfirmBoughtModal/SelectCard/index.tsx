import React, { useState, HTMLAttributes, useRef, useEffect } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import s from "./SelectCard.module.scss";
import cl from "classnames";
import Options from "./options";
import {
  IconDiscoverWithBg,
  IconMasterCardWithBg,
  IconVisaWithBg,
} from "../../../../public/icons";
import { ChevronUpIcon } from "../../../Icons";

interface ISelectCardProps extends HTMLAttributes<HTMLDivElement> {
  label: any;
  options: any;
  value: any;
  onChange: any;
}

const createIcon = (iconName: string) => {
  switch (iconName) {
    case "visa":
      return <IconVisaWithBg />;
    case "discover":
      return <IconDiscoverWithBg />;
    default:
      return <IconMasterCardWithBg />;
  }
};

export const SelectCard = ({
  label,
  options,
  value,
  onChange,
  className,
  ...rest
}: ISelectCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [positionElement, setPositionElement] = useState<any>();
  const sel = useRef<HTMLInputElement>(null);

  const handleValue = (item: any) => {
    onChange(item);
    setTimeout(() => {
      setIsOpen(false);
    }, 10);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setPositionElement(sel?.current?.getBoundingClientRect());
  };

  const handleWindowEvent = () => {
    setPositionElement(sel?.current?.getBoundingClientRect());
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowEvent);
    window.addEventListener("scroll", handleWindowEvent);
    return () => {
      window.removeEventListener("resize", handleWindowEvent);
      window.removeEventListener("scroll", handleWindowEvent);
    };
  }, []);

  return (
    <div
      className={cl(
        [s.select, className],
        { [s.open]: isOpen },
        { [s.isSelect]: value }
      )}
      {...rest}
      onClick={() => handleOpen()}
      ref={sel}
    >
      <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
        <h5 className={s.label}>
          {label?.icon && (
            <>
              {createIcon(label?.icon)} {label?.label}{" "}
            </>
          )}
        </h5>
        {
          <Options
            className={cl([s.options], { [s.open]: isOpen })}
            options={options}
            handleValue={handleValue}
            value={value}
            position={positionElement}
          />
        }

        <ChevronUpIcon
          className={s.sortIcon}
          onClick={() => setIsOpen(!isOpen)}
        />
      </OutsideClickHandler>
    </div>
  );
};
