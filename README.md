# Orminal ERP — الموقع التعريفي / Marketing site

موقع تعريفي احترافي لنظام **Orminal ERP**، ثنائي اللغة (عربي أساسي RTL + إنجليزي LTR) وثنائي المظهر (فاتح/داكن)، مبني بـ Next.js 15 App Router وTailwind CSS وFramer Motion، مع بوابة شركاء حقيقية على Supabase وبريد عبر Resend.

A bilingual (Arabic-first) marketing site for **Orminal ERP** with a real partner portal.

---

## المزايا / Features

- صفحة رئيسية واحدة بأقسام: البطل، الميزات (8 بطاقات)، برنامج الشركاء + قطاعات الأعمال، المعرفة والدعم (بحث + فئات + فيديو)، الأسعار (3 خطط + جدول مقارنة)، حولنا، تواصل معنا.
- مُهيئ الأنظمة التفاعلي `/[locale]/pricing/configure`: اختيار الوحدات، الإضافات (مستخدمين/فروع/مخازن/موظفين)، قسائم خصم، وحساب السعر لحظيًا.
- بوابة الشركاء: إنشاء حساب كامل الحقول، تسجيل دخول، لوحة محمية `/[locale]/partners/dashboard`.
- صفحة الشروط والأحكام، تجربة مجانية، تسجيل دخول عام، صفحة 404.
- تبديل اللغة (يحفظ الاختيار في كوكي) وتبديل المظهر بدون وميض، حركات دقيقة تحترم `prefers-reduced-motion`.

## التقنيات / Stack

| الطبقة | التقنية |
| --- | --- |
| الإطار | Next.js 15 (App Router, TypeScript) |
| التنسيق | Tailwind CSS 3 + متغيرات CSS للثيم |
| الحركة | Framer Motion |
| الثيم | next-themes |
| الحسابات | Supabase Auth + جدول `partners` مع RLS |
| البريد | Resend (Route Handlers) |
| الأيقونات | lucide-react |

## التشغيل محليًا / Local development

```bash
npm install
cp .env.example .env.local   # ثم أضف مفاتيحك
npm run dev                  # http://localhost:3000 → يحوّل إلى /ar
```

سكربتات: `npm run dev` · `npm run build` · `npm start` · `npm run typecheck`

## متغيرات البيئة / Environment variables

| المتغير | إلزامي | الوصف |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | لتفعيل الحسابات | رابط مشروع Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | لتفعيل الحسابات | مفتاح anon العام |
| `RESEND_API_KEY` | لتفعيل البريد | مفتاح Resend |
| `CONTACT_FROM_EMAIL` | اختياري | المُرسِل (نطاق موثّق في Resend) |
| `CONTACT_TO_EMAIL` | اختياري | بريد استقبال النماذج |
| `NEXT_PUBLIC_SITE_URL` | اختياري | العنوان العام للموقع |

بدون هذه المفاتيح يعمل الموقع بالكامل، وتظهر رسالة واضحة في شاشات الحسابات، وتُسجَّل النماذج في السجل بدل إرسالها.

## إعداد Supabase

1. أنشئ مشروعًا على [supabase.com](https://supabase.com).
2. Project Settings → API: انسخ `Project URL` و`anon public key` إلى متغيرات البيئة.
3. SQL Editor → نفّذ ملف [`supabase/schema.sql`](supabase/schema.sql) (ينشئ جدول `partners` وسياسات RLS ومزامنة بيانات التسجيل).
4. Authentication → Providers → Email: أوقف "Confirm email" إن رغبت بتسجيل دخول تلقائي مباشرة بعد إنشاء حساب الشريك.

## النشر على Vercel

1. استورد المستودع في Vercel (Framework: Next.js — يُكتشف تلقائيًا).
2. أضف متغيرات البيئة أعلاه في Settings → Environment Variables.
3. Deploy. العنوان المستهدف: `https://orminal-erp.vercel.app` (Settings → Domains).

## هيكل المشروع

```
src/
  app/
    [locale]/            الصفحات (الرئيسية، الأسعار/المهيئ، الشركاء، الشروط، التجربة، الدخول)
    api/                 contact + partners/welcome (Resend)
  components/            التنقل، التذييل، الأقسام، النماذج، المهيئ
  content/               بيانات المحتوى ثنائية اللغة (ميزات، أسعار، وحدات، محتوى معرفي، شروط)
  i18n/                  إعداد اللغات والقواميس
  lib/supabase/          عملاء Supabase (متصفح/خادم)
  middleware.ts          تحويل اللغة + تحديث جلسة Supabase
supabase/schema.sql      مخطط قاعدة البيانات وسياسات RLS
```

## تخصيص المحتوى

- الأسعار والخطط وجدول المقارنة: `src/content/pricing.ts`
- الوحدات والإضافات وقسائم الخصم: `src/content/modules.ts`
- الميزات وقطاعات الأعمال: `src/content/features.ts`
- المقالات والفئات: `src/content/knowledge.ts`
- كل النصوص الواجهية: `src/i18n/dictionaries.ts`

> البيانات الرقمية (الأسعار، الإحصاءات، المقالات) بيانات افتراضية واقعية للعرض، عدّلها قبل الإطلاق التجاري.
