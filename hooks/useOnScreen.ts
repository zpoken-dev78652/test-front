import { useEffect, useState } from "react";
import { GenericObject } from "../types";

export const useOnScreen = (
  ref: React.MutableRefObject<GenericObject<HTMLDivElement>>,
  id: string
) => {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = new IntersectionObserver(([entry]) =>
    setIntersecting(entry.isIntersecting)
  );

  useEffect(() => {
    if (!ref) return;
    observer.observe(ref.current[id]);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return isIntersecting;
};
