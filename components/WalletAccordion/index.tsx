import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PriceType } from "../../types";
import { ChevronDownIcon, UsdcIcon, XnlIcon } from "../Icons";
import { SelectWolletType } from "../../redux/profile/profile.types";

import s from "./WalletAccordion.module.scss";
import { transformPrice } from "../../helpers";
import { useMediaQuery } from "../../hooks";
import { mobileWidth } from "../../constants";
import cn from "classnames";

type WalletAccordionProps = {
  id: SelectWolletType;
  expanded: SelectWolletType;
  setExpanded: (e: SelectWolletType) => void;
  isLast: boolean;
  wallet: PriceType & {
    title: string;
    subTitle: string;
  };
};

export const WalletAccordion: FC<WalletAccordionProps> = ({
  id,
  expanded,
  setExpanded,
  children,
  wallet,
  isLast,
}) => {
  const isOpen = id === expanded;

  const Icon = wallet.currency === "USDC" ? UsdcIcon : XnlIcon;
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);

  return (
    <>
      <div
        className={cn([s.accordionWrapper], {
          [s.lastClose]: isLast && !isOpen,
        })}
      >
        <div className={s.content}>
          <Icon size={isMobile ? 30 : 50} className={s.icon} />
          <div className={s.info}>
            <h3 className={s.title}>{wallet?.title}</h3>
            <h5 className={s.subTitle}>{wallet?.subTitle}</h5>
          </div>
        </div>
        <div className={s.content}>
          <div className={s.balance}>
            <p className={`${s.currency} ${wallet?.currency}`}>
              {wallet?.currency}
            </p>
            <p className={s.value}>{transformPrice(wallet?.value)}</p>
          </div>

          <button
            className={s.btn}
            onClick={() => setExpanded(isOpen ? "" : id)}
            id={id}
          >
            <motion.div
              initial={false}
              animate={{
                transform: `rotate(${isOpen ? 180 : 0}deg)`,
              }}
            >
              <ChevronDownIcon />
            </motion.div>
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: `auto`, overflow: "auto" },
              collapsed: { height: 0, overflow: "hidden" },
              close: { height: 0, overflow: "hidden" },
            }}
            transition={{ duration: 0.15 }}
            className={cn([s.wrapperCollaps], {
              [s.lastClose]: !isLast && isOpen,
            })}
          >
            <div className={s.collapsContent}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
