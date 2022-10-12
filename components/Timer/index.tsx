import cn from "classnames";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { HourglassIcon } from "../Icons";
import s from "./Timer.module.scss";

type TimerProps = {
  className?: string;
  lastDate: string;
  hasIcon?: boolean;
};

export const Timer: FC<TimerProps> = ({ className, lastDate, hasIcon }) => {
  const [currentTime, setCurrentTime] = useState(moment());
  const diff = moment(lastDate).utc().diff(moment(currentTime).utc());
  const timeBetween = moment.duration(diff);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    if (diff <= 0) {
      clearInterval(interval);
      setCurrentTime(moment(lastDate));
    }

    return () => clearInterval(interval);
  }, [diff, lastDate]);

  return (
    <div className={cn([className, s.timer])}>
      <div className={s.wrapperDate}>
        {hasIcon && <HourglassIcon className={s.icon} />}
        {timeBetween.days()}D : {timeBetween.hours()}H : {timeBetween.minutes()}
        M : {timeBetween.seconds()}S
      </div>
    </div>
  );
};
