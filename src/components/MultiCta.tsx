import Button from './Button';
import { site } from '@/lib/content';

/**
 * The site-wide multi-modal call-to-action: estimate + call (+ text on mobile).
 * Used on every page so the conversion path is identical everywhere.
 */
export default function MultiCta({
  align = 'left',
  estimateLabel = 'Get a free estimate',
}: {
  align?: 'left' | 'center';
  estimateLabel?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
      <Button href="/contact" className="!px-8 !py-4 !text-[16px]">{estimateLabel}</Button>
      <Button href={`tel:${site.phone}`} variant="outline" className="!px-8 !py-4 !text-[16px]">
        Call {site.phoneDisplay}
      </Button>
      {site.textReady ? (
        <Button href={`sms:${site.phone}`} variant="outline" className="!px-8 !py-4 !text-[16px] sm:hidden">
          Text us
        </Button>
      ) : null}
    </div>
  );
}
