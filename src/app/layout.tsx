import './globals.css';
import type { ReactNode } from 'react';

/**
 * Pass-through root layout. The real <html> element lives in app/[locale]/layout.tsx
 * because the lang/dir attributes depend on the active locale.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
