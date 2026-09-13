import type { I18nText } from '@/i18n/config';
import type { Cycle, PlanId } from './pricing';

export type ModuleItem = {
  id: string;
  label: I18nText;
  /** Yearly add-on price in USD; 0 means bundled with the group. */
  price: number;
  /** Plans where the module is already bundled at no extra cost. */
  includedIn?: PlanId[];
};

export type ModuleGroup = {
  id: string;
  title: I18nText;
  icon: string;
  items: ModuleItem[];
};

export const moduleGroups: ModuleGroup[] = [
  {
    id: 'finance',
    title: { ar: 'الحسابات والمالية', en: 'Accounting & finance' },
    icon: 'Landmark',
    items: [
      {
        id: 'gl',
        label: { ar: 'الأستاذ العام', en: 'General ledger' },
        price: 0,
        includedIn: ['starter', 'professional', 'enterprise'],
      },
      { id: 'banks', label: { ar: 'إدارة البنوك', en: 'Bank management' }, price: 40 },
      { id: 'ap', label: { ar: 'حسابات الموردين', en: 'Accounts payable' }, price: 40 },
      { id: 'ar', label: { ar: 'حسابات العملاء', en: 'Accounts receivable' }, price: 40 },
      { id: 'costcenters', label: { ar: 'مراكز التكلفة', en: 'Cost centers' }, price: 60 },
    ],
  },
  {
    id: 'inventory',
    title: { ar: 'إدارة المخزون', en: 'Inventory management' },
    icon: 'Boxes',
    items: [
      {
        id: 'stock',
        label: { ar: 'نظام المخزون', en: 'Inventory system' },
        price: 0,
        includedIn: ['starter', 'professional', 'enterprise'],
      },
      { id: 'count', label: { ar: 'نظام الجرد', en: 'Stock count' }, price: 40 },
      { id: 'composite', label: { ar: 'الأصناف المركّبة', en: 'Composite items' }, price: 70 },
    ],
  },
  {
    id: 'purchasing',
    title: { ar: 'إدارة المشتريات', en: 'Purchasing' },
    icon: 'Truck',
    items: [
      { id: 'purchases', label: { ar: 'نظام المشتريات', en: 'Purchasing system' }, price: 60 },
      { id: 'rfq', label: { ar: 'طلبات عروض الشراء', en: 'Purchase RFQs' }, price: 45 },
    ],
  },
  {
    id: 'sales',
    title: { ar: 'إدارة المبيعات', en: 'Sales management' },
    icon: 'ShoppingCart',
    items: [
      {
        id: 'sales',
        label: { ar: 'نظام المبيعات', en: 'Sales system' },
        price: 0,
        includedIn: ['starter', 'professional', 'enterprise'],
      },
      { id: 'pricing', label: { ar: 'نظام التسعيرة', en: 'Pricing system' }, price: 50 },
      { id: 'ecommerce', label: { ar: 'المتجر الإلكتروني', en: 'Online store' }, price: 120 },
    ],
  },
  {
    id: 'pos',
    title: { ar: 'إدارة نظام نقاط البيع', en: 'Point of sale' },
    icon: 'Receipt',
    items: [
      { id: 'pos', label: { ar: 'نقاط البيع السحابية', en: 'Cloud POS' }, price: 80 },
      { id: 'restaurants', label: { ar: 'نظام المطاعم', en: 'Restaurant system' }, price: 95 },
    ],
  },
  {
    id: 'crm',
    title: { ar: 'إدارة علاقات العملاء', en: 'Customer relationship management' },
    icon: 'UserRound',
    items: [
      { id: 'crm', label: { ar: 'نظام CRM', en: 'CRM system' }, price: 90 },
      { id: 'loyalty', label: { ar: 'نقاط الولاء', en: 'Loyalty points' }, price: 45 },
    ],
  },
  {
    id: 'assets',
    title: { ar: 'نظام الأصول الثابتة', en: 'Fixed assets' },
    icon: 'Building2',
    items: [{ id: 'assets', label: { ar: 'إدارة الأصول والإهلاك', en: 'Assets & depreciation' }, price: 70 }],
  },
  {
    id: 'manufacturing',
    title: { ar: 'نظام المنشآت الصناعية', en: 'Manufacturing' },
    icon: 'Factory',
    items: [
      { id: 'production', label: { ar: 'نظام الإنتاج والتكاليف', en: 'Production & costing' }, price: 140 },
      { id: 'bom', label: { ar: 'قوائم المواد', en: 'Bill of materials' }, price: 60 },
    ],
  },
  {
    id: 'hcm',
    title: { ar: 'رأس المال البشري', en: 'Human capital' },
    icon: 'Users',
    items: [
      { id: 'payroll', label: { ar: 'إدارة الأجور والمرتبات', en: 'Payroll' }, price: 100 },
      { id: 'attendance', label: { ar: 'إدارة الحضور والانصراف', en: 'Attendance' }, price: 60 },
      { id: 'leaves', label: { ar: 'إدارة الإجازات', en: 'Leave management' }, price: 40 },
      { id: 'ess', label: { ar: 'تطبيق الخدمة الذاتية للموظفين', en: 'Employee self-service' }, price: 70 },
    ],
  },
  {
    id: 'mobile',
    title: { ar: 'تطبيقات الموبايل', en: 'Mobile apps' },
    icon: 'Smartphone',
    items: [
      { id: 'mobile-sales', label: { ar: 'تطبيق المبيعات الميداني', en: 'Field sales app' }, price: 85 },
      { id: 'mobile-manager', label: { ar: 'تطبيق المدير', en: 'Manager app' }, price: 55 },
    ],
  },
  {
    id: 'projects',
    title: { ar: 'إدارة المشاريع', en: 'Project management' },
    icon: 'Briefcase',
    items: [
      { id: 'projects', label: { ar: 'تتبّع المشاريع والتكاليف', en: 'Project & cost tracking' }, price: 110 },
      { id: 'timesheets', label: { ar: 'جداول ساعات العمل', en: 'Timesheets' }, price: 45 },
    ],
  },
];

export type Addon = {
  id: 'users' | 'branches' | 'warehouses' | 'employees';
  labelKey: 'users' | 'branches' | 'warehouses' | 'employees';
  /** Yearly price per unit in USD. */
  price: number;
  icon: string;
};

export const addons: Addon[] = [
  { id: 'users', labelKey: 'users', price: 60, icon: 'Users' },
  { id: 'branches', labelKey: 'branches', price: 60, icon: 'Building2' },
  { id: 'warehouses', labelKey: 'warehouses', price: 60, icon: 'Boxes' },
  { id: 'employees', labelKey: 'employees', price: 36, icon: 'UserRound' },
];

/** Monthly prices are derived from the yearly figure (annual keeps a ~17% discount). */
export function unitPrice(yearly: number, cycle: Cycle): number {
  return cycle === 'annual' ? yearly : Math.round((yearly / 10) * 100) / 100;
}

export const discountCodes: Record<string, number> = {
  ORMINAL10: 0.1,
  PARTNER15: 0.15,
  LAUNCH20: 0.2,
};
