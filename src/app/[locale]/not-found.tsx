import Link from 'next/link';

export default function LocaleNotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl font-extrabold text-brand-600 dark:text-brand-300">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">الصفحة غير موجودة — Page not found</h1>
      <p className="muted mt-2 text-sm">الرابط الذي طلبته غير متاح أو تم نقله.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/ar" className="btn-primary">
          الرئيسية
        </Link>
        <Link href="/en" className="btn-outline">
          Home
        </Link>
      </div>
    </div>
  );
}
