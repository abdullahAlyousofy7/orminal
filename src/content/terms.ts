import type { I18nText } from '@/i18n/config';

export type TermsSection = { id: string; title: I18nText; paragraphs: I18nText[] };

export const termsUpdated = '2026-08-01';

export const termsSections: TermsSection[] = [
  {
    id: 'definitions',
    title: { ar: '1. التعريفات', en: '1. Definitions' },
    paragraphs: [
      {
        ar: '«الخدمة» تعني منصة Orminal ERP وما يتصل بها من تطبيقات وواجهات برمجية ومواقع. «المشترك» هو الشخص الطبيعي أو الاعتباري الذي يتعاقد على استخدام الخدمة. «المستخدم» هو كل من يمنحه المشترك صلاحية الدخول.',
        en: '"Service" means the Orminal ERP platform and its related applications, APIs and websites. "Subscriber" is the natural or legal person contracting to use the Service. "User" is anyone the Subscriber grants access to.',
      },
    ],
  },
  {
    id: 'subscription',
    title: { ar: '2. الاشتراك والتفعيل', en: '2. Subscription and activation' },
    paragraphs: [
      {
        ar: 'يبدأ الاشتراك من تاريخ التفعيل ويستمر للمدة المختارة (شهرية أو سنوية). يتم التفعيل بعد سداد القيمة المستحقة، وتُحسب الإضافات مثل عدد المستخدمين والفروع والمخازن بشكل تناسبي عند الترقية خلال المدة.',
        en: 'The subscription starts on the activation date and continues for the selected term (monthly or annual). Activation follows payment, and add-ons such as users, branches and warehouses are prorated when upgrading mid-term.',
      },
      {
        ar: 'الأسعار المعروضة بالدولار الأمريكي وغير شاملة الضرائب أو الرسوم الحكومية، وقد تتغير مع إشعار مسبق لا يقل عن ثلاثين يومًا للاشتراكات الجارية.',
        en: 'Prices are shown in US dollars and exclude taxes or government fees; they may change with at least thirty days notice for active subscriptions.',
      },
    ],
  },
  {
    id: 'usage',
    title: { ar: '3. الاستخدام المقبول', en: '3. Acceptable use' },
    paragraphs: [
      {
        ar: 'يتعهد المشترك بعدم استخدام الخدمة في أي نشاط مخالف للقانون، وعدم محاولة اختراق البنية التقنية أو تجاوز حدود الخطة أو إعادة بيع الخدمة دون اتفاق شراكة معتمد.',
        en: 'The Subscriber agrees not to use the Service for unlawful activity, not to attempt to breach the infrastructure, exceed plan limits, or resell the Service without an approved partnership agreement.',
      },
      {
        ar: 'يتحمل المشترك مسؤولية الحفاظ على سرية بيانات الدخول وكل ما يقع من عمليات عبر حسابات مستخدميه.',
        en: 'The Subscriber is responsible for keeping credentials confidential and for all activity performed through its user accounts.',
      },
    ],
  },
  {
    id: 'data',
    title: { ar: '4. البيانات والخصوصية', en: '4. Data and privacy' },
    paragraphs: [
      {
        ar: 'بيانات المشترك ملك له، ونعالجها فقط لتقديم الخدمة والدعم الفني وتحسين الأداء. تُشفّر البيانات أثناء النقل والتخزين، وتُجرى نسخ احتياطية دورية.',
        en: 'Subscriber data belongs to the Subscriber and is processed only to deliver the Service, provide support and improve performance. Data is encrypted in transit and at rest, with periodic backups.',
      },
      {
        ar: 'يمكن للمشترك طلب تصدير بياناته بصيغة قياسية في أي وقت خلال سريان الاشتراك وحتى ثلاثين يومًا بعد انتهائه.',
        en: 'The Subscriber may request a standard-format export at any time during the subscription and for up to thirty days after it ends.',
      },
    ],
  },
  {
    id: 'sla',
    title: { ar: '5. مستوى الخدمة والدعم', en: '5. Service level and support' },
    paragraphs: [
      {
        ar: 'نستهدف جاهزية تشغيلية بنسبة 99.9% شهريًا، مع استثناء أعمال الصيانة المخطّطة المعلنة مسبقًا. تختلف قنوات الدعم وأزمنة الاستجابة حسب الخطة المشترك بها.',
        en: 'We target 99.9% monthly uptime, excluding pre-announced scheduled maintenance. Support channels and response times vary by subscribed plan.',
      },
    ],
  },
  {
    id: 'liability',
    title: { ar: '6. حدود المسؤولية', en: '6. Limitation of liability' },
    paragraphs: [
      {
        ar: 'لا تتحمل Orminal مسؤولية الأضرار غير المباشرة أو فقدان الأرباح الناتج عن الاستخدام، وتقتصر المسؤولية الإجمالية على قيمة الاشتراك المدفوعة خلال الاثني عشر شهرًا السابقة للمطالبة.',
        en: 'Orminal is not liable for indirect damages or lost profits arising from use; total liability is limited to subscription fees paid in the twelve months preceding the claim.',
      },
    ],
  },
  {
    id: 'termination',
    title: { ar: '7. الإنهاء', en: '7. Termination' },
    paragraphs: [
      {
        ar: 'يجوز لأي طرف إنهاء الاتفاقية بإشعار كتابي مدته ثلاثون يومًا. في حال الإخلال الجوهري بالشروط يحق لنا تعليق الخدمة فورًا مع إشعار المشترك بالأسباب.',
        en: 'Either party may terminate with thirty days written notice. In case of material breach we may suspend the Service immediately, notifying the Subscriber of the reasons.',
      },
    ],
  },
  {
    id: 'law',
    title: { ar: '8. القانون الواجب التطبيق', en: '8. Governing law' },
    paragraphs: [
      {
        ar: 'تخضع هذه الشروط لأنظمة الجمهورية اليمنية، وتُحل الخلافات وديًا، وإن تعذّر فبالطرق النظامية المختصة.',
        en: 'These terms are governed by the laws of the Republic of Yemen. Disputes are resolved amicably, failing which through the competent legal channels.',
      },
    ],
  },
];
