'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertTriangle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { getSupabaseBrowser, supabaseConfigured } from '@/lib/supabase/client';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

type Values = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  activity: string;
  website: string;
  commercialRegister: string;
  employeesCount: string;
  password: string;
  confirmPassword: string;
  notes: string;
  agree: boolean;
};

const initial: Values = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  activity: '',
  website: '',
  commercialRegister: '',
  employeesCount: '',
  password: '',
  confirmPassword: '',
  notes: '',
  agree: false,
};

const countries = [
  { ar: 'اليمن', en: 'Yemen' },
  { ar: 'السعودية', en: 'Saudi Arabia' },
  { ar: 'الإمارات', en: 'United Arab Emirates' },
  { ar: 'عمان', en: 'Oman' },
  { ar: 'قطر', en: 'Qatar' },
  { ar: 'الكويت', en: 'Kuwait' },
  { ar: 'البحرين', en: 'Bahrain' },
  { ar: 'مصر', en: 'Egypt' },
  { ar: 'الأردن', en: 'Jordan' },
  { ar: 'أخرى', en: 'Other' },
];

const activities = [
  { ar: 'بيع وتوزيع برمجيات', en: 'Software reselling' },
  { ar: 'خدمات محاسبية', en: 'Accounting services' },
  { ar: 'استشارات تقنية', en: 'IT consulting' },
  { ar: 'تجزئة وتجارة', en: 'Retail & trade' },
  { ar: 'تدريب وتأهيل', en: 'Training' },
  { ar: 'أخرى', en: 'Other' },
];

