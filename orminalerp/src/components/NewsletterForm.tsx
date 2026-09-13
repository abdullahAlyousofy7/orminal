'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export function NewsletterForm({
  labels,
}: {
  labels: { title: string; body: string; placeholder: string; submit: string; done: string };
}) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) return;
        setDone(true);
        setEmail('');
      }}
      className="rounded-2xl bg-white/5 p-4"
    >
      <p className="text-sm font-bold text-white/90">{labels.title}</p>
      <p className="mt-1 text-xs text-white/60">{labels.body}</p>
      {done ? (
        <p className="mt-3 text-xs font-semibold text-accent-500">{labels.done}</p>
      ) : (
        <div className="mt-3 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={labels.placeholder}
            aria-label={labels.placeholder}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/50 focus:border-sky2"
          />
          <button
            type="submit"
            className="inline-flex h-10 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition hover:bg-sky2"
            aria-label={labels.submit}
          >
            <Send className="h-4 w-4 rtl:-scale-x-100" />
          </button>
        </div>
      )}
    </form>
  );
}
