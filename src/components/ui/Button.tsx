import Link from "next/link";
import { clsx } from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline";
  onClick?: () => void;
}

export function Button({ children, href, variant = "primary", onClick }: ButtonProps) {
  const baseClasses =
    "px-6 py-3 rounded-lg text-base font-semibold transition duration-200";
  const variantClasses = {
    primary: "bg-pink-600 hover:bg-pink-700 text-white",
    outline: "border border-white text-white hover:bg-white hover:text-black",
  };

  const classes = clsx(baseClasses, variantClasses[variant]);


  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
