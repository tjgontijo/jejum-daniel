import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales } from './locales';
import { getToken } from 'next-auth/jwt';

// Rotas que requerem autenticação
const protectedRoutes = [
  '/dashboard',
  // Adicione outras rotas protegidas aqui
];

// Rotas públicas (não requerem autenticação)
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/reset-password-request',
  '/auth/verify',
  // Adicione outras rotas públicas aqui
];

// Middleware para internacionalização
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'pt-BR',
  localePrefix: 'as-needed',
});

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Primeiro, aplicamos o middleware de internacionalização
  const response = intlMiddleware(request);
  
  // Verificamos se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(`/${request.nextUrl.locale}${route}`) || 
    (request.nextUrl.locale === undefined && pathname.startsWith(route))
  );
  
  if (isProtectedRoute) {
    // Verificar autenticação
    const token = await getToken({ req: request });
    
    if (!token) {
      // Redirecionar para a página inicial (login) se não estiver autenticado
      const url = new URL('/', request.url);
      if (request.nextUrl.locale) {
        url.pathname = `/${request.nextUrl.locale}`;
      }
      return NextResponse.redirect(url);
    }
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
