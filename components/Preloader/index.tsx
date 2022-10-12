import React, { useEffect, useState } from "react";
import s from "./Preloader.module.scss";
import { useMediaQuery } from "../../hooks";
import { mobileWidth } from "../../constants";
import { Modal } from "../../components";

interface IPreloaderProps {
  duration?: number;
}

// Duration value in seconds
export const Preloader = ({ duration = 10 }: IPreloaderProps) => {
  const [count, setCount] = useState(0);
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);

  useEffect(() => {
    let start = 0;
    const end = 100;
    const incrementTime = (duration / end) * 1000;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => {
      clearInterval(timer);
    };
  }, [duration]);

  return (
    <div className={s.container}>
      <Modal>
        <div className={s.content}>
          <div className={s.icon}>
            <img
              src={isMobile ? "/img/loader.png" : "/img/gifs/Loader.gif"}
              alt="loader"
            />
          </div>
          {!isMobile && (
            <div>
              <h3 className={s.title}>Your item is being minted</h3>
              <p className={s.desc}>
                This may take up to several minutes. Please do NOT close this
                tab.
              </p>

              <div className={s.loader}>
                <p className={s.number}>{count}%</p>
                <div className={s.line}>
                  <span style={{ width: `${count}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
