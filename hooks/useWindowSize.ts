import { useEffect, useLayoutEffect, useState } from "react";

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  const Effect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  Effect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    setTimeout(() => {
      updateSize();
    }, 10);

    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return size;
}
