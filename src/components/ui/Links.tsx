// Ссылки и кнопки: текстовая ссылка с линией снизу, контурная и залитая кнопка чернилами.
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { T } from "./type";

export type ButtonVariant = "solid" | "outline";

export function buttonClass(variant: ButtonVariant) {
  const base = `inline-flex h-12 items-center justify-center gap-3 border border-ink px-10 tracking-[0.04em] transition-[background-color,color,transform] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${T.ui}`;
  return variant === "solid"
    ? `${base} bg-ink text-white hover:bg-black`
    : `${base} hover:bg-ink hover:text-white disabled:hover:bg-transparent disabled:hover:text-ink`;
}

export function ButtonLink({
  variant = "outline",
  className = "",
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: ButtonVariant }) {
  return <a {...rest} className={`${buttonClass(variant)} active:scale-[0.98] ${className}`} />;
}

/** Ссылка с тонкой линией снизу — как «Написать гемологу» в шапке. */
export function TextLink({
  children,
  className = "",
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a {...rest} className={`border-b border-ink pb-0.5 transition-colors hover:border-emerald hover:text-emerald ${className}`}>
      {children}
    </a>
  );
}
