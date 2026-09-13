import { addons, discountCodes, moduleGroups, unitPrice } from './modules';
import { plans, type Cycle, type PlanId } from './pricing';

/** Modules bundled into each plan at no extra cost. */
export const baseIncluded: Record<PlanId, string[]> = {
  starter: ['gl', 'stock', 'sales'],
  professional: ['gl', 'stock', 'sales', 'banks', 'ar', 'purchases', 'pricing'],
  enterprise: [
    'gl',
    'stock',
    'sales',
    'banks',
    'ar',
    'ap',
    'purchases',
    'pricing',
    'pos',
    'crm',
    'payroll',
    'attendance',
  ],
};

export type AddonCounts = Record<'users' | 'branches' | 'warehouses' | 'employees', number>;

export type CheckoutConfig = {
  planId: PlanId;
  cycle: Cycle;
  selected: string[];
  counts: AddonCounts;
  code?: string;
};

export type Quote = {
  base: number;
  modulesTotal: number;
  addonsTotal: number;
  discountRate: number;
  total: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Single source of truth for pricing — used by the UI and re-run on the server. */
export function computeQuote(config: CheckoutConfig): Quote {
  const plan = plans.find((p) => p.id === config.planId) ?? plans[0];
  const included = baseIncluded[plan.id] ?? [];
  const { cycle } = config;

  const base = plan.price[cycle];
  const modulesTotal = moduleGroups
    .flatMap((g) => g.items)
    .filter((item) => config.selected.includes(item.id) && !included.includes(item.id))
    .reduce((sum, item) => sum + unitPrice(item.price, cycle), 0);
  const addonsTotal = addons.reduce(
    (sum, addon) => sum + unitPrice(addon.price, cycle) * Math.max(0, (config.counts[addon.id] ?? 1) - 1),
    0,
  );

  const discountRate = config.code ? discountCodes[config.code.trim().toUpperCase()] ?? 0 : 0;
  const subtotal = base + modulesTotal + addonsTotal;

  return {
    base,
    modulesTotal: round2(modulesTotal),
    addonsTotal: round2(addonsTotal),
    discountRate,
    total: round2(subtotal * (1 - discountRate)),
  };
}

const validPlans: PlanId[] = ['starter', 'professional', 'enterprise'];
const knownModuleIds = new Set(moduleGroups.flatMap((g) => g.items.map((i) => i.id)));
const addonKeys = addons.map((a) => a.id);

function clampCount(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return 1;
  return Math.min(999, Math.max(1, n));
}

/** Validate/normalize an untrusted config coming from the client before pricing. */
export function sanitizeConfig(input: unknown): CheckoutConfig | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;

  const planId = validPlans.includes(raw.planId as PlanId) ? (raw.planId as PlanId) : null;
  if (!planId) return null;
  const cycle: Cycle = raw.cycle === 'monthly' ? 'monthly' : 'annual';

  const selectedInput = Array.isArray(raw.selected) ? raw.selected : [];
  const selected = Array.from(
    new Set(
      selectedInput
        .filter((x): x is string => typeof x === 'string')
        .filter((x) => knownModuleIds.has(x))
        .concat(baseIncluded[planId]),
    ),
  );

  const countsInput = (raw.counts ?? {}) as Record<string, unknown>;
  const counts = addonKeys.reduce((acc, key) => {
    acc[key] = clampCount(countsInput[key]);
    return acc;
  }, {} as AddonCounts);

  const code = typeof raw.code === 'string' ? raw.code.slice(0, 40) : '';

  return { planId, cycle, selected, counts, code };
}
