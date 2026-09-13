'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, LogIn, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { LocaleSwitch } from './LocaleSwitch';
import { ThemeToggle } from './ThemeToggle';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

type NavLink = { href: string; label: string };

export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '';
  const onHome = pathname === `/${locale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const home = `/${locale}`;
  const links: NavLink[] = [
    { href: onHome ? '#top' : home, label: dict.nav.home },
    { href: onHome ? '#features' : `${home}#features`, label: dict.nav.features },
    { href: onHome ? '#pricing' : `${home}#pricing`, label: dict.nav.pricing },
    { href: onHome ? '#knowledge' : `${home}#knowledge`, label: dict.nav.knowledge },
    { href: onHome ? '#about' : `${home}#about`, label: dict.nav.about },
    { href: onHome ? '#partners' : `${home}#partners`, label: dict.nav.partners },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled ? 'shadow-card backdrop-blur-xl' : 'border-transparent'
      }`}
      style={{ background: scrolled ? 'color-mix(in srgb, var(--surface) 88%, transparent)' : 'var(--surface)' }}
    >
      <nav className="container-page flex h-[70px] items-center justify-between gap-3" aria-label="Main">
        <Logo locale={locale} />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="relative rounded-lg px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-brand-500 after:transition-transform hover:text-brand-600 hover:after:scale-x-100 dark:hover:text-brand-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <LocaleSwitch locale={locale} />
            <ThemeToggle labels={{ theme: dict.nav.theme, light: dict.nav.light, dark: dict.nav.dark }} />
          </div>
          <Link href={`/${locale}/login`} className="btn-outline hidden h-10 px-4 py-0 sm:inline-flex">
            <LogIn className="h-4 w-4" />
            {dict.nav.login}
          </Link>
          <Link href={`/${locale}/trial`} className="btn-primary hidden h-10 px-4 py-0 md:inline-flex">
            {dict.nav.tryFree}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border lg:hidden"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden border-t transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? 'max-h-[32rem] opacity-100' : 'max-h-0 border-transparent opacity-0'
        }`}
        style={{ background: 'var(--surface)' }}
      >
        <ul className="container-page grid gap-1 py-4">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="block rounded-xl px-3 py-3 text-sm font-semibold hover:bg-brand-50 dark:hover:bg-white/5"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 flex items-center gap-2">
            <LocaleSwitch locale={locale} />
            <ThemeToggle labels={{ theme: dict.nav.theme, light: dict.nav.light, dark: dict.nav.dark }} />
          </li>
          <li className="mt-2 grid grid-cols-2 gap-2">
            <Link href={`/${locale}/login`} className="btn-outline">
              {dict.nav.login}
            </Link>
            <Link href={`/${locale}/trial`} className="btn-primary">
              {dict.nav.tryFree}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
