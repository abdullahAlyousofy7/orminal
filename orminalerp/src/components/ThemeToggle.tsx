'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle({
  labels,
  variant = 'default',
}: {
  labels: { theme: string; light: string; dark: string };
  variant?: 'default' | 'inverse';
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const base =
    variant === 'inverse'
      ? 'border-white/20 text-white hover:bg-white/10'
      : 'hover:border-brand-400 hover:text-brand-600';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`${labels.theme}: ${isDark ? labels.light : labels.dark}`}
      title={`${labels.theme}: ${isDark ? labels.light : labels.dark}`}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition duration-200 ${base}`}
    >
      <span className="relative block h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
          }`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
          }`}
        />
      </span>
    </button>
  );
}
