import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';

/** Orminal ERP wordmark: supplied logo art plus typeset name. */
export function Logo({
  locale,
  variant = 'default',
  className = '',
}: {
  locale: Locale;
  variant?: 'default' | 'inverse';
  className?: string;
}) {
  const inverse = variant === 'inverse';
  return (
    <Link
      href={`/${locale}`}
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="Orminal ERP"
    >
      <span className="relative block h-10 w-10 shrink-0 transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/logo.png"
          alt=""
          fill
          sizes="40px"
          priority
          className="object-contain"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-extrabold tracking-tight ${
            inverse ? 'text-white' : 'text-[color:var(--ink)]'
          }`}
        >
          Orminal <span className="text-sky2">ERP</span>
        </span>
        <span
          className={`mt-0.5 text-[10px] font-medium ${inverse ? 'text-white/70' : 'muted'}`}
        >
          {locale === 'ar' ? 'إدارة أعمال متكاملة' : 'Integrated business suite'}
        </span>
      </span>
    </Link>
  );
}
