import Link from 'next/link';
import { forwardRef } from 'react';
import { clsx } from './clsx';

type Props = {
  href?: string;
  variant?: 'primary' | 'outline';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  /** Passed through so wrappers like <Magnetic> can drive transform/handlers. */
  style?: React.CSSProperties;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerLeave?: () => void;
};

const base =
  'inline-flex items-center justify-center gap-2 font-display font-bold rounded-full whitespace-nowrap transition-[transform,background,box-shadow,border-color,color] duration-micro ease-out px-7 py-3.5 text-[15px]';
const styles = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hi hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_oklch(0.62_0.155_40/0.55)]',
  outline: 'border-[1.5px] border-[oklch(0.5_0.02_70)] text-[oklch(0.96_0.01_80)] hover:border-accent-hi hover:text-accent-hi',
};

const Button = forwardRef<HTMLAnchorElement & HTMLButtonElement, Props>(function Button(
  { href, variant = 'primary', className, children, onClick, type = 'button', style, onPointerMove, onPointerLeave },
  ref,
) {
  const cn = clsx(base, styles[variant], className);
  const shared = { className: cn, style, onPointerMove, onPointerLeave };
  if (href) {
    return (
      <Link ref={ref} href={href} {...shared}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref} type={type} onClick={onClick} {...shared}>
      {children}
    </button>
  );
});

export default Button;
