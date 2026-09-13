import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { defaultLocale, isLocale, locales } from '@/i18n/config';

const PUBLIC_FILE = /\.(.*)$/;

function preferredLocale(request: NextRequest): string {
  const cookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookie && isLocale(cookie)) return cookie;
  const header = request.headers.get('accept-language') ?? '';
  const match = header
    .split(',')
    .map((part) => part.split(';')[0]?.trim().slice(0, 2).toLowerCase())
    .find((code) => code && isLocale(code));
  return match ?? defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const hasLocale = segments.length > 0 && isLocale(segments[0]);

  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });
  response.cookies.set('NEXT_LOCALE', segments[0], { path: '/', maxAge: 60 * 60 * 24 * 365 });

  // Refresh the Supabase session cookie when auth is configured.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          response.cookies.set('NEXT_LOCALE', segments[0], { path: '/', maxAge: 60 * 60 * 24 * 365 });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    await supabase.auth.getUser();
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};

export const supportedLocales = locales;
