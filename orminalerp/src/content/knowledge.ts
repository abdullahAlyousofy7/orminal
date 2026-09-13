import type { I18nText } from '@/i18n/config';

export type KnowledgeCategory = { id: string; icon: string; label: I18nText };

export const knowledgeCategories: KnowledgeCategory[] = [
  { id: 'start', icon: 'Rocket', label: { ar: 'البدء السريع', en: 'Getting started' } },
  { id: 'accounting', icon: 'Calculator', label: { ar: 'الحسابات والمالية', en: 'Accounting' } },
  { id: 'inventory', icon: 'Boxes', label: { ar: 'المخزون والمستودعات', en: 'Inventory' } },
  { id: 'sales', icon: 'ShoppingCart', label: { ar: 'المبيعات ونقاط البيع', en: 'Sales & POS' } },
  { id: 'hr', icon: 'Users', label: { ar: 'الموارد البشرية', en: 'Human resources' } },
  { id: 'reports', icon: 'BarChart3', label: { ar: 'التقارير والتحليلات', en: 'Reports' } },
  { id: 'security', icon: 'ShieldCheck', label: { ar: 'الأمان والصلاحيات', en: 'Security' } },
];

export type Article = {
  id: string;
  category: string;
  title: I18nText;
  body: I18nText;
  minutes: number;
};

export const articles: Article[] = [
  {
    id: 'first-steps',
    category: 'start',
    minutes: 4,
    title: { ar: 'إعداد حسابك في خمس خطوات', en: 'Set up your account in five steps' },
    body: {
      ar: 'إنشاء المنشأة، تحديد السنة المالية، إضافة الفروع والمخازن، ثم دعوة فريقك.',
      en: 'Create the company, set the fiscal year, add branches and warehouses, then invite your team.',
    },
  },
  {
    id: 'import-data',
    category: 'start',
    minutes: 6,
    title: { ar: 'ترحيل بياناتك من نظامك القديم', en: 'Migrate data from your old system' },
    body: {
      ar: 'قوالب Excel جاهزة لترحيل الأصناف والعملاء والأرصدة الافتتاحية بدقة.',
      en: 'Ready Excel templates to migrate items, customers and opening balances accurately.',
    },
  },
  {
    id: 'chart-accounts',
    category: 'accounting',
    minutes: 7,
    title: { ar: 'بناء دليل حسابات مرن', en: 'Build a flexible chart of accounts' },
    body: {
      ar: 'تصميم الأدلة الفرعية ومراكز التكلفة بما يخدم تقاريرك المستقبلية.',
      en: 'Design sub-ledgers and cost centers that serve your future reporting needs.',
    },
  },
  {
    id: 'tax',
    category: 'accounting',
    minutes: 5,
    title: { ar: 'إعداد الضريبة والإقرارات', en: 'Configure tax and declarations' },
    body: {
      ar: 'ضبط نسب الضريبة على الأصناف والفواتير واستخراج الإقرار الدوري.',
      en: 'Set tax rates on items and invoices and export the periodic declaration.',
    },
  },
  {
    id: 'barcode',
    category: 'inventory',
    minutes: 5,
    title: { ar: 'الباركود وأرقام الدفعات', en: 'Barcodes and batch numbers' },
    body: {
      ar: 'طرق ترقيم الأصناف وربط الدفعات وتواريخ الصلاحية بحركة المخزون.',
      en: 'Item numbering approaches and linking batches and expiry dates to stock movement.',
    },
  },
  {
    id: 'stocktake',
    category: 'inventory',
    minutes: 6,
    title: { ar: 'تنفيذ جرد دون إيقاف العمل', en: 'Run a stock count without downtime' },
    body: {
      ar: 'خطة جرد دوري بالفروع مع تسوية الفروقات ومعالجتها محاسبيًا.',
      en: 'A cyclical count plan per branch with variance settlement and accounting treatment.',
    },
  },
  {
    id: 'pos-setup',
    category: 'sales',
    minutes: 4,
    title: { ar: 'تشغيل نقطة بيع جديدة', en: 'Launch a new POS terminal' },
    body: {
      ar: 'ربط الطابعة والدرج، تحديد المنافذ، وضبط طرق الدفع والورديات.',
      en: 'Connect printer and drawer, define outlets, and configure payments and shifts.',
    },
  },
  {
    id: 'einvoice',
    category: 'sales',
    minutes: 5,
    title: { ar: 'الفاتورة الإلكترونية عمليًا', en: 'E-invoicing in practice' },
    body: {
      ar: 'حقول الفاتورة الإلزامية، رمز الاستجابة السريعة، وأرشفة النسخ.',
      en: 'Mandatory invoice fields, QR code and archiving of copies.',
    },
  },
  {
    id: 'payroll',
    category: 'hr',
    minutes: 8,
    title: { ar: 'دورة الرواتب الشهرية', en: 'The monthly payroll cycle' },
    body: {
      ar: 'من الحضور إلى الاستحقاقات والاستقطاعات وحتى القيد المحاسبي النهائي.',
      en: 'From attendance to earnings and deductions through to the final journal entry.',
    },
  },
  {
    id: 'kpi',
    category: 'reports',
    minutes: 6,
    title: { ar: 'لوحات المؤشرات التي تحتاجها الإدارة', en: 'The dashboards management needs' },
    body: {
      ar: 'مؤشرات الربحية والسيولة ودوران المخزون في لوحة واحدة.',
      en: 'Profitability, liquidity and inventory turnover in a single dashboard.',
    },
  },
  {
    id: 'roles',
    category: 'security',
    minutes: 5,
    title: { ar: 'تصميم الصلاحيات بأمان', en: 'Design permissions safely' },
    body: {
      ar: 'مبدأ الحد الأدنى من الصلاحيات، فصل المهام، ومراجعة سجل التدقيق.',
      en: 'Least-privilege, separation of duties and reviewing the audit trail.',
    },
  },
  {
    id: 'backup',
    category: 'security',
    minutes: 3,
    title: { ar: 'النسخ الاحتياطي والاستعادة', en: 'Backup and restore' },
    body: {
      ar: 'جدولة النسخ التلقائي واختبار الاستعادة بشكل دوري.',
      en: 'Schedule automated backups and test restores periodically.',
    },
  },
];
