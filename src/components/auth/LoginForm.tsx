'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertTriangle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { getSupabaseBrowser, supabaseConfigured } from '@/lib/supabase/client';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export function LoginForm({
  locale,
  dict,
  redirectTo,
  registerHref,
}: {
  locale: Locale;
  dict: Dictionary;
  redirectTo: string;
  registerHref?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<'idle' | 'working' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setStatus('error');
      setMessage(dict.auth.notConfigured);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setMessage(dict.auth.invalidEmail);
      return;
    }

    setStatus('working');
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus('error');
      setMessage(error.message || dict.auth.genericError);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label className="label" htmlFor="login-email">
          {dict.auth.email}
        </label>
        <input
          id="login-email"
          type="email"
          dir="ltr"
          required
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div>
        <label className="label" htmlFor="login-password">
          {dict.auth.password}
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={show ? 'text' : 'password'}
            dir="ltr"
            required
            className="field pe-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute inset-y-0 end-3 my-auto inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-brand-50 dark:hover:bg-white/5"
            aria-label={dict.auth.password}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {message && <p className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 dark:bg-red-500/10">{message}</p>}

      <button type="submit" disabled={status === 'working'} className="btn-primary w-full disabled:opacity-60">
        {status === 'working' ? dict.auth.working : dict.auth.submitLogin}
        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
      </button>

      <div className="flex items-center justify-between text-xs">
        {registerHref ? (
          <p className="muted">
            {dict.auth.noAccount}{' '}
            <Link href={registerHref} className="font-semibold text-brand-600 dark:text-brand-300">
              {dict.auth.createOne}
            </Link>
          </p>
        ) : (
          <span />
        )}
        <Link href={`/${locale}#contact`} className="muted link-quiet">
          {dict.auth.forgot}
        </Link>
      </div>
    </form>
  );
}
