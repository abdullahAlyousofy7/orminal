'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { locales, swapLocalePath, type Locale } from '@/i18n/config';

const labels: Record<Locale, string> = { ar: 'العربية', en: 'English' };
const flags: Record<Locale, string> = { ar: '🇾🇪', en: '🇬🇧' };

export function LocaleSwitch({
  locale,
  variant = 'default',
}: {
  locale: Locale;
  variant?: 'default' | 'inverse';
}) {
  const router = useRouter();
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function choose(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`;
    startTransition(() => router.push(swapLocalePath(pathname, next)));
  }

  const base =
    variant === 'inverse'
      ? 'border-white/20 text-white hover:bg-white/10'
      : 'hover:border-brand-400 hover:text-brand-600';

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={pending}
        className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition duration-200 ${base}`}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{labels[locale]}</span>
        <span className="sm:hidden">{flags[locale]}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute end-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border shadow-card"
          style={{ background: 'var(--surface)' }}
        >
          {locales.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === locale}
                onClick={() => choose(code)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-sm hover:bg-brand-50 dark:hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden>{flags[code]}</span>
                  {labels[code]}
                </span>
                {code === locale && <Check className="h-4 w-4 text-accent-500" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
