import { site } from '@/lib/content';
import { clsx } from './clsx';

type Props = {
  /** Show the number as text. Default true. Otherwise renders children. */
  label?: string;
  className?: string;
  children?: React.ReactNode;
  withDot?: boolean;
};

/**
 * The ONE canonical phone link. Every "call us" affordance on the site routes
 * through here, so the number lives in exactly one place (site.phone) and the
 * historical phone-mismatch bug cannot recur.
 */
export default function Tel({ label, className, children, withDot }: Props) {
  return (
    <a href={`tel:${site.phone}`} className={clsx('inline-flex items-center gap-2', className)}>
      {withDot ? <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulseRing" /> : null}
      {children ?? label ?? site.phoneDisplay}
    </a>
  );
}

/** SMS link to the same line, for multi-modal CTAs. */
export function TextLink({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <a href={`sms:${site.phone}`} className={className}>
      {children ?? `Text ${site.phoneDisplay}`}
    </a>
  );
}
