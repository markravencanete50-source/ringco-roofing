import Link from 'next/link';
import { clsx } from './clsx';

type Props = {
  href?: string;
  variant?: 'primary' | 'outline';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
};

const base =
  'inline-flex items-center justify-center gap-2 font-display font-bold rounded-full whitespace-nowrap transition-[transform,background,box-shadow,border-color,color] duration-300 ease-[cubic-bezier(.16,.8,.24,1)] px-7 py-3.5 text-[15px]';
const styles = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hi hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_oklch(0.68_0.15_55/0.6)]',
  outline: 'border-[1.5px] border-[oklch(0.5_0.02_70)] text-[oklch(0.96_0.01_80)] hover:border-accent-hi hover:text-accent-hi',
};

export default function Button({ href, variant = 'primary', className, children, onClick, type = 'button' }: Props) {
  const cn = clsx(base, styles[variant], className);
  if (href) return <Link href={href} className={cn}>{children}</Link>;
  return <button type={type} onClick={onClick} className={cn}>{children}</button>;
}
