import React, { ButtonHTMLAttributes, useEffect, useState } from "react";
import cn from "classnames";
import Link from "next/link";
import { ButtonThemes } from "../../types";
import s from "./Button.module.scss";
import { BeatLoader } from "react-spinners";

interface TypeButton
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  theme?: ButtonThemes;
  icon?: React.ReactNode;
  iconLeft?: React.ReactNode;
  style?: React.CSSProperties;
  linkTo?: string;
  href?: string;
  target?: string;
  loading?: boolean;
  value?: string | React.ReactNode | Element;
}

const Button = ({ linkTo, disabled, onClick, href, ...rest }: any) => {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    setComponent(
      linkTo ? (
        <Link href={linkTo} onClick={onClick} {...rest}>
          <a
            className={rest.className}
            onClick={(e: any) => e.stopPropagation()}
          >
            {rest.children}
          </a>
        </Link>
      ) : href ? (
        <a href={href} {...rest} />
      ) : (
        <button onClick={onClick} disabled={disabled} {...rest} type="button" />
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, onClick, linkTo, rest.children]);

  return Component;
};

export const CustomButton = ({
  value,
  disabled,
  className,
  icon,
  style,
  iconLeft,
  theme = "violet",
  linkTo,
  loading,
  onClick,
  ...rest
}: TypeButton) => {
  return (
    <Button
      {...rest}
      className={cn([s.btn, s[theme], className], {
        [s.withIcon]: (icon || iconLeft) && value && !loading,
        [s.disable]: disabled || loading,
      })}
      style={style}
      linkTo={linkTo}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <BeatLoader size={8} color="#fff" />
      ) : (
        <>
          {iconLeft}
          {value && <span>{value}</span>}
          {icon}
        </>
      )}
    </Button>
  );
};