export function PartnerRegisterForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<'idle' | 'working' | 'error' | 'done'>('idle');
  const [message, setMessage] = useState('');
  const [showPass, setShowPass] = useState(false);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Values, string>> = {};
    const requiredKeys: (keyof Values)[] = [
      'companyName',
      'contactName',
      'email',
      'phone',
      'country',
      'city',
      'activity',
      'password',
      'confirmPassword',
    ];
    requiredKeys.forEach((k) => {
      if (!String(values[k] ?? '').trim()) next[k] = dict.auth.required;
    });
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) next.email = dict.auth.invalidEmail;
    if (values.password && values.password.length < 8) next.password = dict.auth.weakPassword;
    if (values.password && values.confirmPassword && values.password !== values.confirmPassword)
      next.confirmPassword = dict.auth.passwordMismatch;
    if (!values.agree) next.agree = dict.auth.mustAgree;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setStatus('error');
      setMessage(dict.auth.notConfigured);
      return;
    }

    setStatus('working');
    setMessage('');

    const partnerProfile = {
      company_name: values.companyName,
      contact_name: values.contactName,
      phone: values.phone,
      country: values.country,
      city: values.city,
      activity: values.activity,
      website: values.website || null,
      commercial_register: values.commercialRegister || null,
      employees_count: values.employeesCount ? Number(values.employeesCount) : null,
      notes: values.notes || null,
    };

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { role: 'partner', ...partnerProfile } },
    });

    if (error) {
      setStatus('error');
      setMessage(error.message || dict.auth.genericError);
      return;
    }

    if (data.user) {
      await supabase.from('partners').upsert({ id: data.user.id, email: values.email, ...partnerProfile });
    }

    // Fire-and-forget welcome email; never block the signup flow on it.
    void fetch('/api/partners/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.email, companyName: values.companyName, locale }),
    }).catch(() => undefined);

    if (data.session) {
      setStatus('done');
      router.push(`/${locale}/partners/dashboard`);
      return;
    }

    // Email confirmation is enabled on the project — send the partner to sign in.
    setStatus('done');
    setMessage(
      locale === 'ar'
        ? 'تم إنشاء حسابك. تحقق من بريدك لتأكيد الحساب ثم سجّل الدخول.'
        : 'Account created. Check your email to confirm it, then sign in.',
    );
  }

  const inputClass = (key: keyof Values) => `field ${errors[key] ? 'border-red-500 focus:border-red-500' : ''}`;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="companyName">
            {dict.auth.companyName} *
          </label>
          <input
            id="companyName"
            className={inputClass('companyName')}
            value={values.companyName}
            onChange={(e) => set('companyName', e.target.value)}
            autoComplete="organization"
          />
          {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
        </div>
        <div>
          <label className="label" htmlFor="contactName">
            {dict.auth.contactName} *
          </label>
          <input
            id="contactName"
            className={inputClass('contactName')}
            value={values.contactName}
            onChange={(e) => set('contactName', e.target.value)}
            autoComplete="name"
          />
          {errors.contactName && <p className="mt-1 text-xs text-red-500">{errors.contactName}</p>}
        </div>
        <div>
          <label className="label" htmlFor="email">
            {dict.auth.email} *
          </label>
          <input
            id="email"
            type="email"
            dir="ltr"
            className={inputClass('email')}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label className="label" htmlFor="phone">
            {dict.auth.phone} *
          </label>
          <input
            id="phone"
            dir="ltr"
            className={inputClass('phone')}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
            placeholder="+967 7xx xxx xxx"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>
        <div>
          <label className="label" htmlFor="country">
            {dict.auth.country} *
          </label>
          <select
            id="country"
            className={inputClass('country')}
            value={values.country}
            onChange={(e) => set('country', e.target.value)}
          >
            <option value="">—</option>
            {countries.map((c) => (
              <option key={c.en} value={c.en}>
                {c[locale]}
              </option>
            ))}
          </select>
          {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
        </div>
        <div>
          <label className="label" htmlFor="city">
            {dict.auth.city} *
          </label>
          <input
            id="city"
            className={inputClass('city')}
            value={values.city}
            onChange={(e) => set('city', e.target.value)}
            autoComplete="address-level2"
          />
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>
        <div>
          <label className="label" htmlFor="activity">
            {dict.auth.activity} *
          </label>
          <select
            id="activity"
            className={inputClass('activity')}
            value={values.activity}
            onChange={(e) => set('activity', e.target.value)}
          >
            <option value="">—</option>
            {activities.map((a) => (
              <option key={a.en} value={a.en}>
                {a[locale]}
              </option>
            ))}
          </select>
          {errors.activity && <p className="mt-1 text-xs text-red-500">{errors.activity}</p>}
        </div>
        <div>
          <label className="label" htmlFor="employeesCount">
            {dict.auth.employeesCount} <span className="muted">({dict.auth.optional})</span>
          </label>
          <input
            id="employeesCount"
            type="number"
            min={1}
            dir="ltr"
            className="field"
            value={values.employeesCount}
            onChange={(e) => set('employeesCount', e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="commercialRegister">
            {dict.auth.commercialRegister} <span className="muted">({dict.auth.optional})</span>
          </label>
          <input
            id="commercialRegister"
            dir="ltr"
            className="field"
            value={values.commercialRegister}
            onChange={(e) => set('commercialRegister', e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="website">
            {dict.auth.website} <span className="muted">({dict.auth.optional})</span>
          </label>
          <input
            id="website"
            dir="ltr"
            className="field"
            placeholder="https://"
            value={values.website}
            onChange={(e) => set('website', e.target.value)}
            autoComplete="url"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            {dict.auth.password} *
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              dir="ltr"
              className={`${inputClass('password')} pe-11`}
              value={values.password}
              onChange={(e) => set('password', e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute inset-y-0 end-3 my-auto inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-brand-50 dark:hover:bg-white/5"
              aria-label={dict.auth.password}
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>
        <div>
          <label className="label" htmlFor="confirmPassword">
            {dict.auth.confirmPassword} *
          </label>
          <input
            id="confirmPassword"
            type="password"
            dir="ltr"
            className={inputClass('confirmPassword')}
            value={values.confirmPassword}
            onChange={(e) => set('confirmPassword', e.target.value)}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="notes">
            {dict.auth.notes} <span className="muted">({dict.auth.optional})</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            className="field resize-y"
            value={values.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>
      </div>

      <label className="flex items-start gap-2.5 text-xs">
        <input
          type="checkbox"
          checked={values.agree}
          onChange={(e) => set('agree', e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-2 accent-brand-600"
        />
        <span>
          {dict.auth.agree}{' '}
          <Link href={`/${locale}/terms`} className="font-semibold text-brand-600 underline dark:text-brand-300">
            {dict.footer.terms}
          </Link>
        </span>
      </label>
      {errors.agree && <p className="text-xs text-red-500">{errors.agree}</p>}

      {message && (
        <p
          className={`rounded-xl p-3 text-xs font-semibold ${status === 'error'
              ? 'bg-red-50 text-red-600 dark:bg-red-500/10'
              : 'bg-accent-50 text-accent-600 dark:bg-accent-500/10'
            }`}
        >
          {message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === 'working'} className="btn-primary min-w-[11rem] disabled:opacity-60">
          {status === 'working' ? dict.auth.working : dict.auth.submitRegister}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </button>
        <p className="text-xs muted">
          {dict.auth.haveAccount}{' '}
          <Link href={`/${locale}/partners/login`} className="font-semibold text-brand-600 dark:text-brand-300">
            {dict.auth.signIn}
          </Link>
        </p>
      </div>
    </form>
  );
}
