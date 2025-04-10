import React from "react";
import Link from "next/link";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  href,
  onClick,
  className,
}) => {
  const baseStyles = "px-6 py-3 rounded-lg text-base font-semibold transition-all";
  const variants = {
    primary: "bg-pink-600 hover:bg-pink-700 text-white",
    outline: "border border-white text-white hover:bg-white hover:text-black",
  };

  const combined = clsx(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link href={href}>
        <a className={combined}>{children}</a>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combined}>
      {children}
    </button>
  );
};
