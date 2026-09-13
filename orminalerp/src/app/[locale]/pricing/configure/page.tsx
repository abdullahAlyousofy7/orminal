import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Configurator } from '@/components/Configurator';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import type { Cycle, PlanId } from '@/content/pricing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'ar' ? 'حدّد الأنظمة — Orminal ERP' : 'Configure systems — Orminal ERP' };
}

const validPlans: PlanId[] = ['starter', 'professional', 'enterprise'];

export default async function ConfigurePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ plan?: string; cycle?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const { plan, cycle } = await searchParams;

  const initialPlan = validPlans.includes(plan as PlanId) ? (plan as PlanId) : 'professional';
  const initialCycle: Cycle = cycle === 'monthly' ? 'monthly' : 'annual';

  return <Configurator locale={locale} dict={dict} initialPlan={initialPlan} initialCycle={initialCycle} />;
}
