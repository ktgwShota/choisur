/**
 * Middleware for Next.js
 *
 * NOTE: Next.js 16 では proxy.ts への移行が推奨されていますが、
 * @opennextjs/cloudflare が proxy.ts に完全対応するまでは middleware.ts を使用します。
 *
 * TODO: @opennextjs/cloudflare が Next.js 16 の proxy.ts に対応したら、
 * 以下の手順で移行してください：
 * 1. このファイルを src/proxy.ts にリネーム
 * 2. export function middleware を export function proxy に変更
 * 3. ビルドとデプロイが正常に動作することを確認
 *
 * 参考: https://nextjs.org/docs/messages/middleware-to-proxy
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function unauthorizedResponse() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin"',
    },
  });
}

function isAdminPath(pathname: string) {
  return pathname === '/dashboard' || pathname.startsWith('/dashboard/');
}

export function middleware(request: NextRequest) {
  if (isAdminPath(request.nextUrl.pathname)) {
    const user = process.env.ADMIN_BASIC_USER;
    const pass = process.env.ADMIN_BASIC_PASS;

    if (!user || !pass) {
      return unauthorizedResponse();
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Basic ')) {
      return unauthorizedResponse();
    }

    const base64 = authHeader.split(' ')[1] || '';
    let decoded = '';
    try {
      decoded = atob(base64);
    } catch {
      return unauthorizedResponse();
    }

    const [inputUser, inputPass] = decoded.split(':');
    if (inputUser !== user || inputPass !== pass) {
      return unauthorizedResponse();
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
