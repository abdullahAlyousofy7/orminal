'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import type { Locale } from '@/i18n/config';

export function SignOutButton({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await getSupabaseBrowser()?.auth.signOut();
        router.push(`/${locale}`);
        router.refresh();
      }}
      className="btn-outline disabled:opacity-60"
    >
      <LogOut className="h-4 w-4 rtl:-scale-x-100" />
      {label}
    </button>
  );
}
