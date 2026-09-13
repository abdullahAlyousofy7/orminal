import type { I18nText } from '@/i18n/config';

export type Feature = {
  id: string;
  icon: string;
  tone: string;
  title: I18nText;
  body: I18nText;
};

/** Eight core feature cards rendered in the home features grid. */
export const features: Feature[] = [
  {
    id: 'accounting',
    icon: 'Calculator',
    tone: 'bg-brand-600',
    title: { ar: 'أتمتة محاسبية متكاملة', en: 'Integrated accounting automation' },
    body: {
      ar: 'أتمتة القيود ودفتر الأستاذ العام وربط الفترات المالية بالتقارير الضريبية وإدارة الأصول.',
      en: 'Automated journal entries, general ledger, fiscal periods linked to tax reporting and asset management.',
    },
  },
  {
    id: 'inventory',
    icon: 'Boxes',
    tone: 'bg-sky2',
    title: { ar: 'إدارة مخزون متقدمة', en: 'Advanced inventory management' },
    body: {
      ar: 'تتبع لحظي بالباركود والرقم التسلسلي وتاريخ الصلاحية، مع مستودعات متعددة وتنبيهات إعادة التوريد.',
      en: 'Real-time tracking by barcode, serial and expiry across multiple warehouses with reorder alerts.',
    },
  },
  {
    id: 'sales-pos',
    icon: 'ShoppingCart',
    tone: 'bg-accent-500',
    title: { ar: 'تكامل المبيعات ونقاط البيع', en: 'Sales & POS integration' },
    body: {
      ar: 'فواتير ذكية، نقاط بيع أونلاين وأوفلاين، تحصيل فوري، ومزامنة كاملة مع المخزون والحسابات.',
      en: 'Smart invoicing, online and offline POS, instant collection and full sync with stock and ledgers.',
    },
  },
  {
    id: 'analytics',
    icon: 'BarChart3',
    tone: 'bg-indigo-600',
    title: { ar: 'تحليلات الأعمال الذكية', en: 'Smart business analytics' },
    body: {
      ar: 'لوحات تفاعلية ومؤشرات أداء لحظية، وتحليل ربحية بالفرع والمنتج والعميل.',
      en: 'Interactive dashboards, live KPIs and profitability analysis by branch, product and customer.',
    },
  },
  {
    id: 'crm',
    icon: 'UserRound',
    tone: 'bg-pink-600',
    title: { ar: 'إدارة علاقات العملاء CRM', en: 'Customer relationship management' },
    body: {
      ar: 'تتبع العملاء والفرص البيعية، سجلات تواصل كاملة، ومتابعة عروض الأسعار حتى الإغلاق.',
      en: 'Track customers and pipelines with complete interaction history and quote-to-close follow-up.',
    },
  },
  {
    id: 'hr',
    icon: 'Users',
    tone: 'bg-orange-500',
    title: { ar: 'أتمتة الموارد البشرية', en: 'HR automation' },
    body: {
      ar: 'كشوف رواتب دقيقة، حضور وانصراف، إجازات وسلف، وخدمة ذاتية للموظفين.',
      en: 'Accurate payroll, attendance, leave and advances, plus employee self-service.',
    },
  },
  {
    id: 'projects',
    icon: 'Briefcase',
    tone: 'bg-teal-600',
    title: { ar: 'تتبع المشاريع', en: 'Project tracking' },
    body: {
      ar: 'مراقبة التكلفة الفعلية مقابل المخططة، جداول زمنية، ومستخلصات ومراحل تسليم.',
      en: 'Actual vs. planned cost control, timelines, milestones and progress billing.',
    },
  },
  {
    id: 'security',
    icon: 'ShieldCheck',
    tone: 'bg-brand-900',
    title: { ar: 'أمن البيانات المتقدم', en: 'Advanced data security' },
    body: {
      ar: 'تشفير للبيانات، صلاحيات وصول دقيقة، سجل تدقيق كامل، ونسخ احتياطي تلقائي.',
      en: 'Data encryption, granular permissions, full audit trail and automated backups.',
    },
  },
];

export type Sector = { id: string; icon: string; tone: string; label: I18nText };

/** Business sectors strip under the partner section. */
export const sectors: Sector[] = [
  {
    id: 'retail',
    icon: 'Store',
    tone: 'text-accent-500 bg-accent-50 dark:bg-accent-500/10',
    label: { ar: 'البقالات والسوبرماركت', en: 'Groceries & supermarkets' },
  },
  {
    id: 'fashion',
    icon: 'Shirt',
    tone: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10',
    label: { ar: 'محلات الملابس والأحذية', en: 'Clothing & footwear' },
  },
  {
    id: 'perfume',
    icon: 'Sparkles',
    tone: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10',
    label: { ar: 'محلات العطور والإكسسوارات', en: 'Perfume & accessories' },
  },
  {
    id: 'construction',
    icon: 'Wrench',
    tone: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
    label: { ar: 'مواد البناء والكهرباء', en: 'Building materials & electrical' },
  },
  {
    id: 'furniture',
    icon: 'Sofa',
    tone: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10',
    label: { ar: 'معارض الأثاث والمفروشات', en: 'Furniture showrooms' },
  },
  {
    id: 'services',
    icon: 'Hammer',
    tone: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10',
    label: { ar: 'الخدمات الحرفية والمتخصصة', en: 'Trade & specialized services' },
  },
  {
    id: 'offices',
    icon: 'Building2',
    tone: 'text-brand-600 bg-brand-50 dark:bg-brand-500/10',
    label: { ar: 'المكاتب وإدارة الأعمال', en: 'Offices & business management' },
  },
  {
    id: 'beauty',
    icon: 'Heart',
    tone: 'text-pink-500 bg-pink-50 dark:bg-pink-500/10',
    label: { ar: 'خدمات العناية الشخصية', en: 'Personal care services' },
  },
  {
    id: 'education',
    icon: 'GraduationCap',
    tone: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10',
    label: { ar: 'التعليم والتدريب', en: 'Education & training' },
  },
  {
    id: 'auto',
    icon: 'Car',
    tone: 'text-sky-500 bg-sky-50 dark:bg-sky-500/10',
    label: { ar: 'معارض السيارات', en: 'Auto dealerships' },
  },
  {
    id: 'restaurants',
    icon: 'UtensilsCrossed',
    tone: 'text-red-500 bg-red-50 dark:bg-red-500/10',
    label: { ar: 'المطاعم والكافيهات', en: 'Restaurants & cafés' },
  },
  {
    id: 'pharma',
    icon: 'Stethoscope',
    tone: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
    label: { ar: 'الصيدليات والمراكز الطبية', en: 'Pharmacies & clinics' },
  },
];
