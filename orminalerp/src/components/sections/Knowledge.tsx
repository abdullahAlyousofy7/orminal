'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Search, X } from 'lucide-react';
import { Icon } from '@/components/Icon';
import { articles, knowledgeCategories } from '@/content/knowledge';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export function Knowledge({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [playing, setPlaying] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const inCategory = category === 'all' || a.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        a.title[locale].toLowerCase().includes(q) ||
        a.body[locale].toLowerCase().includes(q) ||
        a.title.en.toLowerCase().includes(q)
      );
    });
  }, [query, category, locale]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: articles.length };
    for (const a of articles) map[a.category] = (map[a.category] ?? 0) + 1;
    return map;
  }, []);

  return (
    <section id="knowledge" className="container-page scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="chip mx-auto bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
          {dict.knowledge.kicker}
        </p>
        <h2 className="section-title mt-4">
          {dict.knowledge.title} <span className="text-brand-600 dark:text-brand-300">Orminal ERP</span>
        </h2>
        <p className="muted mt-3 text-base leading-relaxed">{dict.knowledge.subtitle}</p>

        <div className="relative mt-7">
          <Search className="pointer-events-none absolute inset-y-0 start-4 my-auto h-4 w-4 text-[color:var(--ink-soft)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.knowledge.searchPlaceholder}
            aria-label={dict.knowledge.searchPlaceholder}
            className="field h-12 ps-11 pe-11 shadow-card"
            style={{ background: 'var(--surface)' }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={dict.common.close}
              className="absolute inset-y-0 end-3 my-auto inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-brand-50 dark:hover:bg-white/5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide muted">{dict.knowledge.categories}</p>
          <ul className="space-y-1.5">
            {[{ id: 'all', icon: 'Rocket', label: { ar: 'كل الفئات', en: 'All categories' } }, ...knowledgeCategories].map(
              (cat) => {
                const active = category === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      aria-pressed={active}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                        active
                          ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                          : 'hover:border-brand-300 hover:text-brand-600'
                      }`}
                      style={active ? undefined : { background: 'var(--surface)' }}
                    >
                      <span className="flex items-center gap-2">
                        <Icon name={cat.icon} className="h-4 w-4" />
                        {(cat.label as { ar: string; en: string })[locale]}
                      </span>
                      <span className="text-[11px] muted">{counts[cat.id] ?? 0}</span>
                    </button>
                  </li>
                );
              },
            )}
          </ul>

          <div className="card mt-6 overflow-hidden p-0">
            <div className="relative aspect-video">
              {playing ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/ysz5S6PUM-U?autoplay=1&rel=0"
                  title={dict.knowledge.videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="group absolute inset-0 flex items-center justify-center hero-shell"
                  aria-label={dict.knowledge.watch}
                >
                  <span className="absolute inset-0 bg-hero-grid [background-size:34px_34px] opacity-30" />
                  <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-lift transition group-hover:scale-110">
                    <Play className="h-6 w-6 ps-0.5" />
                  </span>
                </button>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm font-bold">{dict.knowledge.videoTitle}</p>
              <p className="muted mt-1 text-xs leading-relaxed">{dict.knowledge.videoBody}</p>
            </div>
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <p className="card muted text-center text-sm">{dict.knowledge.noResults}</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {filtered.map((a, i) => (
                <motion.li
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <article className="card card-hover h-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className="chip bg-brand-50 text-[11px] text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                        {knowledgeCategories.find((c) => c.id === a.category)?.label[locale]}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] muted">
                        <Clock className="h-3.5 w-3.5" />
                        {a.minutes} {locale === 'ar' ? 'د' : 'min'}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-base font-bold leading-snug">{a.title[locale]}</h3>
                    <p className="muted mt-2 text-sm leading-relaxed">{a.body[locale]}</p>
                  </article>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
