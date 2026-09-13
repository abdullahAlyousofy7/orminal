export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** Bilingual value helper used across content files. */
export type I18nText = { ar: string; en: string };

export function pick(text: I18nText, locale: Locale): string {
  return text[locale];
}

export function altLocale(locale: Locale): Locale {
  return locale === 'ar' ? 'en' : 'ar';
}

/** Swap the locale segment of a pathname: /ar/pricing -> /en/pricing */
export function swapLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return `/${next}`;
  if (isLocale(parts[0])) {
    parts[0] = next;
    return `/${parts.join('/')}`;
  }
  return `/${next}/${parts.join('/')}`;
}
