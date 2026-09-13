import type { I18nText } from '@/i18n/config';

export type PlanId = 'starter' | 'professional' | 'enterprise';
export type Cycle = 'monthly' | 'annual';

export type Plan = {
  id: PlanId;
  name: I18nText;
  blurb: I18nText;
  /** Price in USD. */
  price: Record<Cycle, number>;
  tone: 'brand' | 'accent' | 'navy';
  popular?: boolean;
};

export const plans: Plan[] = [
  {
    id: 'starter',
    name: { ar: 'Orminal Starter', en: 'Orminal Starter' },
    blurb: {
      ar: 'للمنشآت الصغيرة التي تبدأ رحلة الأتمتة بفرع واحد.',
      en: 'For small businesses starting automation with a single branch.',
    },
    price: { annual: 200, monthly: 20 },
    tone: 'brand',
  },
  {
    id: 'professional',
    name: { ar: 'Orminal Professional', en: 'Orminal Professional' },
    blurb: {
      ar: 'للمنشآت النامية التي تدير فروعًا ومخازن متعددة.',
      en: 'For growing companies running multiple branches and warehouses.',
    },
    price: { annual: 400, monthly: 40 },
    tone: 'accent',
    popular: true,
  },
  {
    id: 'enterprise',
    name: { ar: 'Orminal Enterprise', en: 'Orminal Enterprise' },
    blurb: {
      ar: 'للمجموعات والشركات الكبرى باحتياجات تشغيلية معقدة.',
      en: 'For groups and large enterprises with complex operations.',
    },
    price: { annual: 800, monthly: 80 },
    tone: 'navy',
  },
];

export function planById(id: PlanId): Plan {
  return plans.find((p) => p.id === id) ?? plans[0];
}

/** true = included, false = not included, string/number = quantity or note. */
export type CellValue = boolean | number | I18nText;

export type CompareRow = { label: I18nText; values: Record<PlanId, CellValue> };
export type CompareGroup = { id: string; title: I18nText; rows: CompareRow[] };

const unlimited: I18nText = { ar: 'غير محدود', en: 'Unlimited' };

export const compareGroups: CompareGroup[] = [
  {
    id: 'system',
    title: { ar: 'إدارة النظام', en: 'System management' },
    rows: [
      {
        label: { ar: 'المستخدمون', en: 'Users' },
        values: { starter: 2, professional: 5, enterprise: 25 },
      },
      {
        label: { ar: 'الفروع', en: 'Branches' },
        values: { starter: 1, professional: 2, enterprise: 10 },
      },
      {
        label: { ar: 'المخازن', en: 'Warehouses' },
        values: { starter: 2, professional: 4, enterprise: unlimited },
      },
      {
        label: { ar: 'سجل التدقيق الكامل', en: 'Full audit trail' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'صلاحيات متقدمة بالشاشة', en: 'Screen-level permissions' },
        values: { starter: false, professional: true, enterprise: true },
      },
    ],
  },
  {
    id: 'accounts',
    title: { ar: 'إدارة الحسابات', en: 'Accounting' },
    rows: [
      {
        label: { ar: 'الأدلة الفرعية', en: 'Sub-ledgers' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'متعدد العملات', en: 'Multi-currency' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'دورة الشيكات', en: 'Cheque cycle' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'التقارير المالية', en: 'Financial statements' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'الإقرارات الضريبية', en: 'Tax declarations' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'مراكز التكلفة', en: 'Cost centers' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'الموازنات التقديرية', en: 'Budgeting' },
        values: { starter: false, professional: false, enterprise: true },
      },
    ],
  },
  {
    id: 'inventory',
    title: { ar: 'إدارة المخزون والمشتريات', en: 'Inventory & purchasing' },
    rows: [
      {
        label: { ar: 'وحدات الصنف', en: 'Item units' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'تاريخ الانتهاء للأصناف', en: 'Item expiry dates' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'أرقام الدفعات', en: 'Batch numbers' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'المنتجات والخدمات', en: 'Products & services' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'تتبّع المخزون', en: 'Stock tracking' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'جرد المخزون', en: 'Stock count' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'توزيع المصروفات', en: 'Landed cost allocation' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'أوامر الشراء', en: 'Purchase orders' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'فواتير المشتريات', en: 'Purchase invoices' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'الأصناف المركّبة', en: 'Composite items' },
        values: { starter: false, professional: false, enterprise: true },
      },
    ],
  },
  {
    id: 'sales',
    title: { ar: 'إدارة المبيعات', en: 'Sales management' },
    rows: [
      {
        label: { ar: 'مستويات التسعيرة', en: 'Price levels' },
        values: { starter: 1, professional: 4, enterprise: unlimited },
      },
      {
        label: { ar: 'منافذ البيع', en: 'Sales outlets' },
        values: { starter: 2, professional: 5, enterprise: 20 },
      },
      {
        label: { ar: 'نقاط البيع', en: 'POS terminals' },
        values: { starter: 2, professional: 5, enterprise: 20 },
      },
      {
        label: { ar: 'الفاتورة الإلكترونية', en: 'E-invoicing' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'نقاط بيع سحابية', en: 'Cloud POS' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'قائمة الأسعار', en: 'Price list' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'عروض الأسعار', en: 'Quotations' },
        values: { starter: true, professional: true, enterprise: true },
      },
      {
        label: { ar: 'طلبات العملاء', en: 'Customer orders' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'نقاط الولاء', en: 'Loyalty points' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'المتجر الإلكتروني', en: 'Online store' },
        values: { starter: false, professional: false, enterprise: true },
      },
    ],
  },
  {
    id: 'people',
    title: { ar: 'الموارد البشرية والدعم', en: 'HR & support' },
    rows: [
      {
        label: { ar: 'كشوف الرواتب', en: 'Payroll' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'الحضور والانصراف', en: 'Attendance' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'تطبيق الخدمة الذاتية', en: 'Self-service app' },
        values: { starter: false, professional: false, enterprise: true },
      },
      {
        label: { ar: 'إدارة علاقات العملاء CRM', en: 'CRM' },
        values: { starter: false, professional: true, enterprise: true },
      },
      {
        label: { ar: 'الدعم الفني', en: 'Support' },
        values: {
          starter: { ar: 'بريد إلكتروني', en: 'Email' },
          professional: { ar: 'بريد وهاتف', en: 'Email & phone' },
          enterprise: { ar: 'مدير حساب مخصص', en: 'Dedicated manager' },
        },
      },
      {
        label: { ar: 'تدريب الفريق', en: 'Team training' },
        values: {
          starter: false,
          professional: { ar: 'جلستان', en: '2 sessions' },
          enterprise: { ar: 'برنامج كامل', en: 'Full program' },
        },
      },
    ],
  },
];
