import React, { useMemo } from "react";
import cn from "classnames";
import s from "./CustomTabs.module.scss";

type CustomTabsProps = {
  tabs: string[];
  selectTab: string;
  name: string;
  className?: string;
  onChange?: (e: string) => void;
  disableTabs?: string[];
};

export const CustomTabs = ({
  tabs,
  selectTab,
  className,
  onChange,
  name,
  disableTabs,
}: CustomTabsProps) => {
  const [width, position] = useMemo(() => {
    const widthIndicator = 100 / tabs.length;
    const indexSelectTab = tabs.findIndex((el) => el === selectTab);
    const position = widthIndicator * indexSelectTab;
    return [widthIndicator, position];
  }, [tabs, selectTab]);

  return (
    <div className={cn([s.tabs, className])}>
      <div
        className={s.indicator}
        style={{ width: `${width}%`, left: `${position}%` }}
      />
      {tabs.map((tab, idx) => (
        <div
          className={cn([s.tab], {
            [s.isActive]: tab === selectTab,
            [s.disable]: disableTabs?.some((el) => el === tab),
          })}
          key={tab + idx}
          style={{ flex: `0 0 ${100 / tabs.length}%` }}
          onClick={
            onChange && !disableTabs?.some((el) => el === tab)
              ? () => onChange(tab)
              : undefined
          }
          id={name + tab}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};
