import React, { useEffect, useState } from "react";

type CounterProps = {
  duration?: number;
  startCount?: number;
  endCount?: number;
  setCount?: (e: number) => void;
};

export const Counter = ({
  duration = 10,
  startCount = 0,
  endCount = 100,
  setCount,
}: CounterProps) => {
  const [count, setCounts] = useState(startCount);

  useEffect(() => {
    let start = startCount;
    const end = endCount;
    const incrementTime = (duration / end) * 1000;
    const timer = setInterval(() => {
      start += 1;
      setCounts(start);
      setCount && setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return <span>{count}</span>;
};
